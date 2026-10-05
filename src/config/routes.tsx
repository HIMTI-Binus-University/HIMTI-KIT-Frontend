import GatePage from "@/pages/gate";
import KitPage from "@/pages/kit";
import SoftwarePage from "@/pages/software";
import type { AppRoute } from "@/types/common";

export const routes: AppRoute[] = [
  { path: "/", element: <GatePage /> },
  { path: "/kit", element: <KitPage /> },
  { path: "/software", element: <SoftwarePage /> },
];