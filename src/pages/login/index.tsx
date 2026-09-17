import { useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const [nim, setNim] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!nim.trim()) {
      setMessage("Please enter your Student ID (NIM).");
      return;
    }

    navigate("/kit");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      <img
        src="/assets/login-background.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />

      <section className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center text-white">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/75">
          School of Computer Science
        </p>

        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          HIMTI KIT
        </h1>

        <p className="mt-8 max-w-3xl text-base leading-8 text-white/90 sm:text-xl">
          A learning kit for new School of Computer Science students at
          Bina Nusantara University. Find materials and software for your
          first semesters in one place.
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
            className="min-w-0 flex-1 px-5 py-4 text-base text-slate-900 outline-none sm:text-lg"
          />

          <button
            type="submit"
            aria-label="Continue"
            className="grid w-16 place-items-center bg-slate-900 text-white transition hover:bg-slate-700"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm font-medium text-white/90">{message}</p>
        )}
      </section>
    </main>
  );
}