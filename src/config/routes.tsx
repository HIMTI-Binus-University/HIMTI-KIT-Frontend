import { RequireSession } from "@/components/auth/require-session";
import GatePage from "@/pages/gate";
import KitPage from "@/pages/kit";
import SoftwarePage from "@/pages/software";
import type { AppRoute } from "@/types/common";

export const routes: AppRoute[] = [
  { path: "/", element: <GatePage /> },
  { path: "/kit", element: (
      <RequireSession>
        <KitPage />
      </RequireSession>
    ) },
  { path: "/software", element: (
      <RequireSession>
        <SoftwarePage />
      </RequireSession>
    ) },
];