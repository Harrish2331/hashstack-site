import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Layers,
  Sparkles,
  Palette,
  ShoppingBag,
  Search,
  Star,
  Menu,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DESIGN TOKENS                                                      */
/* ------------------------------------------------------------------ */
const C = {
  bg: "#F8F7F5",
  bg2: "#EFEAE4",
  accent: "#FF7A00",
  accent2: "#FFB980",
  text: "#1A1A1A",
  glass: "rgba(255,255,255,0.55)",
  glassStrong: "rgba(255,255,255,0.75)",
  border: "rgba(0,0,0,0.08)",
  borderStrong: "rgba(0,0,0,0.14)",
  muted: "rgba(26,26,26,0.58)",
};

/* ------------------------------------------------------------------ */
/*  SCROLL REVEAL HOOK                                                 */
/* ------------------------------------------------------------------ */
function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}

function Reveal({ children, delay = 0, className = "", style = {} }) {
  const [ref, shown] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0px) scale(1)" : "translateY(28px) scale(0.98)",
        filter: shown ? "blur(0px)" : "blur(6px)",
        transition: `opacity 0.9s cubic-bezier(.19,1,.22,1) ${delay}ms, transform 0.9s cubic-bezier(.19,1,.22,1) ${delay}ms, filter 0.9s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  LOGO — recreated to match the light theme                          */
/* ------------------------------------------------------------------ */
function Logo({ light = false, small = false }) {
  const size = small ? 22 : 26;
  return (
    <div className="flex items-center gap-2 select-none">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <g>
          <rect x="10" y="4" width="5" height="32" rx="1.5" fill={light ? "#F8F7F5" : C.text} />
          <rect x="25" y="4" width="5" height="32" rx="1.5" fill={light ? "#F8F7F5" : C.text} />
          <rect x="4" y="14" width="32" height="5" rx="1.5" fill={light ? "#F8F7F5" : C.text} />
          <rect x="4" y="23" width="32" height="5" rx="1.5" fill={C.accent} />
        </g>
      </svg>
      <span
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600,
          fontSize: small ? 16 : 19,
          letterSpacing: "-0.02em",
          color: light ? "#F8F7F5" : C.text,
        }}
      >
        hashstack
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CURSOR GLOW                                                        */
/* ------------------------------------------------------------------ */
function CursorGlow() {
  const glowRef = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${e.clientX - 220}px, ${e.clientY - 220}px)`;
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed top-0 left-0 z-0 hidden md:block"
      style={{
        width: 440,
        height: 440,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(255,122,0,0.07) 0%, rgba(255,122,0,0) 70%)`,
        transition: "transform 0.25s ease-out",
        willChange: "transform",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  MAGNETIC BUTTON                                                    */
/* ------------------------------------------------------------------ */
function Magnetic({ children, className = "", style = {}, as = "button", ...props }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0px,0px)";
  };
  const Tag = as;
  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: "transform 0.25s cubic-bezier(.2,1,.3,1)", ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/*  SHARED NAV HELPERS                                                  */
/* ------------------------------------------------------------------ */
const NAV_LINKS = [
  { label: "Home", id: "home" },
  { label: "Services", id: "services" },
  { label: "Work", id: "work" },
  { label: "Process", id: "process" },
  { label: "Contact", id: "contact" },
];

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ------------------------------------------------------------------ */
/*  NAVBAR                                                             */
/* ------------------------------------------------------------------ */
function Navbar({ onOpenContact }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center" style={{ paddingTop: scrolled ? 12 : 22 }}>
      <nav
        className="flex items-center justify-between transition-all duration-500"
        style={{
          width: scrolled ? "min(720px, 92vw)" : "min(920px, 92vw)",
          padding: scrolled ? "10px 18px" : "14px 26px",
          borderRadius: 999,
          background: C.glassStrong,
          backdropFilter: "blur(18px) saturate(160%)",
          WebkitBackdropFilter: "blur(18px) saturate(160%)",
          border: `1px solid ${C.border}`,
          boxShadow: scrolled
            ? "0 8px 30px rgba(0,0,0,0.08)"
            : "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        <button onClick={goTo("home")} aria-label="HashStack home">
          <Logo small />
        </button>
        <div className="hidden md:flex items-center gap-7" style={{ fontFamily: "'Inter', sans-serif" }}>
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={goTo(l.id)}
              className="relative group"
              style={{ fontSize: 13.5, fontWeight: 500, color: C.text, opacity: 0.75, cursor: "pointer" }}
            >
              {l.label}
              <span
                className="absolute left-0 -bottom-1 h-[1.5px] w-0 group-hover:w-full transition-all duration-300"
                style={{ background: C.accent }}
              />
            </a>
          ))}
        </div>
        <Magnetic
          className="hidden md:inline-flex items-center gap-1.5"
          onClick={() => {
            setOpen(false);
            onOpenContact();
          }}
          style={{
            background: C.text,
            color: "#F8F7F5",
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            padding: "9px 18px",
            borderRadius: 999,
            cursor: "pointer",
          }}
        >
          Let's Talk <ArrowUpRight size={14} />
        </Magnetic>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      {open && (
        <div
          className="md:hidden fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 py-6"
          style={{
            width: "88vw",
            background: C.glassStrong,
            backdropFilter: "blur(18px)",
            border: `1px solid ${C.border}`,
            borderRadius: 24,
          }}
        >
          {NAV_LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={goTo(l.id)} style={{ fontFamily: "'Inter'", fontSize: 15, color: C.text, cursor: "pointer" }}>
              {l.label}
            </a>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              onOpenContact();
            }}
            style={{
              marginTop: 4,
              background: C.text,
              color: "#F8F7F5",
              fontFamily: "'Inter'",
              fontSize: 13.5,
              fontWeight: 600,
              padding: "10px 22px",
              borderRadius: 999,
            }}
          >
            Let's Talk
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO BACKGROUND                                                    */
/* ------------------------------------------------------------------ */
function HeroBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* animated grid */}
      <div
        className="absolute inset-0 hero-grid"
        style={{
          backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 90%)",
        }}
      />
      {/* radial gradients */}
      <div
        className="absolute rounded-full blur-orb-a"
        style={{
          width: 560,
          height: 560,
          top: -160,
          left: -120,
          background: `radial-gradient(circle, ${C.accent2}55 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute rounded-full blur-orb-b"
        style={{
          width: 480,
          height: 480,
          top: 60,
          right: -140,
          background: `radial-gradient(circle, ${C.accent}33 0%, transparent 70%)`,
        }}
      />
      {/* particles */}
      {[...Array(16)].map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full particle"
          style={{
            width: 3 + (i % 3),
            height: 3 + (i % 3),
            top: `${(i * 37) % 100}%`,
            left: `${(i * 53) % 100}%`,
            background: i % 3 === 0 ? C.accent : C.text,
            opacity: 0.18,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
      <div className="noise-overlay absolute inset-0" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO CENTERPIECE — floating glass browser + code + geometry        */
/* ------------------------------------------------------------------ */
function HeroCenterpiece() {
  return (
    <div className="relative w-full h-[460px] md:h-[560px] flex items-center justify-center">
      {/* gradient sphere */}
      <div
        className="absolute rounded-full float-slow"
        style={{
          width: 220,
          height: 220,
          right: 10,
          top: 10,
          background: `radial-gradient(circle at 35% 30%, ${C.accent2}, ${C.accent} 70%)`,
          filter: "blur(0.5px)",
          opacity: 0.9,
        }}
      />
      {/* rotating geometric ring */}
      <svg
        className="absolute spin-slow"
        style={{ right: -10, top: -6, opacity: 0.5 }}
        width="150"
        height="150"
        viewBox="0 0 150 150"
        fill="none"
      >
        <circle cx="75" cy="75" r="70" stroke={C.text} strokeOpacity="0.18" strokeWidth="1" strokeDasharray="4 8" />
      </svg>

      {/* floating browser window */}
      <div
        className="absolute float-med"
        style={{
          width: "min(430px, 82vw)",
          top: "14%",
          left: "6%",
          borderRadius: 18,
          background: C.glass,
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: `1px solid ${C.borderStrong}`,
          boxShadow: "0 30px 60px -20px rgba(26,26,26,0.18)",
          overflow: "hidden",
        }}
      >
        <div
          className="flex items-center gap-1.5 px-4 py-3"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          <span style={{ width: 8, height: 8, borderRadius: 99, background: "#FF7A6B" }} />
          <span style={{ width: 8, height: 8, borderRadius: 99, background: C.accent2 }} />
          <span style={{ width: 8, height: 8, borderRadius: 99, background: "#8FD19E" }} />
        </div>
        <div className="p-5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, lineHeight: 1.85 }}>
          <div style={{ color: "#8B8B8B" }}>01  <span style={{ color: C.accent }}>const</span> agency = {"{"}</div>
          <div style={{ color: "#8B8B8B" }}>02    name: <span style={{ color: "#4C8C6A" }}>'HashStack'</span>,</div>
          <div style={{ color: "#8B8B8B" }}>03    craft: <span style={{ color: "#4C8C6A" }}>'obsessive'</span>,</div>
          <div style={{ color: "#8B8B8B" }}>04    ships: <span style={{ color: C.accent }}>true</span></div>
          <div style={{ color: "#8B8B8B" }}>05  {"}"}</div>
        </div>
      </div>

      {/* glowing UI card */}
      <div
        className="absolute float-fast"
        style={{
          width: 190,
          bottom: "10%",
          right: "4%",
          borderRadius: 16,
          padding: "16px 18px",
          background: C.glassStrong,
          backdropFilter: "blur(16px)",
          border: `1px solid ${C.border}`,
          boxShadow: `0 20px 45px -15px ${C.accent}40`,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={14} color="#fff" />
          </span>
          <span style={{ fontFamily: "'Space Grotesk'", fontSize: 12.5, fontWeight: 600, color: C.text }}>
            Deploy ready
          </span>
        </div>
        <div style={{ height: 5, borderRadius: 99, background: C.border, overflow: "hidden" }}>
          <div style={{ height: "100%", width: "82%", background: C.accent, borderRadius: 99 }} />
        </div>
      </div>

      {/* small floating dot card */}
      <div
        className="absolute float-med2"
        style={{
          width: 96,
          height: 96,
          left: "2%",
          bottom: "6%",
          borderRadius: 20,
          background: `linear-gradient(155deg, ${C.bg2}, #ffffff)`,
          border: `1px solid ${C.border}`,
          boxShadow: "0 20px 40px -18px rgba(26,26,26,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Layers size={30} color={C.accent} strokeWidth={1.5} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO                                                                */
/* ------------------------------------------------------------------ */
function Hero({ onOpenContact }) {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-32 pb-16 px-6 md:px-14 overflow-hidden">
      <HeroBackdrop />
      <div className="relative z-10 max-w-[1300px] mx-auto w-full grid md:grid-cols-2 gap-14 items-center">
        <div>
          <Reveal>
            <div
              className="inline-flex items-center gap-2 mb-7 px-3.5 py-1.5 rounded-full"
              style={{ background: C.glassStrong, border: `1px solid ${C.border}` }}
            >
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: C.accent }} />
              <span style={{ fontFamily: "'Inter'", fontSize: 12, fontWeight: 500, color: C.muted }}>
                Now booking Q4 2026 projects
              </span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: "clamp(2.6rem, 5.4vw, 4.4rem)",
                lineHeight: 1.03,
                letterSpacing: "-0.03em",
                color: C.text,
              }}
            >
              Building Websites <br />
              That Build{" "}
              <span style={{ position: "relative", display: "inline-block" }}>
                Businesses
                <svg
                  style={{ position: "absolute", left: 0, bottom: -6, width: "100%" }}
                  height="10"
                  viewBox="0 0 300 10"
                  preserveAspectRatio="none"
                >
                  <path d="M2 7 Q150 -2 298 7" stroke={C.accent} strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              .
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p
              className="mt-7 max-w-md"
              style={{ fontFamily: "'Inter'", fontSize: 16.5, lineHeight: 1.7, color: C.muted }}
            >
              HashStack is a premium web development studio. We design and engineer
              products for founders who refuse to ship anything ordinary.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Magnetic
                className="inline-flex items-center gap-2"
                onClick={onOpenContact}
                style={{
                  background: C.text,
                  color: "#F8F7F5",
                  fontFamily: "'Inter'",
                  fontSize: 14.5,
                  fontWeight: 600,
                  padding: "15px 28px",
                  borderRadius: 999,
                  boxShadow: "0 14px 30px -10px rgba(26,26,26,0.35)",
                  cursor: "pointer",
                }}
              >
                Start a Project <ArrowRight size={16} />
              </Magnetic>
              <Magnetic
                className="inline-flex items-center gap-2"
                onClick={() => scrollToId("work")}
                style={{
                  background: "transparent",
                  color: C.text,
                  fontFamily: "'Inter'",
                  fontSize: 14.5,
                  fontWeight: 600,
                  padding: "15px 26px",
                  borderRadius: 999,
                  border: `1px solid ${C.borderStrong}`,
                  cursor: "pointer",
                }}
              >
                View Our Work
              </Magnetic>
            </div>
          </Reveal>
        </div>
        <Reveal delay={200}>
          <HeroCenterpiece />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  SOCIAL PROOF                                                       */
/* ------------------------------------------------------------------ */
function Stats() {
 const stats = [
  {
    value: "12+",
    label: "Projects Delivered",
  },
  {
    value: "100%",
    label: "Responsive & SEO Ready",
  },
  {
    value: "Fast",
    label: "Turnaround",
  },
  {
    value: "24/7",
    label: "Support",
  },
];
  return (
    <section className="relative z-10 px-6 md:px-14 -mt-6 md:-mt-10 pb-6">
      <div className="max-w-[1300px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Reveal key={s.l} delay={i * 90}>
            <div
              className="rounded-2xl px-6 py-7 text-center hover-lift"
              style={{
                background: C.glassStrong,
                backdropFilter: "blur(16px)",
                border: `1px solid ${C.border}`,
                boxShadow: "0 10px 30px -14px rgba(26,26,26,0.1)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Space Grotesk'",
                  fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                  fontWeight: 600,
                  color: C.text,
                }}
              >
                {s.value}
              </div>
              <div style={{ fontFamily: "'Inter'", fontSize: 12.5, color: C.muted, marginTop: 4 }}>{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  SERVICES                                                           */
/* ------------------------------------------------------------------ */
function Services({ onOpenContact }) {
  const services = [
    { icon: Code2, title: "Custom Website Development", desc: "Hand-built, high-performance sites engineered for speed and scale." },
    { icon: Layers, title: "SaaS Platforms", desc: "Full-stack products from first wireframe to production launch." },
    { icon: Sparkles, title: "AI Solutions", desc: "Applied AI features that make your product feel a step ahead." },
    { icon: Palette, title: "UI/UX Design", desc: "Interfaces designed around clarity, motion, and intent." },
    { icon: ShoppingBag, title: "E-commerce Development", desc: "Conversion-focused storefronts built to move product." },
    { icon: Search, title: "SEO", desc: "Technical and content SEO that compounds over time." },
  ];
  return (
    <section id="services" className="relative px-6 md:px-14 py-28 md:py-36">
      <div className="max-w-[1300px] mx-auto">
        <Reveal>
          <p style={{ fontFamily: "'Inter'", fontSize: 12.5, fontWeight: 600, letterSpacing: "0.14em", color: C.accent, textTransform: "uppercase" }}>
            What We Do
          </p>
          <h2
            className="mt-3 max-w-xl"
            style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: "clamp(1.9rem, 3.4vw, 2.7rem)", letterSpacing: "-0.02em", color: C.text }}
          >
            Full-stack craft, end to end.
          </h2>
        </Reveal>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={i * 80}>
                <div className="service-card group relative rounded-3xl p-8 h-full"
                  style={{
                    background: "#fff",
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div
                    className="service-icon-wrap inline-flex items-center justify-center rounded-2xl mb-6"
                    style={{ width: 52, height: 52, background: C.bg2 }}
                  >
                    <Icon size={22} color={C.accent} strokeWidth={1.6} className="service-icon" />
                  </div>
                  <h3 style={{ fontFamily: "'Space Grotesk'", fontSize: 17.5, fontWeight: 600, color: C.text }}>
                    {s.title}
                  </h3>
                  <p style={{ fontFamily: "'Inter'", fontSize: 13.8, lineHeight: 1.6, color: C.muted, marginTop: 10 }}>
                    {s.desc}
                  </p>
                  <button
                    onClick={onOpenContact}
                    className="mt-6 flex items-center gap-1.5"
                    style={{ fontFamily: "'Inter'", fontSize: 13, fontWeight: 600, color: C.text, cursor: "pointer" }}
                  >
                    Learn more
                    <ArrowUpRight size={15} className="service-arrow" />
                  </button>
                  <span className="service-border-glow" />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FEATURED PROJECTS — masonry                                        */
/* ------------------------------------------------------------------ */
function Projects({ onOpenContact }) {
  const projects = [
    { name: "Northline Bank", cat: "Fintech", tech: "Next.js · Node", tall: true, g: ["#1A1A1A", "#3a3a3a"] },
    { name: "Orbit Analytics", cat: "SaaS Dashboard", tech: "React · D3", tall: false, g: [C.accent, C.accent2] },
    { name: "Verdant", cat: "E-commerce", tech: "Shopify · Tailwind", tall: false, g: ["#4C8C6A", "#8FD19E"] },
    { name: "Studio Palet", cat: "Branding Site", tech: "Webflow", tall: true, g: ["#8B5CF6", "#C4B5FD"] },
  ];
  return (
    <section id="work" className="relative px-6 md:px-14 py-16 md:py-24" style={{ background: C.bg2 }}>
      <div className="max-w-[1300px] mx-auto">
        <Reveal>
          <p style={{ fontFamily: "'Inter'", fontSize: 12.5, fontWeight: 600, letterSpacing: "0.14em", color: C.accent, textTransform: "uppercase" }}>
            Selected Work
          </p>
          <h2 className="mt-3" style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: "clamp(1.9rem, 3.4vw, 2.7rem)", letterSpacing: "-0.02em", color: C.text }}>
            Projects we're proud of.
          </h2>
        </Reveal>
        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={i * 100}>
              <div
                role="button"
                tabIndex={0}
                onClick={onOpenContact}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpenContact()}
                className="project-card relative rounded-3xl overflow-hidden group cursor-pointer"
                style={{ height: p.tall ? 420 : 320, background: `linear-gradient(150deg, ${p.g[0]}, ${p.g[1]})` }}
              >
                <div className="project-zoom absolute inset-0" />
                <div className="absolute inset-0 flex flex-col justify-end p-8" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.55), transparent 55%)" }}>
                  <div className="project-reveal">
                    <span style={{ fontFamily: "'Inter'", fontSize: 11.5, fontWeight: 600, letterSpacing: "0.08em", color: "#fff", opacity: 0.8, textTransform: "uppercase" }}>
                      {p.cat}
                    </span>
                    <h3 style={{ fontFamily: "'Space Grotesk'", fontSize: 24, fontWeight: 600, color: "#fff", marginTop: 6 }}>
                      {p.name}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                      <span style={{ fontFamily: "'Inter'", fontSize: 12.5, color: "rgba(255,255,255,0.75)" }}>{p.tech}</span>
                      <span
                        className="inline-flex items-center justify-center rounded-full"
                        style={{ width: 34, height: 34, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)" }}
                      >
                        <ArrowUpRight size={16} color="#fff" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PROCESS TIMELINE                                                    */
/* ------------------------------------------------------------------ */
function Process() {
  const steps = [
    { t: "Discovery", d: "We map your goals, users, and technical constraints." },
    { t: "Strategy", d: "A clear roadmap: scope, stack, and timeline." },
    { t: "Design", d: "High-fidelity interfaces, refined round by round." },
    { t: "Development", d: "Production-grade engineering, built to scale." },
    { t: "Launch", d: "Shipped, tested, and monitored from day one." },
    { t: "Growth", d: "Ongoing iteration based on real usage data." },
  ];
  return (
    <section id="process" className="relative px-6 md:px-14 py-28 md:py-36">
      <div className="max-w-[1300px] mx-auto">
        <Reveal>
          <p style={{ fontFamily: "'Inter'", fontSize: 12.5, fontWeight: 600, letterSpacing: "0.14em", color: C.accent, textTransform: "uppercase" }}>
            How We Work
          </p>
          <h2 className="mt-3" style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: "clamp(1.9rem, 3.4vw, 2.7rem)", letterSpacing: "-0.02em", color: C.text }}>
            A process built for certainty.
          </h2>
        </Reveal>
        <div className="mt-16 relative">
          <div className="hidden md:block absolute top-0 bottom-0 left-[27px]" style={{ width: 1, background: C.border }} />
          <div className="flex flex-col gap-10 md:gap-12">
            {steps.map((s, i) => (
              <Reveal key={s.t} delay={i * 90}>
                <div className="flex items-start gap-6">
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-full relative z-10"
                    style={{ width: 56, height: 56, background: "#fff", border: `1.5px solid ${C.borderStrong}` }}
                  >
                    <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13, color: C.accent }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="pt-2.5">
                    <h3 style={{ fontFamily: "'Space Grotesk'", fontSize: 19, fontWeight: 600, color: C.text }}>{s.t}</h3>
                    <p style={{ fontFamily: "'Inter'", fontSize: 14, color: C.muted, marginTop: 4, maxWidth: 460 }}>{s.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ------------------------------------------------------------------ */
/*  TESTIMONIALS                                                        */
/* ------------------------------------------------------------------ */
function Testimonials() {
  const items = [
    { name: "Elena Ross", co: "Northline Bank", review: "HashStack rebuilt our platform end to end. The engineering quality was on another level.", rating: 5 },
    { name: "Marcus Webb", co: "Orbit Analytics", review: "Fast, precise, and genuinely thoughtful about product decisions, not just pixels.", rating: 5 },
    { name: "Priya Nair", co: "Verdant", review: "Our conversion rate jumped within weeks of launch. Worth every rupee.", rating: 5 },
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 4500);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="relative px-6 md:px-14 py-16 md:py-24" style={{ background: C.bg2 }}>
      <div className="max-w-[720px] mx-auto text-center">
        <Reveal>
          <p style={{ fontFamily: "'Inter'", fontSize: 12.5, fontWeight: 600, letterSpacing: "0.14em", color: C.accent, textTransform: "uppercase" }}>
            Client Voices
          </p>
        </Reveal>
        <div className="mt-10 relative" style={{ minHeight: 220 }}>
          {items.map((it, i) => (
            <div
              key={it.name}
              className="absolute inset-0 flex flex-col items-center"
              style={{
                opacity: i === idx ? 1 : 0,
                transform: i === idx ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.7s ease, transform 0.7s ease",
                pointerEvents: i === idx ? "auto" : "none",
              }}
            >
              <div
                className="rounded-3xl p-9"
                style={{ background: C.glassStrong, backdropFilter: "blur(16px)", border: `1px solid ${C.border}`, boxShadow: "0 20px 50px -20px rgba(26,26,26,0.15)" }}
              >
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(it.rating)].map((_, k) => (
                    <Star key={k} size={14} fill={C.accent} color={C.accent} />
                  ))}
                </div>
                <p style={{ fontFamily: "'Space Grotesk'", fontSize: 18, lineHeight: 1.55, color: C.text }}>
                  "{it.review}"
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <span
                    className="flex items-center justify-center rounded-full"
                    style={{ width: 34, height: 34, background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`, fontFamily: "'Space Grotesk'", fontSize: 13, color: "#fff", fontWeight: 600 }}
                  >
                    {it.name[0]}
                  </span>
                  <div className="text-left">
                    <div style={{ fontFamily: "'Inter'", fontSize: 13, fontWeight: 600, color: C.text }}>{it.name}</div>
                    <div style={{ fontFamily: "'Inter'", fontSize: 11.5, color: C.muted }}>{it.co}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 20 : 6,
                height: 6,
                borderRadius: 99,
                background: i === idx ? C.accent : C.borderStrong,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA                                                                 */
/* ------------------------------------------------------------------ */
function CTA({ onOpenContact }) {
  return (
    <section id="contact" className="relative px-6 md:px-14 py-24 md:py-32">
      <div
        className="max-w-[1300px] mx-auto relative rounded-[36px] overflow-hidden text-center px-6 py-20 md:py-28"
        style={{ background: C.text }}
      >
        <div className="absolute inset-0 mesh-gradient" />
        <div className="relative z-10">
          <Reveal>
            <h2
              className="max-w-2xl mx-auto"
              style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: "clamp(2rem, 4.2vw, 3.2rem)", letterSpacing: "-0.02em", color: "#F8F7F5" }}
            >
              Let's Build Something Extraordinary.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p style={{ fontFamily: "'Inter'", fontSize: 15, color: "rgba(248,247,245,0.65)", marginTop: 16 }}>
              Tell us about your project — we typically reply within a day.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <Magnetic
              className="inline-flex items-center gap-2 mt-9"
              onClick={onOpenContact}
              style={{
                background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
                color: "#1A1A1A",
                fontFamily: "'Inter'",
                fontSize: 15,
                fontWeight: 700,
                padding: "17px 34px",
                borderRadius: 999,
                boxShadow: `0 20px 40px -12px ${C.accent}80`,
                cursor: "pointer",
              }}
            >
              Start a Project <ArrowRight size={17} />
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FOOTER                                                              */
/* ------------------------------------------------------------------ */
function Footer({ onOpenContact }) {
  const cols = [
    {
      h: "Studio",
      items: [
        { label: "Services", id: "services" },
        { label: "Work", id: "work" },
        { label: "Process", id: "process" },
      ],
    },
    {
      h: "Company",
      items: [
        { label: "About", id: "process" },
        { label: "Careers", id: "contact", contact: true },
        { label: "Contact", id: "contact", contact: true },
        { label: "Blog", id: "work" },
      ],
    },
  ];
  const socials = [
    { s: "IG", href: "https://instagram.com" },
    { s: "X", href: "https://x.com" },
    { s: "IN", href: "https://linkedin.com" },
  ];
  return (
    <footer className="relative px-6 md:px-14 pt-20 pb-10" style={{ borderTop: `1px solid ${C.border}` }}>
      <div className="max-w-[1300px] mx-auto">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12">
          <div>
            <button onClick={() => scrollToId("home")} aria-label="HashStack home">
              <Logo />
            </button>
            <p style={{ fontFamily: "'Inter'", fontSize: 13.5, color: C.muted, marginTop: 16, maxWidth: 280, lineHeight: 1.6 }}>
              Crafting digital experiences that scale. A premium web development studio.
            </p>
            <div className="flex gap-3 mt-6">
              {socials.map(({ s, href }) => (
                <a
                  key={s}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s}
                  className="flex items-center justify-center rounded-full hover-lift"
                  style={{ width: 36, height: 36, border: `1px solid ${C.border}`, fontFamily: "'Inter'", fontSize: 11, fontWeight: 600, color: C.text, cursor: "pointer" }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <h4 style={{ fontFamily: "'Space Grotesk'", fontSize: 13.5, fontWeight: 600, color: C.text }}>{c.h}</h4>
              <div className="flex flex-col gap-3 mt-5">
                {c.items.map((it) => (
                  <a
                    key={it.label}
                    href={`#${it.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (it.contact) onOpenContact();
                      else scrollToId(it.id);
                    }}
                    style={{ fontFamily: "'Inter'", fontSize: 13.5, color: C.muted, cursor: "pointer" }}
                  >
                    {it.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
          <div>
            <h4 style={{ fontFamily: "'Space Grotesk'", fontSize: 13.5, fontWeight: 600, color: C.text }}>Legal</h4>
            <div className="flex flex-col gap-3 mt-5">
              <a href="#" onClick={(e) => e.preventDefault()} style={{ fontFamily: "'Inter'", fontSize: 13.5, color: C.muted, cursor: "pointer" }}>
                Privacy
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ fontFamily: "'Inter'", fontSize: 13.5, color: C.muted, cursor: "pointer" }}>
                Terms
              </a>
            </div>
          </div>
        </div>
        <div
          className="mt-16 pt-7 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: `1px solid ${C.border}` }}
        >
          <span style={{ fontFamily: "'Inter'", fontSize: 12, color: C.muted }}>
  © 2026 HashStack. All rights reserved.
</span>

<div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "6px",
  }}
>
  <a
    href="mailto:hashstack.co.in@gmail.com"
    style={{
      fontFamily: "'Inter'",
      fontSize: 12,
      color: C.muted,
      textDecoration: "none",
    }}
  >
    hashstack.co.in@gmail.com
  </a>

  <a
    href="tel:+918072441637"
    style={{
      fontFamily: "'Inter'",
      fontSize: 12,
      color: C.muted,
      textDecoration: "none",
    }}
  >
    +91 80724 41637
  </a>

  <a
    href="tel:+919841896688"
    style={{
      fontFamily: "'Inter'",
      fontSize: 12,
      color: C.muted,
      textDecoration: "none",
    }}
  >
    +91 98418 96688
  </a>
</div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  CONTACT MODAL                                                       */
/* ------------------------------------------------------------------ */
function ContactModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", budget: "Starter", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // reset a moment after the modal fully closes
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setSubmitted(false);
        setForm({ name: "", email: "", budget: "Starter", message: "" });
        setErrors({});
      }, 350);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!open) return null;

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.message.trim()) errs.message = "Tell us a little about the project";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      onClick={onClose}
      style={{
        background: "rgba(26,26,26,0.45)",
        backdropFilter: "blur(4px)",
        animation: "fadeIn 0.25s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full modal-pop"
        style={{
          maxWidth: 480,
          maxHeight: "88vh",
          overflowY: "auto",
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 28,
          padding: "34px 30px",
          boxShadow: "0 40px 90px -20px rgba(26,26,26,0.35)",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 flex items-center justify-center rounded-full"
          style={{ width: 32, height: 32, background: "#fff", border: `1px solid ${C.border}` }}
        >
          <X size={15} color={C.text} />
        </button>

        {!submitted ? (
          <>
            <span
              style={{
                fontFamily: "'Inter'",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.1em",
                color: C.accent,
                textTransform: "uppercase",
              }}
            >
              Start a Project
            </span>
            <h3 style={{ fontFamily: "'Space Grotesk'", fontSize: 24, fontWeight: 600, color: C.text, marginTop: 8 }}>
              Let's build something extraordinary.
            </h3>
            <p style={{ fontFamily: "'Inter'", fontSize: 13.5, color: C.muted, marginTop: 6 }}>
              Tell us a bit about your project — we reply within a day.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4" noValidate>
              <div>
                <label style={{ fontFamily: "'Inter'", fontSize: 12.5, fontWeight: 600, color: C.text }}>Name</label>
                <input
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Your name"
                  className="modal-input"
                  style={{ borderColor: errors.name ? "#E0483E" : C.border }}
                />
                {errors.name && <span className="modal-error">{errors.name}</span>}
              </div>
              <div>
                <label style={{ fontFamily: "'Inter'", fontSize: 12.5, fontWeight: 600, color: C.text }}>Email</label>
                <input
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@company.com"
                  className="modal-input"
                  style={{ borderColor: errors.email ? "#E0483E" : C.border }}
                />
                {errors.email && <span className="modal-error">{errors.email}</span>}
              </div>
              <div>
                <label style={{ fontFamily: "'Inter'", fontSize: 12.5, fontWeight: 600, color: C.text }}>Budget</label>
                <select value={form.budget} onChange={update("budget")} className="modal-input" style={{ borderColor: C.border }}>
                  <option>Starter</option>
                  <option>Growth</option>
                  <option>Scale</option>
                  <option>Not sure yet</option>
                </select>
              </div>
              <div>
                <label style={{ fontFamily: "'Inter'", fontSize: 12.5, fontWeight: 600, color: C.text }}>Project details</label>
                <textarea
                  value={form.message}
                  onChange={update("message")}
                  placeholder="What are you looking to build?"
                  rows={4}
                  className="modal-input"
                  style={{ borderColor: errors.message ? "#E0483E" : C.border, resize: "none" }}
                />
                {errors.message && <span className="modal-error">{errors.message}</span>}
              </div>
              <Magnetic
                as="button"
                className="inline-flex items-center justify-center gap-2 mt-2"
                style={{
                  background: C.text,
                  color: "#F8F7F5",
                  fontFamily: "'Inter'",
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "14px 24px",
                  borderRadius: 999,
                }}
              >
                Send Message <ArrowRight size={15} />
              </Magnetic>
            </form>
          </>
        ) : (
          <div className="py-8 text-center flex flex-col items-center">
            <span
              className="flex items-center justify-center rounded-full mb-5"
              style={{ width: 56, height: 56, background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})` }}
            >
              <Sparkles size={24} color="#fff" />
            </span>
            <h3 style={{ fontFamily: "'Space Grotesk'", fontSize: 21, fontWeight: 600, color: C.text }}>
              Message sent.
            </h3>
            <p style={{ fontFamily: "'Inter'", fontSize: 13.8, color: C.muted, marginTop: 8, maxWidth: 300 }}>
              Thanks, {form.name.split(" ")[0] || "there"} — we'll get back to you at {form.email} within one business day.
            </p>
            <button
              onClick={onClose}
              className="mt-7"
              style={{
                fontFamily: "'Inter'",
                fontSize: 13.5,
                fontWeight: 600,
                color: C.text,
                padding: "11px 22px",
                borderRadius: 999,
                border: `1px solid ${C.borderStrong}`,
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  GLOBAL STYLES                                                       */
/* ------------------------------------------------------------------ */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

      .hero-grid { animation: gridDrift 26s linear infinite; }
      @keyframes gridDrift { 0% { background-position: 0 0, 0 0; } 100% { background-position: 56px 56px, 56px 56px; } }

      .blur-orb-a { animation: floatA 14s ease-in-out infinite; }
      .blur-orb-b { animation: floatB 17s ease-in-out infinite; }
      @keyframes floatA { 0%,100% { transform: translate(0,0); } 50% { transform: translate(30px, 20px); } }
      @keyframes floatB { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-25px, 25px); } }

      .particle { animation: particleFloat 8s ease-in-out infinite; }
      @keyframes particleFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-18px); } }

      .noise-overlay {
        opacity: 0.025;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      }

      .float-slow { animation: floatSlow 7s ease-in-out infinite; }
      .float-med { animation: floatMed 6s ease-in-out infinite; }
      .float-med2 { animation: floatMed2 6.5s ease-in-out infinite; }
      .float-fast { animation: floatFast 5s ease-in-out infinite; }
      @keyframes floatSlow { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-16px); } }
      @keyframes floatMed { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-12px) rotate(0.6deg); } }
      @keyframes floatMed2 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(14px); } }
      @keyframes floatFast { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }

      .spin-slow { animation: spinSlow 40s linear infinite; }
      @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

      .pulse-dot { animation: pulseDot 1.8s ease-in-out infinite; }
      @keyframes pulseDot { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }

      .hover-lift { transition: transform 0.35s cubic-bezier(.2,1,.3,1), box-shadow 0.35s ease; }
      .hover-lift:hover { transform: translateY(-4px); }

      .service-card { transition: transform 0.4s cubic-bezier(.2,1,.3,1), box-shadow 0.4s ease, border-color 0.4s ease; }
      .service-card:hover { transform: translateY(-6px); box-shadow: 0 26px 50px -20px rgba(26,26,26,0.16); border-color: rgba(0,0,0,0.14); }
      .service-icon-wrap { transition: background 0.4s ease, transform 0.5s cubic-bezier(.2,1,.3,1); }
      .service-card:hover .service-icon-wrap { background: #FF7A00; transform: rotate(-8deg); }
      .service-card:hover .service-icon { color: #fff !important; stroke: #fff !important; }
      .service-arrow { transition: transform 0.35s cubic-bezier(.2,1,.3,1); }
      .service-card:hover .service-arrow { transform: translate(3px, -3px); }

      .project-card { transition: transform 0.5s cubic-bezier(.2,1,.3,1); }
      .project-card:hover { transform: translateY(-6px); }
      .project-zoom { transition: transform 0.7s cubic-bezier(.2,1,.3,1); }
      .project-card:hover .project-zoom { transform: scale(1.06); }
      .project-reveal { transform: translateY(6px); transition: transform 0.45s ease; }
      .project-card:hover .project-reveal { transform: translateY(0); }

      .mesh-gradient {
        background:
          radial-gradient(circle at 20% 20%, rgba(255,122,0,0.35), transparent 45%),
          radial-gradient(circle at 80% 30%, rgba(255,185,128,0.28), transparent 45%),
          radial-gradient(circle at 50% 90%, rgba(255,122,0,0.22), transparent 50%);
        animation: meshMove 12s ease-in-out infinite;
        background-size: 180% 180%;
      }
      @keyframes meshMove { 0%,100% { background-position: 0% 0%; } 50% { background-position: 100% 60%; } }

      .modal-input {
        width: 100%;
        margin-top: 6px;
        padding: 11px 14px;
        border-radius: 12px;
        border: 1px solid rgba(0,0,0,0.08);
        background: #fff;
        font-family: 'Inter', sans-serif;
        font-size: 13.5px;
        color: #1A1A1A;
        outline: none;
        transition: border-color 0.25s ease, box-shadow 0.25s ease;
      }
      .modal-input:focus { border-color: #FF7A00; box-shadow: 0 0 0 3px rgba(255,122,0,0.12); }
      .modal-error { display: block; font-family: 'Inter', sans-serif; font-size: 11.5px; color: #E0483E; margin-top: 5px; }
      .modal-pop { animation: modalPop 0.35s cubic-bezier(.2,1,.3,1); }
      @keyframes modalPop { from { opacity: 0; transform: translateY(14px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

      html { scroll-behavior: smooth; }

      @media (prefers-reduced-motion: reduce) {
        * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
      }
    `}</style>
  );
}

/* ------------------------------------------------------------------ */
/*  ROOT                                                                */
/* ------------------------------------------------------------------ */
export default function HashStackLanding() {
  const [contactOpen, setContactOpen] = useState(false);
  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);

  return (
    <div style={{ background: C.bg, color: C.text, position: "relative", overflowX: "hidden" }}>
      <GlobalStyles />
      <CursorGlow />
      <Navbar onOpenContact={openContact} />
      <Hero onOpenContact={openContact} />
      <Stats />
      <Services onOpenContact={openContact} />
      <Projects onOpenContact={openContact} />
      <Process />
      <Testimonials />
      <CTA onOpenContact={openContact} />
      <Footer onOpenContact={openContact} />
      <ContactModal open={contactOpen} onClose={closeContact} />
    </div>
  );
}
