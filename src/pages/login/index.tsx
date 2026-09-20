import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getAppearance, validateNim } from "@/api/himti-kit";
import type { HimtiKitAppearance } from "@/types/himti-kit";

export default function LoginPage() {
  const navigate = useNavigate();

  const [nim, setNim] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appearance, setAppearance] = useState<HimtiKitAppearance | null>(
    null,
  );

  useEffect(() => {
    let isMounted = true;

    getAppearance()
      .then((data) => {
        if (isMounted) setAppearance(data);
      })
      .catch(() => {
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!nim.trim()) {
      setMessage("Please enter your Student ID (NIM).");
      return;
    }

    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await validateNim(nim);

      if (!response.eligible) {
        setMessage(
          "NIM Anda tidak terdaftar sebagai peserta HIMTI-KIT. Silakan hubungi panitia.",
        );
        return;
      }

      localStorage.setItem("student_nim", nim.trim());

      if (response.name) {
        localStorage.setItem("student_name", response.name);
      }

      navigate("/kit");
    } catch {
      setMessage(
        "Could not validate your NIM right now. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const backgroundImageUrl =
    appearance?.backgroundImageUrl || "/assets/login-background.jpg";

  const overlayOpacity = appearance?.overlayEnabled
    ? appearance.overlayDarkness / 100
    : 0.5;

  const blurAmount = appearance?.blurEnabled
    ? `${appearance.blurIntensity}px`
    : "0px";

  const accentColor = appearance?.accentColor || "#0f172a";

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      <img
        src={backgroundImageUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
          backdropFilter: `blur(${blurAmount})`,
        }}
      />

      <section className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center text-white">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/75">
          School of Computer Science
        </p>

        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          HIMTI KIT
        </h1>

        <p className="mt-8 max-w-3xl text-base leading-8 text-white/90 sm:text-xl">
          A learning kit for new School of Computer Science students at Bina
          Nusantara University. Find materials and software for your first
          semesters in one place.
        </p>

        <form
          className="mt-10 flex w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          onSubmit={handleSubmit}
        >
          <label className="sr-only" htmlFor="nim">
            Student ID (NIM)
          </label>

          <input
            id="nim"
            type="text"
            value={nim}
            onChange={(event) => setNim(event.target.value)}
            placeholder="Insert your Student ID (NIM)"
            disabled={isSubmitting}
            className="min-w-0 flex-1 px-5 py-4 text-base text-slate-900 outline-none disabled:bg-slate-100 sm:text-lg"
          />

          <button
            type="submit"
            aria-label="Continue"
            disabled={isSubmitting}
            style={{ backgroundColor: accentColor }}
            className="grid w-16 place-items-center text-white transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
        </form>

        {message && (
          <p className="mt-4 max-w-xl text-sm font-medium text-white">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}