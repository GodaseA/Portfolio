import { useRef, useState, useEffect } from "react";
import AnchorLink from "react-anchor-link-smooth-scroll";
import gsap from "gsap";
import { FiGithub, FiLinkedin, FiFileText, FiMenu, FiX } from "react-icons/fi";
import { assets } from "../../assets/assets";
import "./Navbar.css";

const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "project", label: "Projects" },
  { id: "experince", label: "Experience" },
];

const SOCIAL_LINKS = [
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://linkedin.com/in/your-profile",
    icon: FiLinkedin,
    external: true,
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/your-username",
    icon: FiGithub,
    external: true,
  },
  {
    id: "resume",
    label: "Download CV",
    href: "/resume.pdf",
    icon: FiFileText,
    download: true,
  },
];

const Navbar = () => {
  const [active, setActive] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef(null);
  const pillRef = useRef(null);
  const navItemRefs = useRef([]);
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);
  const hamburgerRef = useRef(null);

  /* Frosted glass effect on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 1500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close drawer on ESC */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* Lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* Entrance animation on load */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".nv-logo", { opacity: 0, y: -16, duration: 0.5, ease: "power2.out" });
      gsap.from(".nv-item", {
        opacity: 0,
        y: -12,
        duration: 0.4,
        stagger: 0.08,
        delay: 0.15,
        ease: "power2.out",
      });
      gsap.fromTo(".nv-social-btn", {
        opacity: 0,
        y: -12,
      
      },{
          opacity: 1,
        y: 0,
          duration: 0.4,
        stagger: 0.06,
        delay: 0.35,
        ease: "power2.out",
      });
    }, navRef);
    return () => ctx.revert();
  }, []);

  /* Sliding active-link pill */
  const movePill = (id, animate = true) => {
    const idx = NAV_LINKS.findIndex((l) => l.id === id);
    const el = navItemRefs.current[idx];
    if (!el || !pillRef.current) return;

    const props = { x: el.offsetLeft, width: el.offsetWidth, opacity: 1 };
    if (animate) {
      gsap.to(pillRef.current, { ...props, duration: 0.45, ease: "power3.out" });
    } else {
      gsap.set(pillRef.current, props);
    }
  };

  useEffect(() => {
    movePill(active);
  }, [active]);

  useEffect(() => {
    const onResize = () => movePill(active, false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  /* Mobile drawer open/close animation */
  useEffect(() => {
    if (!drawerRef.current || !overlayRef.current) return;

    if (mobileOpen) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(drawerRef.current, { x: "0%", duration: 0.45, ease: "power3.out" });
      gsap.fromTo(
        ".nv-drawer-profile, .nv-drawer-links li, .nv-drawer-social a",
        { opacity: 0, x: 24 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, delay: 0.12, ease: "power2.out" }
      );
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: "power2.in" });
      gsap.to(drawerRef.current, { x: "100%", duration: 0.35, ease: "power2.in" });
    }
  }, [mobileOpen]);

  const handleNav = (id) => {
    setActive(id);
    setMobileOpen(false);
  };

  const handleHamburgerClick = () => {
    gsap.fromTo(hamburgerRef.current, { rotate: -90, scale: 0.7 }, { rotate: 0, scale: 1, duration: 0.35, ease: "back.out(2)" });
    setMobileOpen(true);
  };

  return (
    <>
      <nav className={`nv-root ${scrolled ? "nv-root--scrolled" : ""}`} ref={navRef}>
        {/* Logo / Name */}
        <AnchorLink href="#home" className="nv-logo" onClick={() => handleNav("home")}>
          <img src={assets.ProfilePic} alt="Abhijit Godase" className="nv-avatar" />
          <span className="nv-brand">
            Abhijit<span className="nv-brand-dot">.</span>
          </span>
        </AnchorLink>

        {/* Desktop nav links */}
        <ul className="nv-links">
          <span className="nv-pill" ref={pillRef} />
          {NAV_LINKS.map(({ id, label }, i) => (
            <li
              key={id}
              className={`nv-item ${active === id ? "nv-item--active" : ""}`}
              ref={(el) => (navItemRefs.current[i] = el)}
            >
              <AnchorLink className="nv-anchor" offset={64} href={`#${id}`} onClick={() => handleNav(id)}>
                {label}
              </AnchorLink>
            </li>
          ))}
        </ul>

        {/* Social icons with tooltips */}
        <div className="nv-social">
          {SOCIAL_LINKS.map(({ id, label, href, icon: Icon, external, download }) => (
            <a
              key={id}
              href={href}
              className="nv-social-btn"
              aria-label={label}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              {...(download ? { download: true } : {})}
            >
              <Icon size={18} />
              <span className="nv-tooltip">{label}</span>
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="nv-hamburger"
          onClick={handleHamburgerClick}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
        >
          <span ref={hamburgerRef} className="nv-hamburger-icon">
            <FiMenu size={22} />
          </span>
        </button>
      </nav>

      {/* Mobile overlay */}
      <div className="nv-overlay" ref={overlayRef} onClick={() => setMobileOpen(false)} aria-hidden="true" />

      {/* Mobile drawer */}
      <aside ref={drawerRef} className="nv-drawer" aria-label="Navigation menu">
        <button className="nv-drawer-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <FiX size={20} />
        </button>

        <div className="nv-drawer-profile">
          <img src={assets.ProfilePic} alt="" className="nv-drawer-avatar" />
          <p className="nv-drawer-name">Abhijit Godase</p>
          <p className="nv-drawer-role">Full-Stack Developer</p>
        </div>

        <ul className="nv-drawer-links">
          {NAV_LINKS.map(({ id, label }) => (
            <li key={id}>
              <AnchorLink
                className={`nv-drawer-anchor ${active === id ? "nv-drawer-anchor--active" : ""}`}
                offset={64}
                href={`#${id}`}
                onClick={() => handleNav(id)}
              >
                {label}
              </AnchorLink>
            </li>
          ))}
        </ul>

        <div className="nv-drawer-social">
          {SOCIAL_LINKS.map(({ id, label, href, icon: Icon, external, download }) => (
            <a
              key={id}
              href={href}
              className="nv-drawer-social-btn"
              aria-label={label}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              {...(download ? { download: true } : {})}
            >
              <Icon size={15} />
              {label}
            </a>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Navbar;