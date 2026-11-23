import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { getSession } from "@/api/himti-kit";
import { queryKeys } from "@/constants/query-keys";

/**
 * Route guard: asks the backend whether the httpOnly HIMTI Kit session cookie
 * is valid and sends signed-out / expired visitors back to "/".
 * It is mounted per route, so the session is re-checked on every navigation.
 */
export function RequireSession({ children }: { children: ReactNode }) {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: queryKeys.kitSession,
    queryFn: getSession,
    staleTime: 0,
    refetchOnMount: "always",
  });

  if (isPending) {
    return <p className="p-8 text-center">Checking your session...</p>;
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p>Could not verify your session. Please try again.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return <Navigate to="/" replace />;

  return <>{children}</>;
}
