import GatePage from "@/pages/gate";
import KitPage from "@/pages/kit";
import SoftwarePage from "@/pages/software";
import RequireNimValidation from "@/components/auth/nim-please";
import type { AppRoute } from "@/types/common";

export const routes: AppRoute[] = [
  { path: "/", element: <GatePage /> },
  {
    path: "/kit",
    element: (
      <RequireNimValidation>
        <KitPage />
      </RequireNimValidation>
    ),
  },
  {
    path: "/software",
    element: (
      <RequireNimValidation>
        <SoftwarePage />
      </RequireNimValidation>
    ),
  },
];