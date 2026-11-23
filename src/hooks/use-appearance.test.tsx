import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, test, vi } from "vitest";
import * as api from "@/api/himti-kit";
import { DEFAULT_BACKGROUND_URL, useAppearance } from "@/hooks/use-appearance";

vi.mock("@/api/himti-kit");

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

const base = {
  accentColor: "#059669",
  backgroundImageUrl: "https://cdn.example.com/bg.jpg",
  overlayEnabled: true,
  overlayDarkness: 65,
  blurEnabled: true,
  blurIntensity: 4,
};

beforeEach(() => vi.resetAllMocks());

describe("useAppearance", () => {
  test("falls back to defaults while loading and when the request fails", async () => {
    vi.mocked(api.getAppearance).mockRejectedValue(new Error("offline"));
    const { result } = renderHook(() => useAppearance(), { wrapper });

    expect(result.current).toEqual({
      backgroundImageUrl: DEFAULT_BACKGROUND_URL,
      overlayOpacity: 0.5,
      blurAmount: "0px",
      accentColor: "#0f172a",
    });
    await waitFor(() => expect(api.getAppearance).toHaveBeenCalled());
    expect(result.current.backgroundImageUrl).toBe(DEFAULT_BACKGROUND_URL);
  });

  test("maps backend settings", async () => {
    vi.mocked(api.getAppearance).mockResolvedValue(base);
    const { result } = renderHook(() => useAppearance(), { wrapper });

    await waitFor(() => expect(result.current.backgroundImageUrl).toBe(base.backgroundImageUrl));
    expect(result.current.overlayOpacity).toBe(0.65);
    expect(result.current.blurAmount).toBe("4px");
    expect(result.current.accentColor).toBe("#059669");
  });

  test("honours disabled overlay and blur, and an empty image url", async () => {
    vi.mocked(api.getAppearance).mockResolvedValue({
      ...base,
      backgroundImageUrl: "",
      overlayEnabled: false,
      blurEnabled: false,
    });
    const { result } = renderHook(() => useAppearance(), { wrapper });

    await waitFor(() => expect(result.current.overlayOpacity).toBe(0));
    expect(result.current.blurAmount).toBe("0px");
    expect(result.current.backgroundImageUrl).toBe(DEFAULT_BACKGROUND_URL);
  });
});
