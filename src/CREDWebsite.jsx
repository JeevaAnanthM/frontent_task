import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   GLOBAL STYLES  (injected once into <head>)
───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Manrope:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #080808;
    --bg2:      #0f0f0f;
    --bg3:      #141414;
    --surface:  #1a1a1a;
    --border:   #2a2a2a;
    --gold:     #d4af37;
    --gold2:    #f5c842;
    --gold3:    #b8960c;
    --white:    #f0ede8;
    --muted:    #888880;
    --accent:   #c8ff00;
    --purple:   #7c3aed;
    --red:      #ef4444;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--white);
    font-family: 'Manrope', sans-serif;
    overflow-x: hidden;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--gold3); border-radius: 4px; }

  /* ── Animations ── */
  @keyframes floatY {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-18px) rotate(3deg); }
  }
  @keyframes floatX {
    0%,100% { transform: translateX(0px); }
    50%      { transform: translateX(12px); }
  }
  @keyframes pulse-glow {
    0%,100% { box-shadow: 0 0 20px rgba(212,175,55,0.3); }
    50%      { box-shadow: 0 0 60px rgba(212,175,55,0.7), 0 0 100px rgba(212,175,55,0.3); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes rotate-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes fade-up {
    from { opacity:0; transform:translateY(40px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes scale-in {
    from { opacity:0; transform:scale(0.85); }
    to   { opacity:1; transform:scale(1); }
  }
  @keyframes gradient-shift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes blink {
    0%,100% { opacity:1; } 50% { opacity:0; }
  }
  @keyframes card-hover-glow {
    0%,100% { box-shadow: 0 8px 32px rgba(212,175,55,0.1); }
    50%      { box-shadow: 0 16px 64px rgba(212,175,55,0.25); }
  }
  @keyframes orbit {
    from { transform: rotate(0deg) translateX(120px) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
  }
  @keyframes waveform {
    0%,100% { height: 8px; }
    50%      { height: 32px; }
  }

  /* Utility classes */
  .font-syne   { font-family: 'Syne', sans-serif; }
  .font-mono   { font-family: 'Space Mono', monospace; }

  .animate-float-y  { animation: floatY 4s ease-in-out infinite; }
  .animate-float-x  { animation: floatX 3s ease-in-out infinite; }
  .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
  .animate-rotate   { animation: rotate-slow 20s linear infinite; }
  .animate-fade-up  { animation: fade-up .7s cubic-bezier(.16,1,.3,1) both; }
  .animate-scale-in { animation: scale-in .5s cubic-bezier(.16,1,.3,1) both; }
  .animate-ticker   { animation: ticker 22s linear infinite; }

  .shimmer-text {
    background: linear-gradient(90deg, var(--gold3), var(--gold2), #fff8d0, var(--gold2), var(--gold3));
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }

  .neopop-btn {
    position: relative;
    background: var(--gold);
    color: #000;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    transition: transform .15s, box-shadow .15s;
    box-shadow: 4px 4px 0 var(--gold3), 8px 8px 0 rgba(212,175,55,0.25);
  }
  .neopop-btn:hover {
    transform: translate(-3px, -3px);
    box-shadow: 7px 7px 0 var(--gold3), 14px 14px 0 rgba(212,175,55,0.2);
  }
  .neopop-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 var(--gold3);
  }

  .neopop-btn-dark {
    position: relative;
    background: transparent;
    color: var(--gold);
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: 1.5px solid var(--gold);
    cursor: pointer;
    transition: transform .15s, box-shadow .15s, background .15s;
    box-shadow: 4px 4px 0 var(--gold3);
  }
  .neopop-btn-dark:hover {
    transform: translate(-3px, -3px);
    box-shadow: 7px 7px 0 var(--gold3);
    background: rgba(212,175,55,0.08);
  }

  .glass-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .section-reveal {
    opacity: 0;
    transform: translateY(48px);
    transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1);
  }
  .section-reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .feature-card:hover {
    border-color: rgba(212,175,55,0.4) !important;
    transform: translateY(-6px);
    box-shadow: 0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.15);
  }
  .feature-card { transition: all .3s cubic-bezier(.16,1,.3,1); }

  .ticker-wrap { overflow: hidden; white-space: nowrap; }

  .nav-link {
    position: relative;
    color: var(--muted);
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.05em;
    transition: color .2s;
    cursor: pointer;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0;
    width: 0; height: 1px;
    background: var(--gold);
    transition: width .3s;
  }
  .nav-link:hover { color: var(--white); }
  .nav-link:hover::after { width: 100%; }

  .counter-num {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
  }

  /* Noise overlay */
  .noise-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.018;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  .gradient-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
  }

  .waveform-bar {
    display: inline-block;
    width: 3px;
    background: var(--gold);
    border-radius: 2px;
    margin: 0 1px;
    animation: waveform 1.2s ease-in-out infinite;
  }

  /* GSAP-style stagger via CSS delay */
  .stagger-1 { animation-delay: .1s; }
  .stagger-2 { animation-delay: .2s; }
  .stagger-3 { animation-delay: .3s; }
  .stagger-4 { animation-delay: .4s; }
  .stagger-5 { animation-delay: .5s; }
  .stagger-6 { animation-delay: .6s; }

  /* 3D perspective card tilt */
  .tilt-card {
    transform-style: preserve-3d;
    transition: transform .3s;
  }
`;

/* ─────────────────────────────────────────────
   HOOK: Intersection Observer for reveal
───────────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─────────────────────────────────────────────
   HOOK: Animated counter
───────────────────────────────────────────── */
function useCounter(target, duration = 2000, suffix = "") {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const step = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 4);
          setVal(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { ref, display: val + suffix };
}

/* ─────────────────────────────────────────────
   HOOK: 3D tilt effect
───────────────────────────────────────────── */
function useTilt() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.03)`;
    };
    const onLeave = () => { el.style.transform = ""; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, []);
  return ref;
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

/* ── Navbar ── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["Home", "Features", "Rewards", "Security", "About"];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      padding: "0 5%",
      background: scrolled ? "rgba(8,8,8,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(212,175,55,0.1)" : "none",
      transition: "all .4s",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: "68px",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, background: "var(--gold)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14,
          color: "#000", letterSpacing: "-1px",
          boxShadow: "3px 3px 0 var(--gold3)",
        }}>CR</div>
        <span className="font-syne" style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>CRED</span>
      </div>
      {/* Links desktop */}
      <div style={{ display: "flex", gap: 36, alignItems: "center" }}
           className="desktop-nav">
        {links.map(l => <span key={l} className="nav-link">{l}</span>)}
      </div>
      {/* CTA */}
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <span className="nav-link" style={{ display: "none" }}>Login</span>
        <button className="neopop-btn" style={{ padding: "9px 22px", fontSize: 11, borderRadius: 2 }}>
          Join Now
        </button>
        {/* Hamburger */}
        <button onClick={() => setMenuOpen(v => !v)} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "none", flexDirection: "column", gap: 5, padding: 4,
        }} className="hamburger">
          {[0,1,2].map(i => <span key={i} style={{
            display: "block", width: 22, height: 2,
            background: menuOpen && i === 1 ? "transparent" : "var(--white)",
            transform: menuOpen ? (i===0 ? "rotate(45deg) translate(5px,5px)" : i===2 ? "rotate(-45deg) translate(5px,-5px)" : "") : "",
            transition: "all .3s",
          }}/>)}
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "rgba(10,10,10,0.98)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
          padding: "24px 5%",
          display: "flex", flexDirection: "column", gap: 20,
        }}>
          {links.map(l => (
            <span key={l} onClick={() => setMenuOpen(false)}
              style={{ fontFamily:"'Syne',sans-serif", fontWeight: 600, fontSize: 20, cursor:"pointer" }}>
              {l}
            </span>
          ))}
        </div>
      )}
      <style>{`
        @media(max-width:768px) {
          .desktop-nav { display:none !important; }
          .hamburger { display:flex !important; }
        }
      `}</style>
    </nav>
  );
}

