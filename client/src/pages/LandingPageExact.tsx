import React from 'react';
import { Link } from 'react-router-dom';

const LandingPageExact: React.FC = () => {
  React.useEffect(() => {
    // Premium header animation controller
    const root = document.documentElement;
    const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

    // Scroll-driven shift (affects sheen angle and underline)
    const onScroll = () => {
      const t = clamp(window.scrollY / 300, 0, 1); // 0..1 as you scroll 0-300px
      root.style.setProperty("--hdrShift", `${t * 40}%`);
      if (t > 0.1) document.body.classList.add("scrolled");
      else document.body.classList.remove("scrolled");
    };

    // Parallax-like radial center that follows pointer over header
    const header = document.querySelector(".site-header");
    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      if (header) {
        const r = header.getBoundingClientRect();
        const x = ((mouseEvent.clientX - r.left) / r.width) * 100;
        const y = ((mouseEvent.clientY - r.top) / r.height) * 100;
        root.style.setProperty("--radX", `${x}%`);
        root.style.setProperty("--radY", `${y}%`);
      }
    };

    if (header) {
      header.addEventListener("mousemove", handleMouseMove);
    }
    document.addEventListener("scroll", onScroll);
    onScroll();

    return () => {
      if (header) {
        header.removeEventListener("mousemove", handleMouseMove);
      }
      document.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div>
      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            --maroon: #7a0a2d;
            --ink: #0e2336;
            --text: #1b2430;
            --muted: #f4f6f8;
            --line: #e9eef2;
            --container: 1200px;
            --radius: 12px;
            --footer: #0f1216;
            --header-height: 132px;
            --hero-image-left: url("https://www.wcu.edu.et/HomeBannerslidesImages/gate3.jpg");
            --ui: "Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
            --display: "DM Serif Display", Georgia, "Times New Roman", serif;
            --hdrShift: 0%;
            --radX: 10%;
            --radY: 0%;
          }
          * {
            box-sizing: border-box;
          }
          html,
          body {
            margin: 0;
          }
          body {
            font-family: var(--ui);
            color: var(--text);
            background: #fff;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
            padding-top: var(--header-height);
          }
          img {
            max-width: 100%;
            display: block;
          }
          a {
            color: inherit;
            text-decoration: none;
          }
          .container {
            max-width: var(--container);
            margin: 0 auto;
            padding: 0 24px;
          }

          .btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 12px 24px;
            border-radius: 25px;
            border: 2px solid transparent;
            font-weight: 600;
            font-size: 14px;
            transition: 0.2s;
            text-decoration: none;
          }
          .btn.primary {
            background: var(--maroon);
            color: #fff;
          }
          .btn.primary:hover {
            filter: brightness(0.95);
          }
          .btn.white {
            background: #fff;
            color: var(--maroon);
            border-color: #fff;
          }
          .btn.ghost {
            background: transparent;
            border-color: currentColor;
          }
          .icon-btn {
            width: 44px;
            height: 44px;
            display: grid;
            place-items: center;
            border-radius: 999px;
            border: 1px solid var(--line);
            background: #fff;
            color: var(--ink);
          }

          .site-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 10000;
            transition: background 0.35s ease, box-shadow 0.35s ease, color 0.35s ease;
          }
          body:not(.scrolled) .site-header {
            color: #fff;
            background:
            /* subtle conic sheen that slides */ conic-gradient(
                from 200deg at calc(60% + var(--hdrShift)) 50%,
                rgba(255, 255, 255, 0.16),
                rgba(255, 255, 255, 0) 30%
              ),
              /* moving linear blend of maroon hues */
                linear-gradient(
                  90deg,
                  rgba(122, 10, 45, 0.92),
                  rgba(196, 46, 83, 0.66) 50%,
                  rgba(18, 104, 175, 0.42)
                ),
              /* radial depth that tracks mouse */
                radial-gradient(
                  140% 180% at var(--radX) var(--radY),
                  rgba(255, 255, 255, 0.08),
                  rgba(255, 255, 255, 0) 60%
                );
            background-blend-mode: screen, multiply, normal;
            background-size: 140% 140%, 200% 200%, cover;
            animation: hdrFlow 16s ease-in-out infinite;
            box-shadow: 0 8px 28px rgba(122, 10, 45, 0.25);
          }
          @keyframes hdrFlow {
            0% {
              background-position: 0% 30%, 0% 50%, center;
            }
            50% {
              background-position: 100% 70%, 100% 50%, center;
            }
            100% {
              background-position: 0% 30%, 0% 50%, center;
            }
          }
          .site-header::after {
            content: "";
            position: absolute;
            left: -20vw;
            right: -20vw;
            bottom: 0;
            height: 2px;
            pointer-events: none;
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0),
              rgba(255, 255, 255, 0.8),
              rgba(255, 255, 255, 0)
            );
            transform: translateX(calc(var(--hdrShift) * -1));
            filter: blur(0.4px);
          }

          body.scrolled .site-header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: saturate(180%) blur(12px);
            -webkit-backdrop-filter: saturate(180%) blur(12px);
            color: var(--ink);
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
          }

          .topbar {
            position: relative;
            display: flex;
            align-items: center;
            gap: 24px;
            justify-content: space-between;
            height: var(--header-height);
            transition: height 0.35s ease;
          }
          .mast-left {
            display: flex;
            align-items: center;
            gap: 18px;
          }
          .brand {
            display: flex;
            align-items: center;
            gap: 16px;
          }
          .brand img {
            height: 108px;
            width: auto;
            transition: height 0.35s ease;
          }
          .brand .name {
            font-weight: 900;
            letter-spacing: 0.3px;
            font-size: 24px;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
            transition: color 0.35s ease, text-shadow 0.35s ease;
          }
          
          body:not(.scrolled) .brand .name {
            color: #fff;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          }
          
          body.scrolled .brand .name {
            color: #000;
            text-shadow: none;
          }

          .home-btn {
            width: 44px;
            height: 44px;
            display: grid;
            place-items: center;
            border-radius: 999px;
            border: 1px solid var(--line);
            background: #fff;
            color: var(--ink);
            transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
          }
          body:not(.scrolled) .home-btn,
          body:not(.scrolled) .icon-btn {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(255, 255, 255, 0.35);
            color: #fff;
          }
          
          body:not(.scrolled) .home-btn:hover,
          body:not(.scrolled) .icon-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            color: #fff;
          }
          
          body.scrolled .icon-btn {
            background: #fff;
            border-color: var(--line);
            color: var(--ink);
          }
          
          body.scrolled .icon-btn:hover {
            background: var(--muted);
            color: var(--ink);
          }

          .primary-nav {
            display: flex;
            align-items: center;
            gap: 26px;
          }
          .primary-nav > a,
          .primary-nav .dd {
            background: none;
            border: 0;
            font-weight: 600;
            padding: 12px 0;
            cursor: pointer;
            color: inherit;
          }
          .primary-nav .dd:after {
            content: " ▾";
            margin-left: 6px;
          }

          .has-dd {
            position: relative;
          }
          .dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            transform: translateY(16px);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.18s ease, transform 0.18s ease;
            z-index: 10001;
          }
          .has-dd:hover .dropdown,
          .has-dd:focus-within .dropdown {
            opacity: 1;
            pointer-events: auto;
            transform: translateY(10px);
          }
          .menu {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
            border: 1px solid var(--line);
            padding: 12px;
            min-width: 240px;
          }
          .menu a {
            display: block;
            padding: 10px 12px;
            border-radius: 8px;
            color: var(--ink);
          }
          .menu a:hover {
            background: var(--muted);
          }

          .mega-parent {
            position: static;
          }
          .mega-parent .dropdown {
            left: 50%;
            transform: translate(-50%, 16px);
          }
          .mega {
            background: #fff;
            border-radius: 14px;
            box-shadow: 0 20px 48px rgba(0, 0, 0, 0.18);
            border: 1px solid var(--line);
            padding: 18px;
            width: clamp(760px, 70vw, 1080px);
          }
          .mega-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
          }
          .mega h5 {
            margin: 4px 0 10px;
            font-size: 14px;
            color: var(--maroon);
          }
          .mega a {
            display: block;
            padding: 8px 0;
            color: var(--ink);
          }
          .mega .col {
            padding: 0 14px;
            border-right: 1px solid var(--line);
          }
          .mega .col:last-child {
            border-right: 0;
          }

          body.scrolled .topbar {
            height: 112px;
          }
          body.scrolled .brand img {
            height: 90px;
          }

          .hero-split {
            position: relative;
            background: #fff;
          }
          .hero-grid {
            display: grid;
            grid-template-columns: minmax(500px, 52vw) 1fr;
            align-items: stretch;
            min-height: 70vh;
          }
          .hero-photo {
            background: var(--hero-image-left) center/cover no-repeat;
            border-top-right-radius: 300px;
            border-bottom-right-radius: 300px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
            min-height: 70vh;
          }
          .hero-content {
            display: flex;
            align-items: center;
            padding: 40px 40px 0 60px;
          }
          .hero-inner {
            padding: 0;
            max-width: 600px;
          }
          .eyebrow {
            letter-spacing: 0.24em;
            text-transform: uppercase;
            font-weight: 700;
            color: #7a0a2d;
          }
          .hero h1 {
            font-family: var(--display);
            font-size: clamp(40px, 6vw, 72px);
            line-height: 1.06;
            margin: 12px 0 14px;
            color: var(--ink);
          }
          .hero p {
            max-width: 700px;
            margin: 10px 0 28px;
            font-size: 18px;
            color: #334155;
            line-height: 1.6;
          }
          .cta-row {
            display: flex;
            gap: 16px;
            flex-wrap: nowrap;
            align-items: center;
          }

          .meta {
            font-size: 12px;
            color: #64748b;
            margin-bottom: 8px;
            font-weight: 600;
          }

          section {
            scroll-margin-top: calc(var(--header-height) + 8px);
          }
          .section {
            padding: 80px 0;
          }
          .section h2 {
            font-family: var(--display);
            font-size: clamp(24px, 3.6vw, 36px);
            margin: 0 0 20px;
            color: var(--ink);
          }

          .about {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 32px;
          }
          .chips {
            list-style: none;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            padding: 0;
            margin: 0;
          }
          .chips li {
            background: var(--muted);
            padding: 10px 12px;
            border-radius: 999px;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
          }
          .stat-card {
            background: #fff;
            border: 1px solid var(--line);
            border-radius: 14px;
            padding: 24px;
            text-align: center;
            box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
          }
          .stat-card .big {
            font-size: 46px;
            font-weight: 800;
            color: var(--maroon);
            line-height: 1;
          }
          .stat-card .lbl {
            color: #64748b;
            margin-top: 6px;
            display: block;
          }

          .cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 22px;
          }
          .card {
            background: #fff;
            border: 1px solid var(--line);
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
            transition: 0.2s;
          }
          .card:hover {
            transform: translateY(-3px);
            box-shadow: 0 16px 36px rgba(0, 0, 0, 0.12);
          }
          .card-media {
            height: 160px;
            background: linear-gradient(135deg, #f7dfe6, #ffffff);
            display: block;
          }
          .card-body {
            padding: 18px 20px;
          }

          .split {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
          .panel {
            background: linear-gradient(180deg, #fff, #fbfbfc);
            border: 1px solid var(--line);
            border-radius: 14px;
            padding: 24px;
          }

          .site-footer {
            background: #0f1216;
            color: #d5dfea;
          }
          .footer-top {
            padding: 120px 0;
            border-top: 1px solid #0b0d10;
            border-bottom: 1px solid #161b22;
          }
          .footer-grid {
            display: grid;
            grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
            gap: 40px;
          }
          .footer-brand {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 16px;
          }
          .footer-logo-bg {
            flex-shrink: 0;
          }
          .footer-brand .name {
            font-weight: 800;
            color: #fff;
            font-size: 18px;
          }
          .footer-desc {
            color: #93a4b5;
            margin-top: 14px;
            max-width: 460px;
          }
          .socials {
            display: flex;
            gap: 12px;
            margin-top: 20px;
          }
          .socials a {
            width: 44px;
            height: 44px;
            border-radius: 999px;
            border: 1px solid #2a3340;
            display: grid;
            place-items: center;
            color: #d5dfea;
          }
          .footer h4 {
            margin: 0 0 18px;
            color: #fff;
          }
          .footer ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .footer li {
            margin: 10px 0;
          }
          .footer a {
            color: #d5dfea;
          }
          .footer a:hover {
            color: #fff;
          }
          .quick .btn {
            width: 100%;
            justify-content: center;
            margin-bottom: 12px;
            border-radius: 999px;
          }

          .footer-bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 30px 0;
            color: #93a4b5;
            font-size: 14px;
          }

          @media (max-width: 1200px) {
            .hero-grid {
              grid-template-columns: minmax(460px, 50vw) 1fr;
            }
            .hero-content {
              padding: 30px 30px 0 50px;
            }
          }
          @media (max-width: 1100px) {
            .stats-grid {
              grid-template-columns: repeat(2, 1fr);
            }
            .cards {
              grid-template-columns: 1fr 1fr;
            }
            .split {
              grid-template-columns: 1fr;
            }
          }
          @media (max-width: 900px) {
            .primary-nav {
              display: none;
            }
            .brand img {
              height: 96px;
            }
            .home-btn {
              display: none;
            }
          }
          @media (max-width: 760px) {
            :root {
              --header-height: 116px;
            }
            .hero-grid {
              grid-template-columns: 1fr;
              min-height: auto;
            }
            .hero-photo {
              height: 40vh;
              min-height: 280px;
              border-top-right-radius: 0;
              border-bottom-right-radius: 40px;
            }
            .hero-content {
              padding: 40px 20px;
            }
            .hero-inner {
              padding: 0;
            }
            .cta-row {
              flex-wrap: wrap;
              gap: 12px;
            }
            .cards {
              grid-template-columns: 1fr;
            }
            .stats-grid {
              grid-template-columns: 1fr;
            }
            .footer-grid {
              grid-template-columns: 1fr;
            }
          }
        `
      }} />

      <header className="site-header" role="banner">
        <div className="topbar container">
          <div className="mast-left">
            <a className="brand" href="#top" aria-label="Wachemo University">
              <img src="/logo2.png" alt="Wachemo University Logo" />
              <span className="name">Wachemo University</span>
            </a>
            <a className="home-btn" href="#top" aria-label="Home">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 11l9-7 9 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 21V11h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <nav className="primary-nav" aria-label="Primary">
              <div className="has-dd">
                <button className="dd" aria-haspopup="true" aria-expanded="false">About</button>
                <div className="dropdown menu" role="menu">
                  <a href="#about" role="menuitem">University Profile</a>
                  <a href="#about" role="menuitem">Colleges & Schools</a>
                  <a href="#" role="menuitem">Leadership</a>
                </div>
              </div>
              <div className="has-dd mega-parent">
                <button className="dd" aria-haspopup="true" aria-expanded="false">Admission</button>
                <div className="dropdown" role="menu" aria-label="Admission Mega Menu">
                  <div className="mega">
                    <div className="mega-grid">
                      <div className="col">
                        <h5>Apply</h5>
                        <Link to="/login">Apply / Sign In</Link>
                        <a href="#programs">Undergraduate</a>
                        <a href="#programs">Postgraduate</a>
                      </div>
                      <div className="col">
                        <h5>Requirements</h5>
                        <a href="#">Entry Requirements</a>
                        <a href="#">Cost Sharing</a>
                        <a href="#">Fees</a>
                      </div>
                      <div className="col">
                        <h5>Guides</h5>
                        <a href="#programs">Programs List</a>
                        <a href="#news">Calendar</a>
                        <a href="#">FAQs</a>
                      </div>
                      <div className="col">
                        <h5>Contact</h5>
                        <a href="#news">Registrar</a>
                        <a href="#">International Students</a>
                        <a href="#">Scholarships</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="has-dd mega-parent">
                <button className="dd" aria-haspopup="true" aria-expanded="false">Academics</button>
                <div className="dropdown" role="menu" aria-label="Academics Mega Menu">
                  <div className="mega">
                    <div className="mega-grid">
                      <div className="col">
                        <h5>Academics</h5>
                        <a href="#programs">Academic Areas</a>
                        <a href="#programs">Academics</a>
                        <a href="#news">Academic Calendars</a>
                      </div>
                      <div className="col">
                        <h5>Departments</h5>
                        <a href="#programs">Computing & IT</a>
                        <a href="#programs">Medicine & Health</a>
                        <a href="#programs">Engineering</a>
                      </div>
                      <div className="col">
                        <h5>Programs</h5>
                        <Link to="/login">All Programs</Link>
                        <a href="#programs">Undergraduate</a>
                        <a href="#programs">Postgraduate</a>
                      </div>
                      <div className="col">
                        <h5>Resources</h5>
                        <a href="#research">Research Agenda</a>
                        <a href="#">Library</a>
                        <a href="#">e‑Learning</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="has-dd">
                <button className="dd" aria-haspopup="true" aria-expanded="false">Research</button>
                <div className="dropdown menu" role="menu">
                  <a href="#research" role="menuitem">Research Agenda</a>
                  <a href="#research" role="menuitem">Community Projects</a>
                  <a href="#news" role="menuitem">Publications</a>
                </div>
              </div>
              <div className="has-dd">
                <button className="dd" aria-haspopup="true" aria-expanded="false">Offices</button>
                <div className="dropdown menu" role="menu">
                  <a href="#news" role="menuitem">President Office</a>
                  <a href="#news" role="menuitem">Registrar</a>
                  <a href="#news" role="menuitem">ICT Directorate</a>
                </div>
              </div>
              <div className="has-dd">
                <button className="dd" aria-haspopup="true" aria-expanded="false">Services</button>
                <div className="dropdown menu" role="menu">
                  <a href="#news" role="menuitem">Student Portal</a>
                  <a href="#research" role="menuitem">Community Service</a>
                  <a href="#news" role="menuitem">Events</a>
                </div>
              </div>
            </nav>
          </div>
          <div className="mast-tools">
            <a className="icon-btn" href="#" aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </a>
            <Link className="icon-btn" to="/login" aria-label="Menu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <section className="hero-split hero" role="region" aria-label="Hero">
        <div className="hero-grid">
          <div className="hero-photo" aria-hidden="true"></div>
          <div className="hero-content">
            <div className="hero-inner container">
              <div className="eyebrow">Wachemo University</div>
              <h1>Let your light shine in the society!</h1>
              <p>Quality education, impactful research, and community service across seven colleges and 140+ programs — empowering learners to create real change.</p>
              <div className="cta-row">
                <Link className="btn primary" to="/login">Portal</Link>
                <a className="btn white" href="#programs">Study at WCU</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="section container about" role="region" aria-label="About WCU">
        <div>
          <h2>About Wachemo University</h2>
          <p>Wachemo University provides relevant, high‑quality education; advances technology through problem‑solving research; and uplifts communities via strong partnerships, technology transfer, and services.</p>
          <ul className="chips" aria-label="Colleges">
            <li>Engineering & Technology</li>
            <li>Natural & Computational Sciences</li>
            <li>Medicine & Health Sciences</li>
            <li>Agricultural Sciences</li>
            <li>Business & Economics</li>
            <li>Social Sciences & Humanities</li>
            <li>Education & Behavioral Sciences</li>
          </ul>
        </div>
        <div></div>
      </section>

      <section className="section" style={{background: 'var(--muted)'}} role="region" aria-label="Student Services">
        <div className="container">
          <h2 style={{textAlign: 'center', marginBottom: '40px'}}>Student Services & Facilities</h2>
          <div className="cards">
            <Link className="card" to="/login">
              <div className="card-media" style={{background: 'linear-gradient(135deg, #e8f4fd, #ffffff)'}}></div>
              <div className="card-body">
                <h3>Student Registration</h3>
                <p>Online registration system for freshman and continuing students with course selection.</p>
              </div>
            </Link>
            <Link className="card" to="/login">
              <div className="card-media" style={{background: 'linear-gradient(135deg, #f0f9ff, #ffffff)'}}></div>
              <div className="card-body">
                <h3>Cafeteria Services</h3>
                <p>Government-subsidized meal services and cost-sharing program management.</p>
              </div>
            </Link>
            <Link className="card" to="/login">
              <div className="card-media" style={{background: 'linear-gradient(135deg, #f7fee7, #ffffff)'}}></div>
              <div className="card-body">
                <h3>Library System</h3>
                <p>Access to Health, Technology, Computational, and Social libraries with digital resources.</p>
              </div>
            </Link>
            <Link className="card" to="/login">
              <div className="card-media" style={{background: 'linear-gradient(135deg, #fef3c7, #ffffff)'}}></div>
              <div className="card-body">
                <h3>Student ID Services</h3>
                <p>Digital ID card registration, printing, and replacement services.</p>
              </div>
            </Link>
            <Link className="card" to="/login">
              <div className="card-media" style={{background: 'linear-gradient(135deg, #fce7f3, #ffffff)'}}></div>
              <div className="card-body">
                <h3>Dormitory Assignment</h3>
                <p>Campus housing allocation and clearance services for residential students.</p>
              </div>
            </Link>
            <Link className="card" to="/login">
              <div className="card-media" style={{background: 'linear-gradient(135deg, #e0e7ff, #ffffff)'}}></div>
              <div className="card-body">
                <h3>Online Examination</h3>
                <p>Secure online testing platform with proctoring and anti-cheating features.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section" role="region" aria-label="University Stats">
        <div className="container stats-grid">
          <div className="stat-card">
            <span className="big">30k+</span><span className="lbl">Students</span>
          </div>
          <div className="stat-card">
            <span className="big">140+</span><span className="lbl">Academic Programs</span>
          </div>
          <div className="stat-card">
            <span className="big">9</span><span className="lbl">Colleges & Schools</span>
          </div>
          <div className="stat-card">
            <span className="big">1000+</span><span className="lbl">Faculty Members</span>
          </div>
        </div>
      </section>

      <section id="colleges" className="section container" role="region" aria-label="Academic Colleges">
        <h2 style={{textAlign: 'center', marginBottom: '40px'}}>Our Academic Colleges</h2>
        <div className="cards">
          <Link className="card" to="/login">
            <div className="card-media" style={{background: 'linear-gradient(135deg, #dbeafe, #ffffff)'}}></div>
            <div className="card-body">
              <h3>Engineering & Technology</h3>
              <p>Innovative programs in civil, electrical, mechanical, and computer engineering.</p>
            </div>
          </Link>
          <Link className="card" to="/login">
            <div className="card-media" style={{background: 'linear-gradient(135deg, #dcfce7, #ffffff)'}}></div>
            <div className="card-body">
              <h3>Medicine & Health Sciences</h3>
              <p>Comprehensive medical education including medicine, pharmacy, and dental programs.</p>
            </div>
          </Link>
          <Link className="card" to="/login">
            <div className="card-media" style={{background: 'linear-gradient(135deg, #fef3c7, #ffffff)'}}></div>
            <div className="card-body">
              <h3>Natural & Computational Sciences</h3>
              <p>Mathematics, physics, chemistry, biology, and computer science programs.</p>
            </div>
          </Link>
          <Link className="card" to="/login">
            <div className="card-media" style={{background: 'linear-gradient(135deg, #f3e8ff, #ffffff)'}}></div>
            <div className="card-body">
              <h3>Agricultural Sciences</h3>
              <p>Sustainable agriculture, animal science, and natural resource management.</p>
            </div>
          </Link>
          <Link className="card" to="/login">
            <div className="card-media" style={{background: 'linear-gradient(135deg, #fce7f3, #ffffff)'}}></div>
            <div className="card-body">
              <h3>Business & Economics</h3>
              <p>Management, accounting, economics, and entrepreneurship programs.</p>
            </div>
          </Link>
          <Link className="card" to="/login">
            <div className="card-media" style={{background: 'linear-gradient(135deg, #e0f2fe, #ffffff)'}}></div>
            <div className="card-body">
              <h3>Social Sciences & Humanities</h3>
              <p>History, geography, languages, and social work programs.</p>
            </div>
          </Link>
          <Link className="card" to="/login">
            <div className="card-media" style={{background: 'linear-gradient(135deg, #fff7ed, #ffffff)'}}></div>
            <div className="card-body">
              <h3>Education & Behavioral Sciences</h3>
              <p>Teacher education and psychology programs for educational excellence.</p>
            </div>
          </Link>
          <Link className="card" to="/login">
            <div className="card-media" style={{background: 'linear-gradient(135deg, #f0fdf4, #ffffff)'}}></div>
            <div className="card-body">
              <h3>School of Law</h3>
              <p>Comprehensive legal education and jurisprudence programs.</p>
            </div>
          </Link>
          <Link className="card" to="/login">
            <div className="card-media" style={{background: 'linear-gradient(135deg, #fef2f2, #ffffff)'}}></div>
            <div className="card-body">
              <h3>School of Veterinary Medicine</h3>
              <p>Animal health, veterinary medicine, and livestock management programs.</p>
            </div>
          </Link>
        </div>
      </section>

      <section id="programs" className="section container" role="region" aria-label="Discover Programs">
        <h2>Discover Our Programs</h2>
        <div className="cards">
          <Link className="card" to="/login">
            <div className="card-media"></div>
            <div className="card-body">
              <h3>All Programs</h3>
              <p>Browse undergraduate & postgraduate programs by college and department.</p>
            </div>
          </Link>
          <a className="card" href="#about">
            <div className="card-media" style={{background: 'linear-gradient(135deg, #e7f0ff, #ffffff)'}}></div>
            <div className="card-body">
              <h3>Colleges Overview</h3>
              <p>Meet the seven colleges and schools powering WCU academics.</p>
            </div>
          </a>
          <a className="card" href="#news">
            <div className="card-media" style={{background: 'linear-gradient(135deg, #fff2df, #ffffff)'}}></div>
            <div className="card-body">
              <h3>Academic Updates</h3>
              <p>Keep up with calls, trainings, and important announcements.</p>
            </div>
          </a>
        </div>
      </section>

      <section id="research" className="section container split" role="region" aria-label="Research and Community">
        <div className="panel">
          <h2>Research Agenda</h2>
          <p>Explore priorities, calls, and resources from the Research & Development Directorate.</p>
          <Link className="btn primary" to="/login">View Agenda</Link>
        </div>
        <div id="community" className="panel">
          <h2>Community Service</h2>
          <p>Training, consultancy, and development projects making regional impact.</p>
          <Link className="btn primary" to="/login">Propose a Project</Link>
        </div>
      </section>

      <section className="section" style={{background: 'var(--muted)'}} role="region" aria-label="Campus Life">
        <div className="container">
          <h2 style={{textAlign: 'center', marginBottom: '40px'}}>Campus Life & Facilities</h2>
          <div className="split">
            <div className="panel">
              <h3>Student Life</h3>
              <p>Experience vibrant campus life with diverse student organizations, cultural events, and recreational activities. Our campus provides a supportive environment for academic and personal growth.</p>
              <ul style={{listStyle: 'none', padding: 0, margin: '16px 0'}}>
                <li style={{padding: '4px 0'}}>🏠 Modern dormitory facilities</li>
                <li style={{padding: '4px 0'}}>🍽️ Government-subsidized cafeteria</li>
                <li style={{padding: '4px 0'}}>⚽ Sports and recreation centers</li>
                <li style={{padding: '4px 0'}}>🎭 Cultural and social activities</li>
              </ul>
            </div>
            <div className="panel">
              <h3>Academic Support</h3>
              <p>Access comprehensive academic support services designed to help you succeed in your studies and prepare for your future career.</p>
              <ul style={{listStyle: 'none', padding: 0, margin: '16px 0'}}>
                <li style={{padding: '4px 0'}}>📚 Multiple specialized libraries</li>
                <li style={{padding: '4px 0'}}>💻 ICT and e-learning resources</li>
                <li style={{padding: '4px 0'}}>🔬 Modern laboratories and workshops</li>
                <li style={{padding: '4px 0'}}>👨‍🏫 Academic counseling services</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section container" role="region" aria-label="Quick Access">
        <h2 style={{textAlign: 'center', marginBottom: '40px'}}>Quick Access Portal</h2>
        <div className="cards">
          <Link className="card" to="/login">
            <div className="card-media" style={{background: 'linear-gradient(135deg, #dbeafe, #ffffff)'}}></div>
            <div className="card-body">
              <h3>Student Portal</h3>
              <p>Access grades, registration, course materials, and academic records.</p>
            </div>
          </Link>
          <Link className="card" to="/login">
            <div className="card-media" style={{background: 'linear-gradient(135deg, #dcfce7, #ffffff)'}}></div>
            <div className="card-body">
              <h3>Online Examination</h3>
              <p>Take secure online exams with advanced proctoring technology.</p>
            </div>
          </Link>
          <Link className="card" to="/login">
            <div className="card-media" style={{background: 'linear-gradient(135deg, #fef3c7, #ffffff)'}}></div>
            <div className="card-body">
              <h3>E-Learning Platform</h3>
              <p>Access course materials, assignments, and online learning resources.</p>
            </div>
          </Link>
          <Link className="card" to="/login">
            <div className="card-media" style={{background: 'linear-gradient(135deg, #f3e8ff, #ffffff)'}}></div>
            <div className="card-body">
              <h3>Cost Sharing Agreement</h3>
              <p>Complete your annual cost-sharing agreement and payment services.</p>
            </div>
          </Link>
          <Link className="card" to="/login">
            <div className="card-media" style={{background: 'linear-gradient(135deg, #fce7f3, #ffffff)'}}></div>
            <div className="card-body">
              <h3>Student Clearance</h3>
              <p>Digital clearance system for graduation and administrative processes.</p>
            </div>
          </Link>
          <Link className="card" to="/login">
            <div className="card-media" style={{background: 'linear-gradient(135deg, #e0f2fe, #ffffff)'}}></div>
            <div className="card-body">
              <h3>HR Services</h3>
              <p>Staff and faculty services, recruitment, and administrative support.</p>
            </div>
          </Link>
        </div>
      </section>

      <section id="news" className="section" role="region" aria-label="News & Announcements">
        <div className="container">
          <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', alignItems: 'start'}}>
            <div>
              <h2>Latest News & Updates</h2>
              <div className="cards">
                <Link className="card" to="/login">
                  <div className="card-media" style={{background: 'linear-gradient(135deg, #e8e6ff, #ffffff)'}}></div>
                  <div className="card-body">
                    <div className="meta" style={{color: '#7a0a2d', fontSize: '12px', fontWeight: '600'}}>December 20, 2024</div>
                    <h3>New Academic Year Registration Opens</h3>
                    <p>Online registration for the 2024/25 academic year is now open for all continuing students.</p>
                  </div>
                </Link>
                <Link className="card" to="/login">
                  <div className="card-media" style={{background: 'linear-gradient(135deg, #e7fff5, #ffffff)'}}></div>
                  <div className="card-body">
                    <div className="meta" style={{color: '#7a0a2d', fontSize: '12px', fontWeight: '600'}}>December 18, 2024</div>
                    <h3>Research Excellence Awards 2024</h3>
                    <p>Celebrating outstanding research contributions from faculty and graduate students.</p>
                  </div>
                </Link>
                <Link className="card" to="/login">
                  <div className="card-media" style={{background: 'linear-gradient(135deg, #fff2f8, #ffffff)'}}></div>
                  <div className="card-body">
                    <div className="meta" style={{color: '#7a0a2d', fontSize: '12px', fontWeight: '600'}}>December 15, 2024</div>
                    <h3>Digital Library Resources Expanded</h3>
                    <p>New digital collections and online databases now available for students and faculty.</p>
                  </div>
                </Link>
                <Link className="card" to="/login">
                  <div className="card-media" style={{background: 'linear-gradient(135deg, #fef3c7, #ffffff)'}}></div>
                  <div className="card-body">
                    <div className="meta" style={{color: '#7a0a2d', fontSize: '12px', fontWeight: '600'}}>December 12, 2024</div>
                    <h3>International Partnership Agreement Signed</h3>
                    <p>New collaboration with European universities for student exchange programs.</p>
                  </div>
                </Link>
              </div>
            </div>
            
            <div>
              <div style={{background: '#7a0a2d', color: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '24px'}}>
                <h3 style={{margin: '0 0 16px', fontSize: '18px'}}>📢 Announcements</h3>
                <div style={{fontSize: '14px', lineHeight: '1.5'}}>
                  <div style={{padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.2)'}}>
                    <strong>Exam Schedule Released</strong><br/>
                    Final exam timetable for Semester I available online
                  </div>
                  <div style={{padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.2)'}}>
                    <strong>Library Extended Hours</strong><br/>
                    24/7 access during exam period
                  </div>
                  <div style={{padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.2)'}}>
                    <strong>Graduation Application</strong><br/>
                    Deadline: January 15, 2025
                  </div>
                  <div style={{padding: '8px 0'}}>
                    <strong>Cost Sharing Forms</strong><br/>
                    Annual forms due by January 30
                  </div>
                </div>
              </div>

              <div style={{background: '#fff', border: '1px solid var(--line)', borderRadius: '12px', padding: '20px', marginBottom: '24px'}}>
                <h3 style={{margin: '0 0 16px', fontSize: '18px', color: '#7a0a2d'}}>📅 Upcoming Events</h3>
                <div style={{fontSize: '14px'}}>
                  <div style={{padding: '8px 0', borderBottom: '1px solid var(--line)'}}>
                    <div style={{fontWeight: '600', color: '#7a0a2d'}}>Jan 8, 2025</div>
                    <div>Spring Semester Begins</div>
                  </div>
                  <div style={{padding: '8px 0', borderBottom: '1px solid var(--line)'}}>
                    <div style={{fontWeight: '600', color: '#7a0a2d'}}>Jan 15, 2025</div>
                    <div>Research Symposium</div>
                  </div>
                  <div style={{padding: '8px 0', borderBottom: '1px solid var(--line)'}}>
                    <div style={{fontWeight: '600', color: '#7a0a2d'}}>Jan 22, 2025</div>
                    <div>Career Fair 2025</div>
                  </div>
                  <div style={{padding: '8px 0'}}>
                    <div style={{fontWeight: '600', color: '#7a0a2d'}}>Feb 1, 2025</div>
                    <div>International Students Orientation</div>
                  </div>
                </div>
              </div>

              <div style={{background: '#fff', border: '1px solid var(--line)', borderRadius: '12px', padding: '20px'}}>
                <h3 style={{margin: '0 0 16px', fontSize: '18px', color: '#7a0a2d'}}>🔗 Quick Links</h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <Link to="/login" style={{padding: '8px 12px', background: 'var(--muted)', borderRadius: '6px', fontSize: '14px', fontWeight: '500'}}>
                    Student Portal
                  </Link>
                  <Link to="/login" style={{padding: '8px 12px', background: 'var(--muted)', borderRadius: '6px', fontSize: '14px', fontWeight: '500'}}>
                    Academic Calendar
                  </Link>
                  <Link to="/login" style={{padding: '8px 12px', background: 'var(--muted)', borderRadius: '6px', fontSize: '14px', fontWeight: '500'}}>
                    Library Resources
                  </Link>
                  <Link to="/login" style={{padding: '8px 12px', background: 'var(--muted)', borderRadius: '6px', fontSize: '14px', fontWeight: '500'}}>
                    Course Catalog
                  </Link>
                  <Link to="/login" style={{padding: '8px 12px', background: 'var(--muted)', borderRadius: '6px', fontSize: '14px', fontWeight: '500'}}>
                    Apply Online
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{background: 'var(--muted)'}} role="region" aria-label="External Educational Resources">
        <div className="container">
          <h2 style={{textAlign: 'center', marginBottom: '20px'}}>External Educational Links</h2>
          <p style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px', color: '#64748b'}}>
            Access additional learning resources and educational platforms to enhance your academic journey.
          </p>
          <div className="cards">
            <a className="card" href="https://www.coursera.org" target="_blank" rel="noopener noreferrer">
              <div className="card-media" style={{background: 'linear-gradient(135deg, #0056d3, #ffffff)'}}></div>
              <div className="card-body">
                <h3>Coursera</h3>
                <p>Access thousands of online courses from top universities and companies worldwide.</p>
              </div>
            </a>
            <a className="card" href="https://www.udemy.com" target="_blank" rel="noopener noreferrer">
              <div className="card-media" style={{background: 'linear-gradient(135deg, #a435f0, #ffffff)'}}></div>
              <div className="card-body">
                <h3>Udemy</h3>
                <p>Professional development courses in technology, business, and creative skills.</p>
              </div>
            </a>
            <a className="card" href="https://www.edx.org" target="_blank" rel="noopener noreferrer">
              <div className="card-media" style={{background: 'linear-gradient(135deg, #02262f, #ffffff)'}}></div>
              <div className="card-body">
                <h3>edX</h3>
                <p>University-level courses from Harvard, MIT, and other leading institutions.</p>
              </div>
            </a>
            <a className="card" href="https://www.khanacademy.org" target="_blank" rel="noopener noreferrer">
              <div className="card-media" style={{background: 'linear-gradient(135deg, #14bf96, #ffffff)'}}></div>
              <div className="card-body">
                <h3>Khan Academy</h3>
                <p>Free educational resources covering math, science, and humanities subjects.</p>
              </div>
            </a>
            <a className="card" href="https://www.futurelearn.com" target="_blank" rel="noopener noreferrer">
              <div className="card-media" style={{background: 'linear-gradient(135deg, #de00a5, #ffffff)'}}></div>
              <div className="card-body">
                <h3>FutureLearn</h3>
                <p>Social learning platform with courses from universities and cultural institutions.</p>
              </div>
            </a>
            <Link className="card" to="/login">
              <div className="card-media" style={{background: 'linear-gradient(135deg, #7a0a2d, #ffffff)'}}></div>
              <div className="card-body">
                <h3>WCU E-Learning</h3>
                <p>Access our internal learning management system and course materials.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{background: 'var(--muted)'}} role="region" aria-label="University Partnerships">
        <div className="container">
          <h2 style={{textAlign: 'center', marginBottom: '20px'}}>Our Partners & Collaborations</h2>
          <p style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px', color: '#64748b'}}>
            Wachemo University maintains strategic partnerships with leading institutions, organizations, and companies to enhance educational quality and research impact.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            alignItems: 'center',
            justifyItems: 'center'
          }}>
            <div style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid var(--line)',
              textAlign: 'center',
              minHeight: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}>
              <div>
                <div style={{fontSize: '24px', marginBottom: '8px'}}>🏛️</div>
                <div style={{fontWeight: '600', fontSize: '14px'}}>Ministry of Education</div>
              </div>
            </div>
            <div style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid var(--line)',
              textAlign: 'center',
              minHeight: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}>
              <div>
                <div style={{fontSize: '24px', marginBottom: '8px'}}>🌍</div>
                <div style={{fontWeight: '600', fontSize: '14px'}}>International Partners</div>
              </div>
            </div>
            <div style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid var(--line)',
              textAlign: 'center',
              minHeight: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}>
              <div>
                <div style={{fontSize: '24px', marginBottom: '8px'}}>🏢</div>
                <div style={{fontWeight: '600', fontSize: '14px'}}>Industry Partners</div>
              </div>
            </div>
            <div style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid var(--line)',
              textAlign: 'center',
              minHeight: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}>
              <div>
                <div style={{fontSize: '24px', marginBottom: '8px'}}>🔬</div>
                <div style={{fontWeight: '600', fontSize: '14px'}}>Research Institutions</div>
              </div>
            </div>
            <div style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid var(--line)',
              textAlign: 'center',
              minHeight: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}>
              <div>
                <div style={{fontSize: '24px', marginBottom: '8px'}}>🤝</div>
                <div style={{fontWeight: '600', fontSize: '14px'}}>Community Organizations</div>
              </div>
            </div>
          </div>
          <div style={{textAlign: 'center', marginTop: '32px'}}>
            <Link className="btn primary" to="/login">Partnership Opportunities</Link>
          </div>
        </div>
      </section>

      <section className="section container" role="region" aria-label="Contact Information">
        <h2 style={{textAlign: 'center', marginBottom: '40px'}}>Contact & Location</h2>
        <div className="split">
          <div className="panel">
            <h3>Get in Touch</h3>
            <div style={{marginBottom: '16px'}}>
              <strong>Main Campus</strong><br/>
              Wachemo University<br/>
              Hossana, Ethiopia<br/>
              P.O. Box 667
            </div>
            <div style={{marginBottom: '16px'}}>
              <strong>Phone:</strong> +251-46-550-0123<br/>
              <strong>Email:</strong> info@wcu.edu.et<br/>
              <strong>Website:</strong> www.wcu.edu.et
            </div>
            <div>
              <strong>Office Hours:</strong><br/>
              Monday - Friday: 8:00 AM - 5:00 PM<br/>
              Saturday: 8:00 AM - 12:00 PM
            </div>
          </div>
          <div className="panel">
            <h3>Key Offices</h3>
            <div style={{marginBottom: '12px'}}>
              <strong>Registrar Office</strong><br/>
              Student registration, transcripts, and academic records
            </div>
            <div style={{marginBottom: '12px'}}>
              <strong>Student Services</strong><br/>
              ID cards, dormitory, cafeteria, and student support
            </div>
            <div style={{marginBottom: '12px'}}>
              <strong>ICT Directorate</strong><br/>
              Technical support, online services, and digital resources
            </div>
            <div>
              <strong>International Office</strong><br/>
              International students and partnership programs
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer footer" role="contentinfo">
        <div className="footer-top">
          <div className="container footer-grid">
            <div>
              <div className="footer-brand">
                <div 
                  className="footer-logo-bg"
                  style={{
                    backgroundImage: 'url(/logo2.png)',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    width: '70px',
                    height: '70px'
                  }}
                ></div>
                <div className="name">Wachemo University</div>
              </div>
              <p className="footer-desc">We are passionate about delivering quality, accessible education backed by problem‑solving research and meaningful community service.</p>
              <div className="socials">
                <a href="#" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M15 3h-3a4 4 0 00-4 4v3H6v4h2v7h4v-7h3l1-4h-4V7a1 1 0 011-1h3V3z" fill="currentColor"/>
                  </svg>
                </a>
                <a href="#" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor"/>
                    <circle cx="12" cy="12" r="4" stroke="currentColor"/>
                    <circle cx="17" cy="7" r="1.2" fill="currentColor"/>
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M6.94 6.5a1.44 1.44 0 110-2.88 1.44 1.44 0 010 2.88zM5.5 8.5h2.9v9H5.5v-9zm5 0h2.78v1.23h.04c.39-.74 1.36-1.52 2.8-1.52 2.99 0 3.55 1.97 3.55 4.52v4.77h-2.9v-4.23c0-1.01-.02-2.31-1.41-2.31-1.41 0-1.63 1.1-1.63 2.24v4.3H10.5v-9z" fill="currentColor"/>
                  </svg>
                </a>
                <a href="#" aria-label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22 12s0-3-0.34-4.4c-.19-.84-.88-1.5-1.72-1.69C18.51 5.5 12 5.5 12 5.5s-6.51 0-7.94.41c-.84.19-1.53.85-1.72 1.69C2 9 2 12 2 12s0 3 .34 4.4c.19.84.88 1.5 1.72 1.69C5.49 18.5 12 18.5 12 18.5s6.51 0 7.94-.41c.84-.19 1.53-.85 1.72-1.69C22 15 22 12 22 12z" stroke="currentColor"/>
                    <path d="M10 9.75v4.5L15 12l-5-2.25z" fill="currentColor"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4>Our Campus</h4>
              <ul>
                <li><a href="#programs">Academic</a></li>
                <li><a href="#programs">Athletics</a></li>
                <li><a href="#programs">Campus life</a></li>
                <li><a href="#research">Research</a></li>
                <li><a href="#programs">Academic Area</a></li>
              </ul>
            </div>
            <div>
              <h4>Pages</h4>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#programs">Tuition Fee</a></li>
                <li><a href="#programs">Alumni</a></li>
                <li><a href="#programs">Faculty & Staff</a></li>
                <li><a href="#news">Event</a></li>
              </ul>
            </div>
            <div className="quick">
              <h4>Quick Link</h4>
              <Link className="btn primary" to="/login">Apply Now</Link>
              <a className="btn ghost" href="#programs">Scholarship</a>
            </div>
          </div>
        </div>
        <div className="container footer-bottom">
          <div>© 2025. All Rights Reserved by Wachemo University</div>
          <div>Developed for demo by Dawit</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageExact;