import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { validateNim } from "@/api/himti-kit";

type RequireNimValidationProps = {
  children: ReactNode;
};

type AccessStatus = "checking" | "allowed" | "denied";

export default function RequireNimValidation({
  children,
}: RequireNimValidationProps) {
  const [accessStatus, setAccessStatus] = useState<AccessStatus>(() =>
    localStorage.getItem("student_nim") ? "checking" : "denied",
  );

  useEffect(() => {
    let isMounted = true;
    const nim = localStorage.getItem("student_nim");

    if (!nim) return;

    validateNim(nim)
      .then((response) => {
        if (!isMounted) return;

        if (response.eligible) {
          setAccessStatus("allowed");
          return;
        }

        localStorage.removeItem("student_nim");
        localStorage.removeItem("student_name");
        setAccessStatus("denied");
      })
      .catch(() => {
        if (!isMounted) return;

        localStorage.removeItem("student_nim");
        localStorage.removeItem("student_name");
        setAccessStatus("denied");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (accessStatus === "checking") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 text-white">
        Checking access...
      </main>
    );
  }

  if (accessStatus === "denied") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}