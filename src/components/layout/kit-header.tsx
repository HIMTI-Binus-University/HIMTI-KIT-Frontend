import { BookOpenText, CodeXml, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "@/api/himti-kit";
import { queryKeys } from "@/constants/query-keys";

export function KitHeader() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 text-sm font-semibold whitespace-nowrap transition ${
      isActive ? "text-slate-950" : "text-slate-600 hover:text-slate-950"
    }`;

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // Even if the request fails, leave; the guard re-checks the session.
    }
    queryClient.setQueryData(queryKeys.kitSession, null);
    queryClient.removeQueries({ queryKey: queryKeys.kitResources });
    queryClient.removeQueries({ queryKey: queryKeys.kitSoftwares });
    navigate("/");
  }

  return (
    <header className="w-full border-b border-slate-300 bg-white/95 px-5 py-3">
      <div className="flex w-full items-center gap-4">
        <div className="flex shrink-0 items-center gap-3">
          <img
            src="/assets/HIMTI-logo.jpg"
            alt="HIMTI BINUS"
            className="h-11 w-11 object-contain"
          />

          <div className="leading-tight text-slate-950">
            <p className="text-sm font-bold">HIMTI BINUS</p>
            <p className="text-xs font-medium text-slate-600">HIMTI KIT</p>
          </div>
        </div>

        <div className="h-10 w-px shrink-0 bg-slate-300" />

        <nav className="flex shrink-0 gap-1" aria-label="Main navigation">
          <NavLink className={linkClass} to="/kit">
            <BookOpenText className="h-5 w-5" />
            Notes
          </NavLink>

          <NavLink className={linkClass} to="/software">
            <CodeXml className="h-5 w-5" />
            Applications
          </NavLink>
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold whitespace-nowrap text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </header>
  );
}