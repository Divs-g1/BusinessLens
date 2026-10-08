import { useState, useEffect} from "react";

import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth, } from "../config/firebase";
import { useAuth, } from "../context/AuthContext";
import { useNavigate, } from "react-router-dom";

import {
  BarChart3,
  Database,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  ArrowRight,
} from "lucide-react";


const Login = () => {
  const navigate = useNavigate();

  const { user, } = useAuth();
  const [ loading, setLoading, ] = useState(false);
  const [ error, setError, ] = useState("");



const handleGoogleLogin = async () => {
  try {
    setLoading(true);
    setError("");

    const provider = new GoogleAuthProvider();

    // Ask Google to display the account chooser.
    provider.setCustomParameters({
      prompt: "select_account",
    });

    const result = await signInWithPopup(
      auth,
      provider
    );
    console.log("Selected Firebase account:", result.user.email);

    // Verify which Google account Firebase selected.
    console.log(
      "Signed-in account:",
      result.user.email
    );

    navigate("/datasets", {
      replace: true,
    });
  } catch (error) {
    console.error("Google login error:", error);
    setError(error.message || "Google login failed.");
  } finally {
    setLoading(false);
  }
};


    useEffect(() => {
  if (user) {
    navigate("/datasets", {
      replace: true,
    });
  }
}, [user, navigate]);


  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-1/2 top-[-280px] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />

        <div className="absolute bottom-[-250px] left-[-100px] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.06] blur-[120px]" />

        <div className="absolute right-[-150px] top-[30%] h-[450px] w-[450px] rounded-full bg-violet-500/[0.05] blur-[120px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />

      </div>


      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 py-10 sm:px-8 lg:px-10">

        <div className="grid w-full items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">


          {/* LEFT */}
          <section className="hidden lg:block">

            {/* Brand */}
            <div className="mb-10 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-2xl shadow-indigo-500/10">

                <BarChart3 className="h-5 w-5 text-indigo-400" />

              </div>

              <span className="text-lg font-semibold tracking-tight">
                BusinessLens
              </span>

            </div>


            <div className="max-w-xl">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/[0.07] px-3 py-1.5 text-xs font-medium text-indigo-300">

                <Sparkles className="h-3.5 w-3.5" />

                Intelligent business analytics

              </div>


              <h1 className="text-5xl font-semibold leading-[1.08] tracking-[-0.04em] xl:text-6xl">

                Turn business data into

                <span className="block bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                  decisions.
                </span>

              </h1>


              <p className="mt-6 max-w-lg text-base leading-7 text-white/45">
                Upload your business data and get
                meaningful insights, performance
                analytics, data-quality signals and
                anomaly detection in one place.
              </p>


              {/* Feature cards */}
              <div className="mt-10 grid max-w-xl grid-cols-2 gap-3">

                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 backdrop-blur-xl">

                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-400/10">

                    <TrendingUp className="h-4 w-4 text-indigo-300" />

                  </div>

                  <p className="text-sm font-medium text-white/80">
                    Business Analytics
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/35">
                    Understand revenue and performance.
                  </p>

                </div>


                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 backdrop-blur-xl">

                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10">

                    <Database className="h-4 w-4 text-cyan-300" />

                  </div>

                  <p className="text-sm font-medium text-white/80">
                    Data Intelligence
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/35">
                    Profile and understand your datasets.
                  </p>

                </div>

              </div>

            </div>

          </section>


          {/* RIGHT / LOGIN */}
          <section className="mx-auto w-full max-w-md">

            {/* Mobile brand */}
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">

                <BarChart3 className="h-5 w-5 text-indigo-400" />

              </div>

              <span className="text-lg font-semibold">
                BusinessLens
              </span>

            </div>


            <div className="rounded-[28px] border border-white/[0.09] bg-white/[0.035] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">

              {/* Header */}
              <div className="mb-8">

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10 ring-1 ring-white/10">

                  <ShieldCheck className="h-6 w-6 text-indigo-300" />

                </div>


                <h2 className="text-2xl font-semibold tracking-tight">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  Sign in to continue to your
                  BusinessLens workspace.
                </p>

              </div>


              {/* Error */}
              {error && (
                <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/[0.07] px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}


              {/* Google */}
              <button
                type="button"
                onClick={
                  handleGoogleLogin
                }
                disabled={loading}
                className="group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white px-4 py-3.5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
              >

                <span className="flex items-center gap-3">

                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/[0.05]">

                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                    >
                      <path
                        fill="#4285F4"
                        d="M21.35 12.27c0-.71-.06-1.39-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.69 2.91-4.18 2.91-7.21Z"
                      />

                      <path
                        fill="#34A853"
                        d="M12 21.86c2.63 0 4.84-.87 6.45-2.38l-3.14-2.44c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.74 9.74 0 0 0 12 21.86Z"
                      />

                      <path
                        fill="#FBBC05"
                        d="M6.54 13.94a5.86 5.86 0 0 1 0-3.88V7.54H3.3a9.74 9.74 0 0 0 0 8.92l3.24-2.52Z"
                      />

                      <path
                        fill="#EA4335"
                        d="M12 6.03c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.1 14.63 2.14 12 2.14a9.74 9.74 0 0 0-8.7 5.4l3.24 2.52C7.31 7.75 9.46 6.03 12 6.03Z"
                      />
                    </svg>

                  </span>


                  <span>
                    {loading
                      ? "Signing in..."
                      : "Continue with Google"}
                  </span>

                </span>


                {!loading && (
                  <ArrowRight className="h-4 w-4 text-black/40 transition-transform group-hover:translate-x-0.5" />
                )}

              </button>


              {/* Divider */}
              <div className="my-7 flex items-center gap-3">

                <div className="h-px flex-1 bg-white/[0.07]" />

                <span className="text-[10px] uppercase tracking-[0.18em] text-white/20">
                  Secure access
                </span>

                <div className="h-px flex-1 bg-white/[0.07]" />

              </div>


              {/* Trust */}
              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">

                  <ShieldCheck className="h-4 w-4 text-emerald-300/80" />

                  <p className="mt-2 text-xs font-medium text-white/65">
                    Secure authentication
                  </p>

                </div>


                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">

                  <Database className="h-4 w-4 text-indigo-300/80" />

                  <p className="mt-2 text-xs font-medium text-white/65">
                    Private workspace
                  </p>

                </div>

              </div>


              <p className="mt-7 text-center text-[11px] leading-5 text-white/25">
                Your account is securely authenticated
                through Google. No BusinessLens password
                is required.
              </p>

            </div>

          </section>

        </div>

      </div>

    </main>
  );
};


export default Login;