import { AxiosError } from "axios";
import { afterEach, describe, expect, test, vi } from "vitest";
import apiClient from "@/config/api-client";
import { getSession } from "@/api/himti-kit";

afterEach(() => vi.restoreAllMocks());

function axiosError(status: number) {
  return new AxiosError("fail", String(status), undefined, undefined, {
    status,
  } as never);
}

describe("getSession", () => {
  test("returns the session on 200", async () => {
    vi.spyOn(apiClient, "get").mockResolvedValue({
      data: { success: true, data: { nim: "1", name: "A", expiresAt: 1 } },
    });
    expect(await getSession()).toEqual({ nim: "1", name: "A", expiresAt: 1 });
  });

  test("returns null on 401", async () => {
    vi.spyOn(apiClient, "get").mockRejectedValue(axiosError(401));
    expect(await getSession()).toBeNull();
  });

  test("rethrows other failures", async () => {
    vi.spyOn(apiClient, "get").mockRejectedValue(axiosError(500));
    await expect(getSession()).rejects.toThrow();
  });
});

describe("api client", () => {
  test("sends credentials so the httpOnly cookie is included", () => {
    expect(apiClient.defaults.withCredentials).toBe(true);
  });
});
