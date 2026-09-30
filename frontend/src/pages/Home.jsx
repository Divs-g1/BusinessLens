import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Database,
  FileSpreadsheet,
  FileText,
  Layers3,
  LineChart,
  Menu,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

import { motion, } from "framer-motion";
import { useState, useEffect } from "react";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const Home = () => {

  const [ mobileMenu, setMobileMenu ] = useState(false);
  const [ activeSection, setActiveSection,] = useState("home");
  const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
    const sections = [
        "home",
        "product",
        "analytics",
        "reports",
    ];

    const handleScroll = () => {
        const activationLine = 220;

        let currentSection = "home";

        for (const id of sections) {
        const section =
            document.getElementById(id);

        if (!section) {
            continue;
        }

        const rect =
            section.getBoundingClientRect();

        if (rect.top <= activationLine) {
            currentSection = id;
        }
        }

        setActiveSection(currentSection);
    };

    handleScroll();

    window.addEventListener(
        "scroll",
        handleScroll,
        { passive: true }
    );

    return () => {
        window.removeEventListener(
        "scroll",
        handleScroll
        );
    };
    }, []);

    useEffect(() => {
  const handleNavbarScroll = () => {
    setScrolled(window.scrollY > 80);
  };

  handleNavbarScroll();

  window.addEventListener(
    "scroll",
    handleNavbarScroll,
    { passive: true }
  );

  return () => {
    window.removeEventListener(
      "scroll",
      handleNavbarScroll
    );
  };
}, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[#050507] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute left-[10%] top-[-12rem] h-[32rem] w-[32rem] rounded-full bg-violet-600/10 blur-[140px]" />

        <div className="absolute right-[-10rem] top-[18%] h-[28rem] w-[28rem] rounded-full bg-cyan-500/8 blur-[140px]" />

        <div className="absolute bottom-[-12rem] left-[35%] h-[30rem] w-[30rem] rounded-full bg-fuchsia-600/8 blur-[150px]" />
      </div>

      {/* NAVBAR */}
    <motion.header
    initial={false}
    animate={{
        width: scrolled
        ? "min(1120px, calc(100% - 32px))"
        : "min(1320px, calc(100% - 48px))",

        top: scrolled ? 18 : 22,

        scale: scrolled ? 0.985 : 1,
    }}
    transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
    }}
    className="
        fixed
        left-1/2
        z-[100]
        -translate-x-1/2
    "
    >
    <div
        className="
        relative
        flex
        h-[76px]
        items-center
        justify-between
        rounded-[26px]
        border
        border-white/[0.10]
        bg-[#09090b]/75
        px-4
        shadow-[0_20px_80px_rgba(0,0,0,0.35)]
        backdrop-blur-2xl
        sm:px-5
        "
    >
        {/* Ambient top highlight */}
        <div
        className="
            pointer-events-none
            absolute
            inset-x-10
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-white/20
            to-transparent
        "
        />

        {/* LEFT — LOGO */}
        <a
        href="/"
        className="
            relative
            z-10
            flex
            shrink-0
            items-center
            gap-3
            rounded-2xl
            px-2
            py-2
        "
        >
        <div
            className="
            relative
            flex
            h-9
            w-9
            items-center
            justify-center
            overflow-hidden
            rounded-xl
            bg-gradient-to-br
            from-violet-500
            via-indigo-500
            to-cyan-400
            shadow-[0_0_30px_rgba(139,92,246,0.18)]
            "
        >
            <div
            className="
                absolute
                inset-[1px]
                rounded-[11px]
                bg-[#08080b]
            "
            />

            <span className="relative text-xs font-black">
            B
            </span>
        </div>

        <span className="hidden text-sm font-semibold tracking-tight sm:block">
            BusinessLens
        </span>
        </a>

        {/* CENTER — NAVIGATION CAPSULE */}
        <nav
        className="
            absolute
            left-1/2
            hidden
            -translate-x-1/2
            items-center
            rounded-full
            border
            border-white/[0.08]
            bg-black/70
            p-1
            shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
            backdrop-blur-xl
            md:flex
        "
        >
       {[
  {
    label: "Home",
    href: "#home",
    id: "home",
  },
  {
    label: "Product",
    href: "#product",
    id: "product",
  },
  {
    label: "Analytics",
    href: "#analytics",
    id: "analytics",
  },
  {
    label: "Reports",
    href: "#reports",
    id: "reports",
  },
].map((item) => {
  const isActive =
    activeSection === item.id;

  return (
    <a
      key={item.id}
      href={item.href}
      className="
        relative
        rounded-full
        px-5
        py-2.5
        text-xs
        font-medium
      "
    >
      {isActive && (
        <motion.span
          layoutId="activeNav"
          className="
            absolute
            inset-0
            rounded-full
            bg-white/[0.10]
            shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
          "
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 32,
            mass: 0.8,
          }}
        />
      )}

      <span
        className={`
          relative
          z-10
          transition-colors
          duration-300
          ${
            isActive
              ? "text-white"
              : "text-white/40 hover:text-white"
          }
        `}
      >
        {item.label}
      </span>
    </a>
  );
})}
        </nav>

        {/* RIGHT — CTA */}
        <div className="relative z-10 flex items-center">
        <a
            href="/signup"
            className="
            group
            flex
            items-center
            gap-2
            rounded-full
            border
            border-white/[0.14]
            bg-white/[0.035]
            px-5
            py-2.5
            text-xs
            font-medium
            text-white/80
            shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]
            transition-all
            duration-300
            hover:border-white/25
            hover:bg-white/[0.08]
            hover:text-white
            "
        >
            Get started

            <ArrowRight
            size={13}
            className="
                transition-transform
                duration-300
                group-hover:translate-x-0.5
            "
            />
        </a>
        </div>

        {/* MOBILE BUTTON */}
        <button
        type="button"
        onClick={() =>
            setMobileMenu((value) => !value)
        }
        className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            bg-white/[0.04]
            text-white/70
            md:hidden
        "
        >
        {mobileMenu ? (
            <X size={17} />
        ) : (
            <Menu size={17} />
        )}
        </button>

        {/* MOBILE MENU */}
        {mobileMenu && (
        <motion.div
            initial={{
            opacity: 0,
            y: -10,
            scale: 0.98,
            }}
            animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            }}
            className="
            absolute
            left-2
            right-2
            top-[calc(100%+10px)]
            rounded-[22px]
            border
            border-white/10
            bg-[#09090c]/95
            p-2
            shadow-2xl
            backdrop-blur-2xl
            md:hidden
            "
        >
            {[
            ["Home", "#home"],
            ["Product", "#product"],
            ["Analytics", "#analytics"],
            ["Reports", "#reports"],
            ].map(([label, href]) => (
            <a
                key={label}
                href={href}
                onClick={() => setMobileMenu(false)}
                className="
                block
                rounded-xl
                px-4
                py-3
                text-sm
                text-white/55
                transition
                hover:bg-white/[0.05]
                hover:text-white
                "
            >
                {label}
            </a>
            ))}

            <div className="my-1 h-px bg-white/[0.06]" />

            <a
            href="/login"
            className="
                block
                rounded-xl
                px-4
                py-3
                text-sm
                text-white/55
            "
            >
            Sign in
            </a>

            <a
            href="/signup"
            className="
                mt-1
                block
                rounded-xl
                bg-white
                px-4
                py-3
                text-center
                text-sm
                font-semibold
                text-black
            "
            >
            Get started
            </a>
        </motion.div>
        )}
    </div>
    </motion.header>
     

      {/* HERO */}
      <section id="home" className="relative">
        <div className="marketing-grid absolute inset-0 opacity-30" />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28 lg:pt-32">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-4xl text-center"
          >
          
        <motion.div
  variants={fadeUp}
  className="
    mb-7
    inline-flex
    items-center
    gap-2
    rounded-full
    border
    border-violet-400/10
    bg-violet-400/[0.04]
    px-3.5
    py-2
    text-[11px]
    font-medium
    text-white/65
    backdrop-blur-xl
  "
>
  <span className="relative flex h-2 w-2">
    <span
      className="
        absolute
        inline-flex
        h-full
        w-full
        animate-ping
        rounded-full
        bg-violet-400
        opacity-50
      "
    />

    <span
      className="
        relative
        inline-flex
        h-2
        w-2
        rounded-full
        bg-violet-400
      "
    />
  </span>

  Business analytics, simplified

  <ChevronRight
    size={13}
    className="text-white/25"
  />
      </motion.div>

          <motion.h1
            variants={fadeUp}
            className="
              text-5xl
              font-semibold
              leading-[0.98]
              tracking-[-0.055em]
              sm:text-6xl
              lg:text-[84px]
            "
          >
            Turn your business data
            <br />

            <span className="gradient-text">
              into better decisions.
            </span>
          </motion.h1>

          <motion.p
          variants={fadeUp}
          className="
            mx-auto
            mt-7
            max-w-2xl
            text-sm
            leading-7
            text-white/45
            sm:text-base
            sm:leading-8
          "
        >
          Upload your spreadsheets and let BusinessLens clean,
          analyze, and visualize your data — so you can understand
          what is happening inside your business and what to do next.
        </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <a
                href="/signup"
                className="
                  group
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-black
                  shadow-[0_0_50px_rgba(255,255,255,0.08)]
                  transition
                  hover:-translate-y-0.5
                "
              >
              Analyze your data

                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-0.5"
                />
              </a>

              <a
                href="#product"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white/75 backdrop-blur-xl transition hover:bg-white/[0.06] hover:text-white"
              >
                See how it works
              </a>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-5 text-[10px] uppercase tracking-[0.16em] text-white/25"
            >
              CSV &nbsp;•&nbsp; Excel &nbsp;•&nbsp; Business-ready
            </motion.p>
          </motion.div>

          {/* HERO PRODUCT PREVIEW */}
          <motion.div
            initial={{
              opacity: 0,
              y: 50,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
              delay: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative mx-auto mt-16 max-w-5xl sm:mt-20"
          >
            <div className="absolute -inset-10 rounded-[3rem] bg-gradient-to-r from-violet-600/10 via-transparent to-cyan-500/10 blur-3xl" />

            <div className="relative rounded-2xl border border-white/10 bg-[#09090c] p-2 shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
              {/* Window bar */}
              <div className="flex h-9 items-center justify-between border-b border-white/[0.06] px-3">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                </div>

                <span className="text-[9px] text-white/25">
                  businesslens.app
                </span>

                <div className="w-10" />
              </div>

              {/* Fake dashboard */}
              <div className="grid min-h-[420px] grid-cols-12 overflow-hidden rounded-xl bg-[#07070a]">
                {/* Mini sidebar */}
                <div className="col-span-2 hidden border-r border-white/[0.06] p-4 sm:block">
                  <div className="mb-8 h-5 w-20 rounded bg-white/10" />

                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map(
                      (item) => (
                        <div
                          key={item}
                          className={`h-7 rounded-lg ${
                            item === 1
                              ? "bg-violet-500/15"
                              : "bg-white/[0.025]"
                          }`}
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Dashboard */}
                <div className="col-span-12 p-5 sm:col-span-10 sm:p-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="h-3 w-24 rounded bg-white/15" />

                      <div className="mt-2 h-2 w-36 rounded bg-white/5" />
                    </div>

                    <div className="h-7 w-24 rounded-lg bg-white/5" />
                  </div>

                  {/* KPI */}
                  <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                      ["Revenue", "₹24.8L", "+18.4%"],
                      ["Orders", "12,482", "+12.1%"],
                      ["Customers", "4,293", "+8.7%"],
                      ["Profit", "₹6.2L", "+21.3%"],
                    ].map(
                      ([label, value, growth]) => (
                        <div
                          key={label}
                          className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4"
                        >
                          <p className="text-[9px] text-white/35">
                            {label}
                          </p>

                          <p className="mt-2 text-lg font-semibold tracking-tight text-white/90">
                            {value}
                          </p>

                          <p className="mt-1 text-[9px] text-emerald-400/80">
                            {growth}
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  {/* Chart area */}
                  <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 lg:col-span-2">
                      <p className="text-[10px] text-white/40">
                        Revenue performance
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        Monthly revenue
                      </p>

                      <div className="relative mt-7 h-40">
                        <svg
                          viewBox="0 0 600 160"
                          className="h-full w-full"
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient
                              id="heroChart"
                              x1="0"
                              x2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#8b5cf6"
                              />

                              <stop
                                offset="100%"
                                stopColor="#22d3ee"
                              />
                            </linearGradient>
                          </defs>

                          <path
                            d="M0 130 C50 115 75 120 115 102 S170 80 205 94 S270 110 315 76 S370 82 405 60 S455 45 500 57 S550 25 600 12"
                            fill="none"
                            stroke="url(#heroChart)"
                            strokeWidth="3"
                          />

                          <path
                            d="M0 130 C50 115 75 120 115 102 S170 80 205 94 S270 110 315 76 S370 82 405 60 S455 45 500 57 S550 25 600 12 L600 160 L0 160 Z"
                            fill="url(#heroChart)"
                            opacity="0.05"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
                      <p className="text-[10px] text-white/40">
                        Business health
                      </p>

                      <div className="mt-6 flex items-center justify-center">
                        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[conic-gradient(from_180deg,#8b5cf6_0deg,#22d3ee_295deg,#ffffff10_295deg)] p-[8px]">
                          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#09090c]">
                            <div className="text-center">
                              <p className="text-2xl font-semibold">
                                86
                              </p>

                              <p className="text-[9px] text-white/35">
                                health score
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 space-y-2">
                        <div className="flex justify-between text-[9px]">
                          <span className="text-white/35">
                            Growth
                          </span>

                          <span className="text-emerald-400">
                            Strong
                          </span>
                        </div>

                        <div className="flex justify-between text-[9px]">
                          <span className="text-white/35">
                            Retention
                          </span>

                          <span className="text-violet-300">
                            Healthy
                          </span>
                        </div>

                        <div className="flex justify-between text-[9px]">
                          <span className="text-white/35">
                            Returns
                          </span>

                          <span className="text-amber-300">
                            Watch
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating insight */}
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-6 -right-2 hidden w-60 rounded-xl border border-white/10 bg-[#0b0b10]/90 p-4 shadow-2xl backdrop-blur-xl sm:block lg:-right-10"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Sparkles
                    size={13}
                    className="text-emerald-400"
                  />
                </div>

                <p className="text-[10px] font-semibold">
                  Business insight
                </p>
              </div>

              <p className="mt-3 text-[10px] leading-5 text-white/45">
                Revenue is growing faster than order volume,
                indicating a higher average order value.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <p className="text-center text-[10px] uppercase tracking-[0.2em] text-white/25">
            Built for businesses that want clarity from their data
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 text-sm font-medium text-white/20">
            <span>RETAIL</span>
            <span>STARTUPS</span>
            <span>ECOMMERCE</span>
            <span>OPERATIONS</span>
            <span>SERVICES</span>
            <span>GROWTH TEAMS</span>
          </div>
        </div>
      </section>

      {/* PRODUCT INTRO */}
      <section
        id="product"
        className="relative"
      >
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
                One workspace
              </p>

              <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                From messy spreadsheets to{" "}
                <span className="gradient-text-soft">
                  business clarity.
                </span>
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-7 text-white/40 lg:pb-1">
              BusinessLens handles the tedious parts of data
              analysis so you can spend your time understanding
              what the numbers actually mean.
            </p>
          </div>

          {/* Feature cards */}
          <div
            id="how-it-works"
            className="mt-16 grid border border-white/[0.07] sm:grid-cols-3"
          >
            {[
              {
                icon: Upload,
                number: "01",
                title: "Bring your data",
                description:
                  "Upload CSV or Excel files from the tools you already use.",
              },
              {
                icon: ShieldCheck,
                number: "02",
                title: "Make it trustworthy",
                description:
                  "Profile, validate, and clean your data before analysis.",
              },
              {
                icon: BarChart3,
                number: "03",
                title: "See what matters",
                description:
                  "Turn your cleaned data into KPIs, trends, and insights.",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.number}
                  whileHover={{
                    backgroundColor:
                      "rgba(255,255,255,0.025)",
                  }}
                  className={`group p-7 sm:p-8 ${
                    index !== 0
                      ? "border-t border-white/[0.07] sm:border-l sm:border-t-0"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                      <Icon
                        size={16}
                        className="text-violet-300"
                      />
                    </div>

                    <span className="text-[10px] text-white/20">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-8 text-lg font-medium">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/35">
                    {item.description}
                  </p>

                  <div className="mt-8 h-px w-8 bg-gradient-to-r from-violet-500 to-transparent transition-all duration-500 group-hover:w-16" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DATA QUALITY */}
      <section className="border-y border-white/[0.06] bg-white/[0.012]">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
              Data quality
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
              Don't analyze data
              <br />
              <span className="text-white/35">
                you can't trust.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/40">
              BusinessLens checks your data before turning it into
              business metrics. Find duplicates, missing values,
              invalid dates, inconsistent categories, and other
              quality issues before they affect your decisions.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Automatic data profiling",
                "Duplicate detection",
                "Missing-value analysis",
                "Data consistency checks",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-white/60"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/10">
                    <Check
                      size={11}
                      className="text-emerald-400"
                    />
                  </div>

                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Quality UI */}
          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-cyan-500/5 blur-3xl" />

            <div className="relative rounded-2xl border border-white/10 bg-[#09090c] p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-5">
                <div>
                  <p className="text-xs font-semibold">
                    Data quality
                  </p>

                  <p className="mt-1 text-[10px] text-white/30">
                    sales_august.xlsx
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-emerald-400/20 border-t-emerald-400">
                  <span className="text-sm font-semibold">
                    91
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {[
                  ["Completeness", "96%", "bg-emerald-400"],
                  ["Validity", "94%", "bg-cyan-400"],
                  ["Consistency", "89%", "bg-violet-400"],
                  ["Uniqueness", "98%", "bg-blue-400"],
                ].map(
                  ([label, value, color]) => (
                    <div key={label}>
                      <div className="mb-2 flex justify-between text-[10px]">
                        <span className="text-white/40">
                          {label}
                        </span>

                        <span className="text-white/70">
                          {value}
                        </span>
                      </div>

                      <div className="h-1 overflow-hidden rounded-full bg-white/5">
                        <div
                          className={`h-full rounded-full ${color}`}
                          style={{
                            width: value,
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="mt-7 border-t border-white/[0.06] pt-5">
                <p className="text-[10px] font-medium text-white/35">
                  Issues detected
                </p>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between rounded-lg bg-amber-400/5 px-3 py-2">
                    <span className="text-[10px] text-white/45">
                      Duplicate records
                    </span>

                    <span className="text-[10px] text-amber-300">
                      243
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-rose-400/5 px-3 py-2">
                    <span className="text-[10px] text-white/45">
                      Missing values
                    </span>

                    <span className="text-[10px] text-rose-300">
                      182
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ANALYTICS */}
      <section
        id="analytics"
        className="relative"
      >
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
              Analytics
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
              Every number has
              <br />
              <span className="gradient-text">
                a story behind it.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-white/40">
              Go beyond charts. BusinessLens connects metrics,
              trends, and patterns to help you understand what
              is actually happening inside your business.
            </p>
          </div>

          {/* Analytics cards */}
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] md:grid-cols-2">
            {[
              {
                icon: LineChart,
                title: "Revenue & growth",
                text: "Understand where revenue comes from and how it changes over time.",
              },
              {
                icon: Layers3,
                title: "Product performance",
                text: "Find your strongest products, categories, and areas of underperformance.",
              },
              {
                icon: Database,
                title: "Customer behavior",
                text: "Explore new customers, repeat purchases, customer value, and retention.",
              },
              {
                icon: FileSpreadsheet,
                title: "Operational signals",
                text: "Track returns, cancellations, regional performance, and other business KPIs.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  whileHover={{
                    backgroundColor:
                      "rgba(255,255,255,0.035)",
                  }}
                  className="bg-[#08080b] p-7 sm:p-9"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                    <Icon
                      size={17}
                      className="text-violet-300"
                    />
                  </div>

                  <h3 className="mt-7 text-lg font-medium">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-white/35">
                    {item.text}
                  </p>

                  <div className="mt-7 flex items-center gap-2 text-[10px] font-medium text-white/25">
                    Explore analytics
                    <ArrowRight size={12} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INSIGHTS */}
      <section className="border-y border-white/[0.06] bg-white/[0.012]">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <div className="relative rounded-2xl border border-white/10 bg-[#09090c] p-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                  <Sparkles
                    size={14}
                    className="text-violet-300"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold">
                    Business insight
                  </p>

                  <p className="text-[9px] text-white/25">
                    Automatically generated
                  </p>
                </div>
              </div>

              <div className="mt-7">
                <p className="text-lg font-medium leading-7">
                  Revenue grew 18.4%, but the real driver was
                  customer spending.
                </p>

                <p className="mt-4 text-xs leading-6 text-white/35">
                  Order volume increased by 12.1%, while average
                  order value increased by 5.6%. This suggests
                  revenue growth is being driven by higher-value
                  purchases rather than simply more transactions.
                </p>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-2">
                {[
                  ["Revenue", "+18.4%"],
                  ["Orders", "+12.1%"],
                  ["AOV", "+5.6%"],
                ].map(
                  ([label, value]) => (
                    <div
                      key={label}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
                    >
                      <p className="text-[9px] text-white/25">
                        {label}
                      </p>

                      <p className="mt-1 text-sm font-medium text-emerald-300">
                        {value}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-400">
              Business insights
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
              Don't just see
              <br />
              <span className="text-white/35">
                what happened.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/40">
              BusinessLens turns your analytical results into
              understandable observations so you can focus on
              decisions instead of interpreting every chart.
            </p>

            <a
              href="/signup"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white transition hover:text-violet-300"
            >
              See what your data can tell you
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* REPORTS */}
      <section
        id="reports"
        className="relative"
      >
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                Reporting
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                Analysis that leaves
                <br />
                <span className="gradient-text-soft">
                  your dashboard.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-sm leading-7 text-white/40">
                Turn your analysis into a clean business report
                you can share with your team, clients, or
                stakeholders.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Executive summary",
                  "Business KPIs",
                  "Key findings",
                  "Data quality summary",
                  "Downloadable PDF",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-white/55"
                  >
                    <Check
                      size={14}
                      className="text-cyan-400"
                    />

                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Report preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 blur-3xl" />

              <div className="relative rounded-2xl border border-white/10 bg-[#09090c] p-2 shadow-2xl">
                <div className="rounded-xl border border-white/[0.05] bg-[#0c0c10] p-6 sm:p-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.15em] text-white/25">
                        BusinessLens
                      </p>

                      <h3 className="mt-3 text-xl font-semibold">
                        Business Performance
                        <br />
                        Report
                      </h3>
                    </div>

                    <FileText
                      size={20}
                      className="text-white/25"
                    />
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-3">
                    {[
                      ["Revenue", "₹24.8L"],
                      ["Growth", "+18.4%"],
                      ["Health", "86/100"],
                    ].map(
                      ([label, value]) => (
                        <div
                          key={label}
                          className="border-l border-white/10 pl-3"
                        >
                          <p className="text-[8px] text-white/25">
                            {label}
                          </p>

                          <p className="mt-1 text-sm font-semibold">
                            {value}
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-8 border-t border-white/[0.06] pt-6">
                    <p className="text-[9px] uppercase tracking-wider text-white/25">
                      Executive summary
                    </p>

                    <div className="mt-3 space-y-2">
                      <div className="h-2 w-full rounded bg-white/10" />
                      <div className="h-2 w-[92%] rounded bg-white/10" />
                      <div className="h-2 w-[80%] rounded bg-white/10" />
                    </div>
                  </div>

                  <div className="mt-7 grid grid-cols-2 gap-4">
                    <div className="h-24 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                      <p className="text-[8px] text-white/25">
                        Revenue trend
                      </p>

                      <div className="mt-4 h-8">
                        <svg
                          viewBox="0 0 200 40"
                          className="h-full w-full"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M0 32 C25 28 35 30 55 23 S85 25 105 18 S140 20 160 8 S185 12 200 3"
                            fill="none"
                            stroke="#8b5cf6"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="h-24 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                      <p className="text-[8px] text-white/25">
                        Top category
                      </p>

                      <p className="mt-4 text-sm font-semibold">
                        Electronics
                      </p>

                      <p className="mt-1 text-[8px] text-emerald-400">
                        34% of revenue
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden border-y border-white/[0.06]">
        <div className="absolute inset-0">
          <div className="absolute left-[20%] top-[-12rem] h-[28rem] w-[28rem] rounded-full bg-violet-600/15 blur-[140px]" />

          <div className="absolute right-[15%] bottom-[-15rem] h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/10 blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-5 py-28 text-center sm:px-8 sm:py-36">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
            Your next decision starts here
          </p>

          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Stop staring at
            <br />
            spreadsheets.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/35">
            Give your business data a place where it can actually
            tell you something useful.
          </p>

          <a
            href="/signup"
            className="
              group
              mt-9
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-white
              px-6
              py-3.5
              text-sm
              font-semibold
              text-black
              transition
              hover:-translate-y-0.5
            "
          >
            Start analyzing for free

            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 text-xs font-black text-white">
                  B
                </div>

                <span className="text-sm font-semibold">
                  BusinessLens
                </span>
              </div>

              <p className="mt-5 max-w-sm text-xs leading-6 text-white/30">
                A simple analytics workspace for businesses that
                want to understand their data and make better
                decisions.
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
                Product
              </p>

              <div className="mt-4 space-y-3">
                <a
                  href="#analytics"
                  className="block text-xs text-white/40 hover:text-white"
                >
                  Analytics
                </a>

                <a
                  href="#reports"
                  className="block text-xs text-white/40 hover:text-white"
                >
                  Reports
                </a>

                <a
                  href="#product"
                  className="block text-xs text-white/40 hover:text-white"
                >
                  Data quality
                </a>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
                Company
              </p>

              <div className="mt-4 space-y-3">
                <a
                  href="/login"
                  className="block text-xs text-white/40 hover:text-white"
                >
                  Sign in
                </a>

                <a
                  href="/signup"
                  className="block text-xs text-white/40 hover:text-white"
                >
                  Get started
                </a>

                <a
                  href="mailto:hello@businesslens.app"
                  className="block text-xs text-white/40 hover:text-white"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-[10px] text-white/20 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © 2026 BusinessLens. Built for better decisions.
            </p>

            <div className="flex gap-5">
              <span>Privacy</span>
              <span>Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;