/* ── Hero ── */
function Hero() {
  const [typed, setTyped] = useState("");
  const words = ["Exclusive.", "Premium.", "Rewarding.", "Yours."];
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const w = words[wi];
    let timeout;
    if (!deleting && ci < w.length) {
      timeout = setTimeout(() => { setTyped(w.slice(0, ci + 1)); setCi(c => c + 1); }, 90);
    } else if (!deleting && ci === w.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && ci > 0) {
      timeout = setTimeout(() => { setTyped(w.slice(0, ci - 1)); setCi(c => c - 1); }, 50);
    } else if (deleting && ci === 0) {
      setDeleting(false);
      setWi(v => (v + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [ci, deleting, wi]);

  const tiltRef = useTilt();

  return (
    <section style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center",
      position: "relative",
      overflow: "hidden",
      paddingTop: 80,
    }}>
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 70%)" }}/>
      <div className="gradient-orb" style={{ width:500, height:500, background:"rgba(212,175,55,0.04)", top:"10%", left:"-10%" }}/>
      <div className="gradient-orb" style={{ width:400, height:400, background:"rgba(124,58,237,0.04)", top:"30%", right:"-5%" }}/>
      {/* Grid lines */}
      <div style={{
        position:"absolute", inset:0,
        backgroundImage:"linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px)",
        backgroundSize:"60px 60px",
        maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
      }}/>

      <div style={{ width:"100%", maxWidth:1280, margin:"0 auto", padding:"0 5%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
        {/* Left */}
        <div>
          <div className="animate-fade-up" style={{ animationDelay:".1s", marginBottom:20 }}>
            <span style={{
              display:"inline-flex", alignItems:"center", gap:8,
              background:"rgba(212,175,55,0.08)", border:"1px solid rgba(212,175,55,0.2)",
              padding:"6px 16px", borderRadius:40, fontSize:11,
              fontFamily:"'Space Mono',monospace", color:"var(--gold)", letterSpacing:"0.12em",
            }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--gold)", display:"inline-block", animation:"pulse-glow 1.5s infinite" }}/>
              MEMBERS-ONLY CLUB
            </span>
          </div>

          <h1 className="font-syne animate-fade-up" style={{
            fontSize:"clamp(48px,6vw,88px)", fontWeight:800,
            lineHeight:1.0, letterSpacing:"-0.04em", marginBottom:24,
            animationDelay:".2s",
          }}>
            CREDIT IS<br/>
            BEING REBORN.
          </h1>

          <div className="font-syne animate-fade-up" style={{
            fontSize:"clamp(32px,4vw,56px)", fontWeight:700,
            color:"var(--gold)", marginBottom:28, height:"1.3em",
            animationDelay:".3s",
          }}>
            {typed}<span style={{ animation:"blink 1s infinite", marginLeft:2 }}>|</span>
          </div>

          <p className="animate-fade-up" style={{
            color:"var(--muted)", fontSize:16, lineHeight:1.7,
            maxWidth:460, marginBottom:40, animationDelay:".4s",
          }}>
            CRED is a members-only club where you get rewarded for paying credit card bills on time. Join 12M+ responsible Indians who trust CRED.
          </p>

          <div className="animate-fade-up" style={{ display:"flex", gap:16, flexWrap:"wrap", animationDelay:".5s" }}>
            <button className="neopop-btn" style={{ padding:"16px 36px", fontSize:13, borderRadius:3 }}>
              Get Started Free
            </button>
            <button className="neopop-btn-dark" style={{ padding:"16px 36px", fontSize:13, borderRadius:3 }}>
              Watch Demo ↗
            </button>
          </div>

          {/* Mini stats */}
          <div className="animate-fade-up" style={{
            display:"flex", gap:36, marginTop:48,
            paddingTop:32, borderTop:"1px solid var(--border)",
            animationDelay:".6s",
          }}>
            {[["12M+","Members"],["₹20K Cr","Paid Monthly"],["4.9★","App Rating"]].map(([v,l]) => (
              <div key={l}>
                <div className="font-syne" style={{ fontSize:22, fontWeight:800, color:"var(--gold)" }}>{v}</div>
                <div style={{ fontSize:11, color:"var(--muted)", letterSpacing:"0.08em", marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right – premium card mockup */}
        <div style={{ display:"flex", justifyContent:"center", alignItems:"center", position:"relative" }}>
          {/* Floating rings */}
          <div style={{
            position:"absolute", width:360, height:360, borderRadius:"50%",
            border:"1px solid rgba(212,175,55,0.08)",
            animation:"rotate-slow 25s linear infinite",
          }}/>
          <div style={{
            position:"absolute", width:480, height:480, borderRadius:"50%",
            border:"1px dashed rgba(212,175,55,0.04)",
            animation:"rotate-slow 40s linear infinite reverse",
          }}/>

          {/* Hero Card */}
          <div ref={tiltRef} className="tilt-card" style={{
            width:320, padding:32,
            background:"linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 40%, #1a1510 100%)",
            border:"1px solid rgba(212,175,55,0.25)",
            borderRadius:20,
            boxShadow:"0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,175,55,0.15)",
            position:"relative", overflow:"hidden",
            animation:"floatY 5s ease-in-out infinite",
          }}>
            {/* Card shimmer overlay */}
            <div style={{
              position:"absolute", inset:0, borderRadius:20,
              background:"linear-gradient(105deg, transparent 40%, rgba(212,175,55,0.05) 50%, transparent 60%)",
              backgroundSize:"200% 200%",
              animation:"shimmer 3s linear infinite",
            }}/>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:40 }}>
              <div style={{ display:"flex", flexDirection:"column" }}>
                <span className="font-syne" style={{ fontSize:13, fontWeight:800, letterSpacing:"0.15em", color:"var(--gold)" }}>CRED</span>
                <span style={{ fontSize:10, color:"var(--muted)", letterSpacing:"0.1em" }}>BLACK</span>
              </div>
              <div style={{
                width:40, height:40, borderRadius:"50%",
                border:"2px solid rgba(212,175,55,0.3)",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <div style={{
                  width:20, height:20, borderRadius:"50%",
                  background:"linear-gradient(135deg, var(--gold), var(--gold3))",
                }}/>
              </div>
            </div>
            {/* Chip */}
            <div style={{
              width:44, height:34, background:"linear-gradient(135deg, var(--gold3), var(--gold))",
              borderRadius:6, marginBottom:24, opacity:0.8,
              boxShadow:"inset 0 0 8px rgba(0,0,0,0.3)",
            }}/>
            {/* Number */}
            <div className="font-mono" style={{ fontSize:14, letterSpacing:"0.25em", color:"var(--white)", marginBottom:20, opacity:.8 }}>
              •••• •••• •••• 8841
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
              <div>
                <div style={{ fontSize:9, color:"var(--muted)", letterSpacing:"0.1em", marginBottom:3 }}>CARD HOLDER</div>
                <div className="font-syne" style={{ fontWeight:700, fontSize:13, letterSpacing:"0.08em" }}>RAHUL SHARMA</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:9, color:"var(--muted)", letterSpacing:"0.1em", marginBottom:3 }}>EXPIRES</div>
                <div className="font-mono" style={{ fontSize:13 }}>12/27</div>
              </div>
              <div style={{
                display:"flex", alignItems:"center",
              }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(255,80,80,0.7)", marginRight:-12 }}/>
                <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(255,180,0,0.7)" }}/>
              </div>
            </div>
          </div>

          {/* Floating coin badge */}
          <div style={{
            position:"absolute", top:"10%", right:"5%",
            background:"rgba(212,175,55,0.12)", border:"1px solid rgba(212,175,55,0.3)",
            borderRadius:12, padding:"10px 14px",
            animation:"floatY 3s ease-in-out infinite",
            animationDelay:"1s",
            backdropFilter:"blur(10px)",
          }}>
            <div style={{ fontSize:9, color:"var(--muted)", letterSpacing:"0.1em" }}>CRED COINS</div>
            <div className="font-syne" style={{ fontSize:18, fontWeight:800, color:"var(--gold)" }}>+2,450</div>
          </div>

          {/* Score badge */}
          <div style={{
            position:"absolute", bottom:"12%", left:"2%",
            background:"rgba(10,10,10,0.9)", border:"1px solid rgba(200,255,0,0.2)",
            borderRadius:12, padding:"10px 14px",
            animation:"floatX 4s ease-in-out infinite",
            backdropFilter:"blur(10px)",
          }}>
            <div style={{ fontSize:9, color:"var(--muted)", letterSpacing:"0.1em" }}>CREDIT SCORE</div>
            <div className="font-syne" style={{ fontSize:18, fontWeight:800, color:"var(--accent)" }}>804 ↑</div>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:900px) {
          section > div { grid-template-columns: 1fr !important; }
          section > div > div:last-child { display: none !important; }
        }
      `}</style>
    </section>
  );
}

/* ── Ticker ── */
function Ticker() {
  const items = ["CREDIT CARD PAYMENTS","CRED COINS","CREDIT SCORE","UPI PAYMENTS","REWARDS","CASHBACK","INSURANCE","LOANS","TRAVEL","EXCLUSIVE OFFERS"];
  const text = items.join("  ·  ");
  return (
    <div style={{ borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", padding:"14px 0", overflow:"hidden", background:"var(--bg2)" }}>
      <div className="ticker-wrap">
        <span className="animate-ticker font-mono" style={{
          display:"inline-block", fontSize:11, letterSpacing:"0.15em",
          color:"var(--gold)", opacity:0.7,
        }}>
          {text + "  ·  " + text + "  ·  " + text}
        </span>
      </div>
    </div>
  );
}

/* ── About / Trust Section ── */
function AboutSection() {
  const ref = useReveal();
  return (
    <section ref={ref} className="section-reveal" style={{ padding:"120px 5%", position:"relative" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>
          {/* Left visual */}
          <div style={{ position:"relative" }}>
            {/* Large backdrop number */}
            <div className="font-syne" style={{
              position:"absolute", top:-20, left:-20, fontSize:200,
              fontWeight:800, color:"rgba(212,175,55,0.04)", lineHeight:1,
              userSelect:"none", zIndex:0,
            }}>01</div>

            <div style={{ position:"relative", zIndex:1 }}>
              {/* Trophy card */}
              <div className="glass-card" style={{
                borderRadius:20, padding:40,
                boxShadow:"0 40px 80px rgba(0,0,0,0.5)",
                border:"1px solid rgba(212,175,55,0.15)",
                marginBottom:20,
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
                  <div className="font-syne" style={{ fontWeight:700, fontSize:18 }}>Membership Tier</div>
                  <div style={{
                    padding:"4px 14px", borderRadius:40,
                    background:"rgba(212,175,55,0.12)", border:"1px solid rgba(212,175,55,0.3)",
                    fontSize:11, color:"var(--gold)", fontFamily:"'Space Mono',monospace", letterSpacing:"0.1em",
                  }}>BLACK</div>
                </div>
                {["Exclusive Rewards","Priority Support","Premium Lounge Access","Zero Hidden Charges"].map((f, i) => (
                  <div key={f} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                    <div style={{
                      width:22, height:22, borderRadius:6,
                      background:"rgba(212,175,55,0.12)", border:"1px solid rgba(212,175,55,0.3)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:12, color:"var(--gold)", flexShrink:0,
                    }}>✓</div>
                    <span style={{ fontSize:14, color:"var(--muted)" }}>{f}</span>
                  </div>
                ))}
              </div>

              {/* Mini cards row */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {[
                  { label:"Bills Paid", val:"₹2.4L", color:"var(--gold)" },
                  { label:"Coins Earned", val:"18,340", color:"var(--accent)" },
                ].map(({ label, val, color }) => (
                  <div key={label} className="glass-card" style={{
                    padding:20, borderRadius:14,
                    border:"1px solid rgba(255,255,255,0.06)",
                  }}>
                    <div style={{ fontSize:11, color:"var(--muted)", marginBottom:8, letterSpacing:"0.06em" }}>{label}</div>
                    <div className="font-syne" style={{ fontSize:22, fontWeight:800, color }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right text */}
          <div>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:8, marginBottom:20,
              background:"rgba(212,175,55,0.06)", border:"1px solid rgba(212,175,55,0.15)",
              padding:"6px 16px", borderRadius:40, fontSize:11,
              fontFamily:"'Space Mono',monospace", color:"var(--gold)", letterSpacing:"0.1em",
            }}>
              ◆ THE CRED PHILOSOPHY
            </div>

            <h2 className="font-syne" style={{
              fontSize:"clamp(36px,4.5vw,64px)", fontWeight:800,
              letterSpacing:"-0.03em", lineHeight:1.05, marginBottom:24,
            }}>
              NOT EVERYONE<br/>
              <span className="shimmer-text">GETS IN.</span>
            </h2>

            <p style={{ color:"var(--muted)", fontSize:16, lineHeight:1.8, marginBottom:20 }}>
              CRED isn't just an app. It's a declaration of financial responsibility. Only those with a credit score of 750+ qualify — a proof that you pay your dues, on time, every time.
            </p>
            <p style={{ color:"var(--muted)", fontSize:16, lineHeight:1.8, marginBottom:40 }}>
              In return, we reward you. Premium experiences, exclusive offers, and a community of India's most trustworthy individuals.
            </p>

            <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:40 }}>
              {[
                { icon:"🏆", text:"Only credit scores 750+ qualify — the top 20% of India" },
                { icon:"🔐", text:"Bank-grade 256-bit encryption on every transaction" },
                { icon:"⭐", text:"12 Million+ members trust CRED with their finances" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                  <span style={{ fontSize:20, flexShrink:0, marginTop:1 }}>{icon}</span>
                  <span style={{ color:"var(--muted)", fontSize:15, lineHeight:1.6 }}>{text}</span>
                </div>
              ))}
            </div>

            <button className="neopop-btn" style={{ padding:"14px 32px", fontSize:12, borderRadius:3 }}>
              Check Your Eligibility
            </button>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){ section > div > div { grid-template-columns:1fr !important; gap:40px !important; } }`}</style>
    </section>
  );
}

/* ── Features Section ── */
const FEATURES = [
  { icon:"💳", title:"Bill Payments", desc:"Pay all your credit card bills in one place. Get rewarded every time you pay on time.", tag:"PAYMENTS", color:"#d4af37" },
  { icon:"🪙", title:"CRED Coins", desc:"Earn coins on every payment. Redeem for exclusive products, travel, and experiences.", tag:"REWARDS", color:"#c8ff00" },
  { icon:"📊", title:"Credit Score", desc:"Track your credit score in real-time. Get personalized tips to improve it instantly.", tag:"INSIGHTS", color:"#60a5fa" },
  { icon:"⚡", title:"CRED Pay / UPI", desc:"The fastest UPI on any device. Pay anyone, anywhere, in under 3 seconds.", tag:"UPI", color:"#a78bfa" },
  { icon:"🎁", title:"Cashback", desc:"Up to 20% cashback on select brands. The more you pay, the more you earn.", tag:"CASHBACK", color:"#f97316" },
  { icon:"✈️", title:"Travel Perks", desc:"Airport lounge access, flight upgrades, and hotel deals — exclusively for CRED members.", tag:"TRAVEL", color:"#34d399" },
];

function FeaturesSection() {
  const ref = useReveal();
  return (
    <section ref={ref} className="section-reveal" style={{ padding:"120px 5%", background:"var(--bg2)", position:"relative" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:72 }}>
          <div style={{
            display:"inline-flex", gap:8, alignItems:"center",
            background:"rgba(212,175,55,0.06)", border:"1px solid rgba(212,175,55,0.15)",
            padding:"6px 16px", borderRadius:40, fontSize:11,
            fontFamily:"'Space Mono',monospace", color:"var(--gold)", letterSpacing:"0.1em",
            marginBottom:20,
          }}>◈ FEATURES</div>
          <h2 className="font-syne" style={{ fontSize:"clamp(36px,5vw,72px)", fontWeight:800, letterSpacing:"-0.04em", lineHeight:1 }}>
            EVERYTHING YOU<br/><span className="shimmer-text">DESERVE.</span>
          </h2>
        </div>

        {/* Cards grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:20 }}>
          {FEATURES.map(({ icon, title, desc, tag, color }, i) => (
            <FeatureCard key={title} icon={icon} title={title} desc={desc} tag={tag} color={color} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, tag, color, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="feature-card glass-card"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius:16, padding:32,
        border:"1px solid rgba(255,255,255,0.06)",
        cursor:"default", position:"relative", overflow:"hidden",
      }}
    >
      {/* Hover glow bg */}
      <div style={{
        position:"absolute", inset:0, borderRadius:16,
        background:`radial-gradient(circle at 30% 30%, ${color}08, transparent 60%)`,
        opacity: hov ? 1 : 0, transition:"opacity .3s",
      }}/>
      <div style={{ position:"relative", zIndex:1 }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
          <div style={{
            width:52, height:52, borderRadius:14,
            background:`rgba(${color === "#d4af37" ? "212,175,55" : color === "#c8ff00" ? "200,255,0" : color === "#60a5fa" ? "96,165,250" : color === "#a78bfa" ? "167,139,250" : color === "#f97316" ? "249,115,22" : "52,211,153"},0.12)`,
            border:`1px solid ${color}30`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:24,
          }}>{icon}</div>
          <span style={{
            fontSize:9, fontFamily:"'Space Mono',monospace", letterSpacing:"0.12em",
            color, padding:"4px 10px", borderRadius:40,
            background:`${color}15`, border:`1px solid ${color}30`,
          }}>{tag}</span>
        </div>
        <h3 className="font-syne" style={{ fontSize:21, fontWeight:700, marginBottom:12, letterSpacing:"-0.02em" }}>{title}</h3>
        <p style={{ color:"var(--muted)", fontSize:14, lineHeight:1.7 }}>{desc}</p>
        <div style={{
          marginTop:24, display:"flex", alignItems:"center", gap:8,
          color, fontSize:12, fontWeight:600, letterSpacing:"0.06em",
          opacity: hov ? 1 : 0.5, transition:"opacity .3s",
        }}>
          Learn more →
        </div>
      </div>
    </div>
  );
}

/* ── NeoPOP Section ── */
function NeopopSection() {
  const ref = useReveal();
  return (
    <section ref={ref} className="section-reveal" style={{ padding:"120px 5%", position:"relative", overflow:"hidden" }}>
      {/* bg decoration */}
      <div className="gradient-orb" style={{ width:600, height:600, background:"rgba(212,175,55,0.03)", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }}/>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:80 }}>
          <div style={{
            display:"inline-flex", gap:8, alignItems:"center",
            background:"rgba(212,175,55,0.06)", border:"1px solid rgba(212,175,55,0.15)",
            padding:"6px 16px", borderRadius:40, fontSize:11,
            fontFamily:"'Space Mono',monospace", color:"var(--gold)", letterSpacing:"0.1em", marginBottom:20,
          }}>◉ NEOPOP DESIGN</div>
          <h2 className="font-syne" style={{ fontSize:"clamp(36px,5vw,72px)", fontWeight:800, letterSpacing:"-0.04em" }}>
            DESIGNED FOR<br/><span className="shimmer-text">NEXT-GEN.</span>
          </h2>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:24, marginBottom:60 }}>
          {/* 3D Depth card */}
          <div className="glass-card" style={{
            borderRadius:20, padding:36,
            border:"1px solid rgba(212,175,55,0.2)",
            position:"relative", overflow:"hidden",
          }}>
            <div style={{ position:"absolute", top:-1, left:0, right:0, height:2, background:"linear-gradient(90deg, transparent, var(--gold), transparent)" }}/>
            <div className="font-syne" style={{ fontWeight:800, fontSize:36, marginBottom:8, letterSpacing:"-0.03em" }}>3D</div>
            <div style={{ color:"var(--muted)", fontSize:14, lineHeight:1.7, marginBottom:24 }}>Depth-based UI with physical shadows and layered z-space interactions.</div>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              {["Depth","Shadow","Layer"].map(t => (
                <span key={t} style={{
                  padding:"4px 12px", borderRadius:40, fontSize:11,
                  background:"rgba(212,175,55,0.08)", border:"1px solid rgba(212,175,55,0.2)",
                  color:"var(--gold)", fontFamily:"'Space Mono',monospace",
                }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Glassmorphism showcase */}
          <div style={{ position:"relative", borderRadius:20, overflow:"hidden", background:"linear-gradient(135deg, #1a1510, #0f0f0f)", border:"1px solid rgba(212,175,55,0.15)", padding:36 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{
                position:"absolute",
                width: i*80, height: i*80,
                borderRadius:"50%",
                background:`rgba(212,175,55,${0.12 - i*0.03})`,
                top:`${20*i}%`, left:`${60 - i*10}%`,
                filter:"blur(20px)",
              }}/>
            ))}
            <div style={{ position:"relative", zIndex:1 }}>
              <div className="font-syne" style={{ fontWeight:800, fontSize:22, marginBottom:8, letterSpacing:"-0.02em" }}>Glassmorphism</div>
              <div style={{ color:"var(--muted)", fontSize:13, lineHeight:1.7, marginBottom:20 }}>Frosted glass surfaces with layered blurs and subtle transparency.</div>
              {/* Glass demo element */}
              <div style={{
                background:"rgba(212,175,55,0.07)", backdropFilter:"blur(12px)",
                border:"1px solid rgba(212,175,55,0.2)",
                borderRadius:12, padding:"16px 20px",
                display:"flex", justifyContent:"space-between",
              }}>
                <span style={{ fontSize:13, color:"var(--white)" }}>Premium Balance</span>
                <span className="font-syne" style={{ fontWeight:700, color:"var(--gold)" }}>₹24,000</span>
              </div>
            </div>
          </div>

          {/* Interactive buttons */}
          <div className="glass-card" style={{ borderRadius:20, padding:36, border:"1px solid rgba(255,255,255,0.06)" }}>
            <div className="font-syne" style={{ fontWeight:800, fontSize:22, marginBottom:8 }}>NeoPOP Buttons</div>
            <div style={{ color:"var(--muted)", fontSize:13, lineHeight:1.7, marginBottom:24 }}>Physical depth with tactile press feedback and bold shadows.</div>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <button className="neopop-btn" style={{ width:"100%", padding:"14px", fontSize:11, borderRadius:2, letterSpacing:"0.12em" }}>
                PAY NOW
              </button>
              <button className="neopop-btn-dark" style={{ width:"100%", padding:"14px", fontSize:11, borderRadius:2, letterSpacing:"0.12em" }}>
                VIEW REWARDS
              </button>
            </div>
          </div>
        </div>

        {/* Wide card - animated waveform */}
        <div className="glass-card" style={{
          borderRadius:20, padding:40,
          border:"1px solid rgba(212,175,55,0.12)",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          flexWrap:"wrap", gap:32,
          background:"linear-gradient(135deg, rgba(212,175,55,0.03) 0%, transparent 100%)",
        }}>
          <div>
            <div className="font-syne" style={{ fontSize:28, fontWeight:800, marginBottom:8, letterSpacing:"-0.03em" }}>Seamless Experience</div>
            <p style={{ color:"var(--muted)", fontSize:14, maxWidth:480, lineHeight:1.7 }}>
              From payment to reward — everything in one fluid, uninterrupted flow. No friction, no clutter. Just a premium financial operating system.
            </p>
          </div>
          {/* Waveform visual */}
          <div style={{ display:"flex", alignItems:"center", gap:3, height:48 }}>
            {Array.from({length:32}).map((_, i) => (
              <div key={i} className="waveform-bar" style={{
                height: `${Math.sin(i / 3) * 50 + 50}%`,
                animationDelay:`${i * 0.05}s`,
                animationDuration:`${0.8 + (i % 3) * 0.3}s`,
                opacity: 0.4 + (i % 5) * 0.12,
              }}/>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Stats / Counters ── */
function StatsSection() {
  const ref = useReveal();
  const c1 = useCounter(12, 2200, "M+");
  const c2 = useCounter(98, 1800, "%");
  const c3 = useCounter(20000, 2500, "Cr+");
  const c4 = useCounter(4.9, 1500, "★");
  const stats = [
    { ...c1, label:"Members Worldwide", sub:"India's most trusted club" },
    { ...c2, label:"On-Time Payments", sub:"By verified CRED members" },
    { ...c3, label:"Paid via CRED", sub:"Every month, growing fast" },
    { ...c4, label:"App Store Rating", sub:"4.9 on iOS & Play Store" },
  ];
  return (
    <section ref={ref} className="section-reveal" style={{
      padding:"80px 5%",
      background:"linear-gradient(180deg, var(--bg2) 0%, var(--bg) 100%)",
      borderTop:"1px solid var(--border)",
      borderBottom:"1px solid var(--border)",
    }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:2 }}>
          {stats.map(({ ref: sRef, display, label, sub }, i) => (
            <div key={label} ref={sRef} style={{
              padding:"36px 28px", textAlign:"center",
              borderRight: i < 3 ? "1px solid var(--border)" : "none",
            }}>
              <div className="counter-num shimmer-text" style={{ fontSize:"clamp(36px,4vw,56px)" }}>
                {display}
              </div>
              <div className="font-syne" style={{ fontWeight:600, fontSize:14, marginTop:8, marginBottom:4 }}>{label}</div>
              <div style={{ fontSize:12, color:"var(--muted)" }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:700px){ section > div > div { grid-template-columns:1fr 1fr !important; } section > div > div > div { border-right: none !important; border-bottom: 1px solid var(--border); } }`}</style>
    </section>
  );
}

/* ── Testimonials ── */
const TESTIMONIALS = [
  { name:"Priya Menon", role:"Marketing Director", score:812, coins:"24,500", text:"CRED changed the way I manage credit. Paying bills is now something I look forward to — the rewards are genuinely amazing.", avatar:"PM" },
  { name:"Arjun Kapoor", role:"Software Engineer", score:791, coins:"31,200", text:"The credit score tracking feature alone is worth it. I improved my score by 40 points in 6 months following CRED's advice.", avatar:"AK" },
  { name:"Neha Singh", role:"Entrepreneur", score:823, coins:"18,800", text:"CRED Coins got me a free flight upgrade to Business class. A premium product for people who care about their finances.", avatar:"NS" },
  { name:"Vikram Rao", role:"Chartered Accountant", score:798, coins:"42,100", text:"The security and transparency of CRED is unmatched. I trust it with all my credit cards, no questions asked.", avatar:"VR" },
];

function TestimonialsSection() {
  const ref = useReveal();
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[active];
  return (
    <section ref={ref} className="section-reveal" style={{ padding:"120px 5%", background:"var(--bg2)" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:72 }}>
          <div style={{
            display:"inline-flex", gap:8, alignItems:"center",
            background:"rgba(212,175,55,0.06)", border:"1px solid rgba(212,175,55,0.15)",
            padding:"6px 16px", borderRadius:40, fontSize:11,
            fontFamily:"'Space Mono',monospace", color:"var(--gold)", letterSpacing:"0.1em", marginBottom:20,
          }}>★ MEMBER STORIES</div>
          <h2 className="font-syne" style={{ fontSize:"clamp(36px,5vw,64px)", fontWeight:800, letterSpacing:"-0.04em" }}>
            TRUSTED BY<br/><span className="shimmer-text">MILLIONS.</span>
          </h2>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
          {/* Testimonial display */}
          <div>
            <div style={{ fontSize:72, color:"var(--gold)", opacity:0.2, fontFamily:"Georgia,serif", lineHeight:0.8, marginBottom:16 }}>"</div>
            <blockquote style={{
              fontSize:"clamp(16px,2vw,22px)", fontWeight:400,
              lineHeight:1.65, color:"var(--white)", marginBottom:36,
              transition:"all .4s",
            }}>
              {t.text}
            </blockquote>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <div style={{
                width:52, height:52, borderRadius:"50%",
                background:"linear-gradient(135deg, var(--gold3), var(--gold))",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:"#000",
                flexShrink:0,
              }}>{t.avatar}</div>
              <div>
                <div className="font-syne" style={{ fontWeight:700, fontSize:16 }}>{t.name}</div>
                <div style={{ fontSize:12, color:"var(--muted)" }}>{t.role}</div>
              </div>
            </div>
            {/* Dots */}
            <div style={{ display:"flex", gap:8, marginTop:28 }}>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} style={{
                  width: i === active ? 28 : 8,
                  height:8, borderRadius:4,
                  background: i === active ? "var(--gold)" : "var(--border)",
                  border:"none", cursor:"pointer",
                  transition:"all .4s",
                }}/>
              ))}
            </div>
          </div>

          {/* Member card */}
          <div>
            <div style={{
              background:"linear-gradient(135deg, #1a1510, #0f0f0f)",
              border:"1px solid rgba(212,175,55,0.2)",
              borderRadius:20, padding:32,
              boxShadow:"0 32px 64px rgba(0,0,0,0.5)",
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:28 }}>
                <div className="font-syne" style={{ fontWeight:800, fontSize:16, letterSpacing:"0.05em", color:"var(--gold)" }}>MEMBER PROFILE</div>
                <div style={{
                  fontSize:10, fontFamily:"'Space Mono',monospace", color:"var(--gold)",
                  padding:"3px 10px", borderRadius:40,
                  background:"rgba(212,175,55,0.1)", border:"1px solid rgba(212,175,55,0.25)",
                  letterSpacing:"0.12em",
                }}>VERIFIED ✓</div>
              </div>
              {/* Score gauge */}
              <div style={{ marginBottom:28 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <span style={{ fontSize:12, color:"var(--muted)" }}>Credit Score</span>
                  <span className="font-syne" style={{ fontWeight:700, fontSize:14, color:"var(--accent)" }}>{t.score}</span>
                </div>
                <div style={{ height:6, background:"var(--border)", borderRadius:4, overflow:"hidden" }}>
                  <div style={{
                    height:"100%", borderRadius:4,
                    width:`${((t.score - 300) / 550) * 100}%`,
                    background:"linear-gradient(90deg, var(--gold3), var(--gold))",
                    transition:"width .8s cubic-bezier(.16,1,.3,1)",
                  }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:4, fontSize:10, color:"var(--muted)" }}>
                  <span>300</span><span>EXCELLENT</span><span>900</span>
                </div>
              </div>

              {/* Coins */}
              <div style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"16px 20px", borderRadius:12,
                background:"rgba(212,175,55,0.06)", border:"1px solid rgba(212,175,55,0.12)",
                marginBottom:20,
              }}>
                <div>
                  <div style={{ fontSize:10, color:"var(--muted)", marginBottom:4, letterSpacing:"0.08em" }}>CRED COINS EARNED</div>
                  <div className="font-syne" style={{ fontWeight:800, fontSize:24, color:"var(--gold)" }}>{t.coins}</div>
                </div>
                <div style={{ fontSize:40, opacity:0.6 }}>🪙</div>
              </div>

              <div className="font-syne" style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>{t.name}</div>
              <div style={{ fontSize:12, color:"var(--muted)" }}>{t.role} · CRED Black Member</div>
            </div>
          </div>
        </div>

        {/* App store ratings */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:20, marginTop:72 }}>
          {[
            { store:"App Store", rating:"4.9", reviews:"4.2L+ Ratings", icon:"🍎", bg:"rgba(255,255,255,0.04)" },
            { store:"Play Store", rating:"4.7", reviews:"8.6L+ Reviews", icon:"▶", bg:"rgba(200,255,0,0.03)" },
            { store:"Best Fintech App", rating:"#1", reviews:"ET Startup Awards 2023", icon:"🏆", bg:"rgba(212,175,55,0.04)" },
          ].map(({ store, rating, reviews, icon, bg }) => (
            <div key={store} className="glass-card" style={{
              borderRadius:16, padding:28,
              border:"1px solid rgba(255,255,255,0.06)",
              display:"flex", alignItems:"center", gap:20,
              background:bg,
            }}>
              <div style={{
                width:50, height:50, borderRadius:14, fontSize:22,
                background:"rgba(212,175,55,0.08)", border:"1px solid rgba(212,175,55,0.15)",
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
              }}>{icon}</div>
              <div>
                <div style={{ fontSize:11, color:"var(--muted)", letterSpacing:"0.08em", marginBottom:4 }}>{store}</div>
                <div className="font-syne" style={{ fontWeight:800, fontSize:28, color:"var(--gold)", letterSpacing:"-0.02em" }}>{rating}</div>
                <div style={{ fontSize:11, color:"var(--muted)" }}>{reviews}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:900px){ section > div > div:nth-child(2) { grid-template-columns:1fr !important; gap:40px !important; } }`}</style>
    </section>
  );
}

/* ── Security Section ── */
function SecuritySection() {
  const ref = useReveal();
  const secItems = [
    { icon:"🔐", title:"256-bit SSL Encryption", desc:"Your data is encrypted using the same standard as global banks — impossible to intercept.", color:"#60a5fa" },
    { icon:"🛡️", title:"2-Factor Authentication", desc:"Every login, every payment is verified with a second layer of identity confirmation.", color:"#34d399" },
    { icon:"👁️", title:"Real-time Fraud Detection", desc:"Our ML system monitors 100+ signals simultaneously to detect and block suspicious activity.", color:"#f59e0b" },
    { icon:"🔑", title:"Zero Data Selling", desc:"We never sell, rent, or share your personal financial data. Ever. It's that simple.", color:"#a78bfa" },
    { icon:"🏦", title:"RBI Registered", desc:"CRED is a registered entity with the Reserve Bank of India. Fully compliant and audited.", color:"#ef4444" },
    { icon:"✅", title:"ISO 27001 Certified", desc:"Internationally certified for information security management — the highest global standard.", color:"#d4af37" },
  ];
  return (
    <section ref={ref} className="section-reveal" style={{ padding:"120px 5%", position:"relative", overflow:"hidden" }}>
      <div className="gradient-orb" style={{ width:700, height:700, background:"rgba(96,165,250,0.025)", top:"-20%", right:"-15%" }}/>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.2fr", gap:80, alignItems:"center" }}>
          {/* Left */}
          <div>
            <div style={{
              display:"inline-flex", gap:8, alignItems:"center",
              background:"rgba(96,165,250,0.08)", border:"1px solid rgba(96,165,250,0.2)",
              padding:"6px 16px", borderRadius:40, fontSize:11,
              fontFamily:"'Space Mono',monospace", color:"#60a5fa", letterSpacing:"0.1em", marginBottom:20,
            }}>🔒 BANK-GRADE SECURITY</div>

            <h2 className="font-syne" style={{ fontSize:"clamp(36px,4.5vw,64px)", fontWeight:800, letterSpacing:"-0.04em", lineHeight:1.05, marginBottom:24 }}>
              YOUR MONEY.<br/>YOUR DATA.<br/>
              <span style={{
                background:"linear-gradient(90deg, #60a5fa, #93c5fd, #60a5fa)",
                backgroundSize:"200% auto", animation:"shimmer 3s linear infinite",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              }}>ALWAYS SAFE.</span>
            </h2>

            <p style={{ color:"var(--muted)", fontSize:15, lineHeight:1.8, marginBottom:36 }}>
              Trust is the foundation of everything we build. CRED employs military-grade security protocols, regular third-party audits, and zero tolerance for compromise.
            </p>

            {/* Trust score bar */}
            <div style={{
              background:"rgba(96,165,250,0.06)", border:"1px solid rgba(96,165,250,0.15)",
              borderRadius:16, padding:24, marginBottom:36,
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                <span className="font-syne" style={{ fontWeight:700, fontSize:14 }}>Security Score</span>
                <span className="font-syne" style={{ fontWeight:800, color:"#60a5fa" }}>99.8 / 100</span>
              </div>
              <div style={{ height:8, background:"var(--border)", borderRadius:4, overflow:"hidden" }}>
                <div style={{
                  height:"100%", width:"99.8%", borderRadius:4,
                  background:"linear-gradient(90deg, #60a5fa, #93c5fd)",
                  boxShadow:"0 0 12px rgba(96,165,250,0.4)",
                }}/>
              </div>
              <div style={{ fontSize:11, color:"var(--muted)", marginTop:8 }}>Last audit: 3 days ago · Next: Dec 2025</div>
            </div>

            <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
              {["RBI Licensed","ISO 27001","PCI DSS","GDPR Ready"].map(badge => (
                <div key={badge} style={{
                  padding:"6px 16px", borderRadius:40,
                  background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)",
                  fontSize:11, fontFamily:"'Space Mono',monospace",
                  color:"var(--muted)", letterSpacing:"0.08em",
                }}>{badge}</div>
              ))}
            </div>
          </div>

          {/* Right grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {secItems.map(({ icon, title, desc, color }) => (
              <div key={title} className="feature-card glass-card" style={{
                borderRadius:14, padding:22,
                border:"1px solid rgba(255,255,255,0.05)",
              }}>
                <div style={{
                  width:40, height:40, borderRadius:10, fontSize:18,
                  background:`rgba(255,255,255,0.05)`, border:`1px solid ${color}25`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  marginBottom:14,
                }}>{icon}</div>
                <div className="font-syne" style={{ fontWeight:700, fontSize:13, marginBottom:8, lineHeight:1.3 }}>{title}</div>
                <div style={{ fontSize:11, color:"var(--muted)", lineHeight:1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){ section > div > div { grid-template-columns:1fr !important; gap:48px !important; } }`}</style>
    </section>
  );
}

/* ── App CTA ── */
function AppCTA() {
  const ref = useReveal();
  return (
    <section ref={ref} className="section-reveal" style={{
      padding:"100px 5%",
      background:"linear-gradient(135deg, #0f0d08 0%, #0a0a0a 50%, #080810 100%)",
      borderTop:"1px solid var(--border)",
    }}>
      <div style={{
        maxWidth:900, margin:"0 auto", textAlign:"center",
        padding:"80px 40px",
        background:"linear-gradient(135deg, rgba(212,175,55,0.04) 0%, rgba(212,175,55,0.02) 100%)",
        border:"1px solid rgba(212,175,55,0.15)",
        borderRadius:28,
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", height:1, width:"60%", background:"linear-gradient(90deg, transparent, var(--gold), transparent)" }}/>
        <div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", height:1, width:"60%", background:"linear-gradient(90deg, transparent, var(--gold3), transparent)" }}/>

        <div style={{ fontSize:40, marginBottom:16 }}>✦</div>
        <h2 className="font-syne" style={{ fontSize:"clamp(32px,5vw,60px)", fontWeight:800, letterSpacing:"-0.04em", marginBottom:16, lineHeight:1 }}>
          READY TO JOIN<br/>
          <span className="shimmer-text">THE CLUB?</span>
        </h2>
        <p style={{ color:"var(--muted)", fontSize:16, lineHeight:1.7, maxWidth:480, margin:"0 auto 40px" }}>
          Download CRED and start your journey towards financial rewards, exclusive privileges, and smarter credit management.
        </p>
        <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
          {[
            { label:"Download on App Store", sub:"iOS — 4.9 ★", icon:"🍎" },
            { label:"Get it on Play Store", sub:"Android — 4.7 ★", icon:"▶" },
          ].map(({ label, sub, icon }) => (
            <button key={label} className="neopop-btn-dark" style={{
              padding:"16px 28px", borderRadius:8, display:"flex", alignItems:"center", gap:12,
            }}>
              <span style={{ fontSize:20 }}>{icon}</span>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontSize:9, opacity:0.7, letterSpacing:"0.12em", marginBottom:2 }}>AVAILABLE ON</div>
                <div style={{ fontSize:12, fontWeight:700 }}>{label.replace("Download on ", "").replace("Get it on ", "")}</div>
                <div style={{ fontSize:9, color:"var(--gold)", opacity:0.8 }}>{sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  const cols = [
    { title:"Company", links:["About CRED","Careers","Press Kit","Blog","Contact Us"] },
    { title:"Products", links:["CRED Pay","CRED Coins","Credit Score","CRED Protect","CRED Travel"] },
    { title:"Legal", links:["Privacy Policy","Terms of Use","Cookie Policy","Grievance","Disclosures"] },
    { title:"Support", links:["Help Center","FAQs","Community","Status Page","Security"] },
  ];
  return (
    <footer style={{
      background:"var(--bg)", borderTop:"1px solid var(--border)",
      padding:"80px 5% 40px",
    }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr", gap:48, marginBottom:64 }}>
          {/* Brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
              <div style={{
                width:36, height:36, background:"var(--gold)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14,
                color:"#000", boxShadow:"3px 3px 0 var(--gold3)", letterSpacing:"-1px",
              }}>CR</div>
              <span className="font-syne" style={{ fontWeight:800, fontSize:20, letterSpacing:"-0.02em" }}>CRED</span>
            </div>
            <p style={{ color:"var(--muted)", fontSize:13, lineHeight:1.8, marginBottom:24, maxWidth:240 }}>
              India's most trusted credit card payment platform. Rewarding responsible Indians since 2018.
            </p>
            {/* Social icons */}
            <div style={{ display:"flex", gap:12 }}>
              {["𝕏","in","f","▶","📸"].map((icon, i) => (
                <button key={i} style={{
                  width:36, height:36, borderRadius:8,
                  background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)",
                  color:"var(--muted)", cursor:"pointer", fontSize:14,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all .2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(212,175,55,0.4)"; e.currentTarget.style.color="var(--gold)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--muted)"; }}
                >{icon}</button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map(({ title, links }) => (
            <div key={title}>
              <div className="font-syne" style={{ fontWeight:700, fontSize:12, letterSpacing:"0.12em", color:"var(--gold)", marginBottom:20 }}>{title.toUpperCase()}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {links.map(l => (
                  <span key={l} style={{
                    fontSize:13, color:"var(--muted)", cursor:"pointer",
                    transition:"color .2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.color="var(--white)"}
                    onMouseLeave={e => e.currentTarget.style.color="var(--muted)"}
                  >{l}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop:"1px solid var(--border)",
          paddingTop:28, display:"flex", justifyContent:"space-between",
          alignItems:"center", flexWrap:"wrap", gap:16,
        }}>
          <div style={{ fontSize:12, color:"var(--muted)" }}>
            © 2025 Dreamplug Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
            {["Privacy","Terms","Cookies","Sitemap"].map(l => (
              <span key={l} style={{ fontSize:12, color:"var(--muted)", cursor:"pointer" }}>{l}</span>
            ))}
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 8px #22c55e" }}/>
            <span style={{ fontSize:11, color:"var(--muted)", fontFamily:"'Space Mono',monospace" }}>All Systems Operational</span>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){
          footer > div > div:first-child { grid-template-columns: 1fr 1fr !important; }
        }
        @media(max-width:560px){
          footer > div > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
export default function App() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <>
      <div className="noise-overlay"/>
      <Navbar/>
      <main>
        <Hero/>
        <Ticker/>
        <AboutSection/>
        <FeaturesSection/>
        <StatsSection/>
        <NeopopSection/>
        <TestimonialsSection/>
        <SecuritySection/>
        <AppCTA/>
      </main>
      <Footer/>
    </>
  );
}
