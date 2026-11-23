import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import App from "@/App";
import * as api from "@/api/himti-kit";

vi.mock("@/api/himti-kit");

const mocked = vi.mocked(api);

const appearance = {
  accentColor: "#059669",
  backgroundImageUrl: "https://cdn.example.com/custom-bg.jpg",
  overlayEnabled: true,
  overlayDarkness: 65,
  blurEnabled: true,
  blurIntensity: 4,
};

const session = { nim: "2501234567", name: "Budi", expiresAt: Date.now() + 1e9 };

function renderApp(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.resetAllMocks();
  mocked.getAppearance.mockResolvedValue(appearance);
  mocked.getResources.mockResolvedValue([]);
  mocked.getSoftware.mockResolvedValue([]);
  mocked.logout.mockResolvedValue();
});

describe("route guard", () => {
  test.each(["/kit", "/software"])(
    "redirects signed-out visitors from %s to the login page",
    async (path) => {
      mocked.getSession.mockResolvedValue(null);
      renderApp(path);

      expect(await screen.findByLabelText(/student id/i)).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "Notes" })).toBeNull();
      expect(screen.queryByRole("heading", { name: "Applications" })).toBeNull();
    },
  );

  test("lets a signed-in visitor into /kit and /software", async () => {
    mocked.getSession.mockResolvedValue(session);

    const kit = renderApp("/kit");
    expect(await screen.findByRole("heading", { name: "Notes" })).toBeInTheDocument();
    kit.unmount();

    renderApp("/software");
    expect(await screen.findByRole("heading", { name: "Applications" })).toBeInTheDocument();
  });

  test("shows an error with retry (no redirect) when the session check fails", async () => {
    mocked.getSession.mockRejectedValue(new Error("network down"));
    renderApp("/kit");

    expect(await screen.findByRole("button", { name: /retry/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/student id/i)).toBeNull();
  });
});

describe("login", () => {
  test("rejects a NIM that is not eligible and stays on the login page", async () => {
    mocked.validateNim.mockResolvedValue({ eligible: false });
    renderApp("/");

    await userEvent.type(await screen.findByLabelText(/student id/i), "000");
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(await screen.findByText(/tidak terdaftar/i)).toBeInTheDocument();
    expect(mocked.getSession).not.toHaveBeenCalled();
  });

  test("an eligible NIM enters /kit without touching localStorage", async () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    mocked.validateNim.mockResolvedValue({ eligible: true, name: "Budi" });
    mocked.getSession.mockResolvedValue(session);
    renderApp("/");

    await userEvent.type(await screen.findByLabelText(/student id/i), "2501234567");
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(await screen.findByRole("heading", { name: "Notes" })).toBeInTheDocument();
    expect(setItem).not.toHaveBeenCalled();
  });
});

describe("logout", () => {
  test("calls the backend and returns to the login page", async () => {
    mocked.getSession.mockResolvedValue(session);
    renderApp("/kit");

    await userEvent.click(await screen.findByRole("button", { name: /log out/i }));

    expect(mocked.logout).toHaveBeenCalledTimes(1);
    expect(await screen.findByLabelText(/student id/i)).toBeInTheDocument();
  });
});

describe("shared appearance", () => {
  test.each(["/", "/kit", "/software"])(
    "%s uses the backend background image",
    async (path) => {
      mocked.getSession.mockResolvedValue(session);
      renderApp(path);

      await waitFor(() =>
        expect(screen.getByTestId("appearance-background")).toHaveAttribute(
          "src",
          appearance.backgroundImageUrl,
        ),
      );
    },
  );
});
