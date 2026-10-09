
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, SearchX } from "lucide-react";

const NotFound = () => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050507] px-5 py-16 text-white">
      {/* Background effects */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/[0.10] blur-[100px]" />

      <div className="relative z-10 mx-auto w-full max-w-xl text-center">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/[0.08] text-violet-300">
          <SearchX size={30} strokeWidth={1.5} />
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">
          Page not found
        </p>

        <h1 className="mt-5 text-7xl font-black tracking-tight sm:text-9xl">
          404
        </h1>

        <h2 className="mt-5 text-xl font-semibold sm:text-2xl">
          Looks like you've lost your way.
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/45 sm:text-base">
          The page you're looking for doesn't exist,
          may have been moved, or the URL may be incorrect.
          Let's get you back on track.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-medium text-white/70 transition hover:bg-white/[0.08] hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <Link
            to="/dashboard"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-black transition hover:bg-white/90"
          >
            Go to Dashboard
            <ArrowRight size={16} />
          </Link>
        </div>

        <p className="mt-12 text-xs text-white/25">
          BusinessLens · Turn data into decisions
        </p>
      </div>
    </main>
  );
};

export default NotFound;
