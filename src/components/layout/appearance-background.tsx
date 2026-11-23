import type { ReactNode } from "react";
import { useAppearance } from "@/hooks/use-appearance";

/**
 * Full-page background (image + overlay + blur) driven by the HIMTI Kit
 * appearance settings. Wrap any page's content with it.
 */
export function AppearanceBackground({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { backgroundImageUrl, overlayOpacity, blurAmount } = useAppearance();

  return (
    <main className={`relative min-h-screen overflow-hidden bg-slate-950 ${className}`}>
      <img
        src={backgroundImageUrl}
        alt=""
        data-testid="appearance-background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
          backdropFilter: `blur(${blurAmount})`,
        }}
      />

      <div className="relative min-h-screen">{children}</div>
    </main>
  );
}
