import { useQuery } from "@tanstack/react-query";
import { getAppearance } from "@/api/himti-kit";
import { queryKeys } from "@/constants/query-keys";

export const DEFAULT_BACKGROUND_URL = "/assets/login-background.jpg";
const DEFAULT_ACCENT_COLOR = "#0f172a";
const DEFAULT_OVERLAY_OPACITY = 0.5;

export interface ResolvedAppearance {
  backgroundImageUrl: string;
  /** 0 - 1 */
  overlayOpacity: number;
  /** CSS length, e.g. "4px" */
  blurAmount: string;
  accentColor: string;
}

/**
 * Appearance (background, overlay, blur, accent) managed from the admin panel,
 * with safe defaults while loading or if the request fails. Shared by the
 * login, kit and software pages; react-query dedupes the request.
 */
export function useAppearance(): ResolvedAppearance {
  const { data } = useQuery({
    queryKey: queryKeys.kitAppearance,
    queryFn: getAppearance,
    staleTime: 30_000,
  });

  return {
    backgroundImageUrl: data?.backgroundImageUrl || DEFAULT_BACKGROUND_URL,
    overlayOpacity: data
      ? data.overlayEnabled
        ? data.overlayDarkness / 100
        : 0
      : DEFAULT_OVERLAY_OPACITY,
    blurAmount: data?.blurEnabled ? `${data.blurIntensity}px` : "0px",
    accentColor: data?.accentColor || DEFAULT_ACCENT_COLOR,
  };
}
