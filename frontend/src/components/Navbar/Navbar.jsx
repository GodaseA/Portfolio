import { useRef, useState, useEffect } from "react";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { FiGithub, FiLinkedin, FiFileText, FiMenu, FiX } from "react-icons/fi";
import { assets } from "../../assets/assets";
import "./Navbar.css";

const NAV_LINKS = [
  { id: "about",     label: "About"      },
  { id: "project",   label: "Projects"   },
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
  const [active, setActive]       = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const drawerRef = useRef();

  /* Frosted glass effect on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 3000);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close drawer on ESC */
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* Lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNav = (id) => {
    setActive(id);
    setMobileOpen(false);
  };

  return (
    <>
      <nav className={`nv-root ${scrolled ? "nv-root--scrolled" : ""}`}>

        {/* Logo / Name */}
        <AnchorLink href="#home" className="nv-logo" onClick={() => handleNav("home")}>
          <img src={assets.ProfilePic} alt="Abhijit Godase" className="nv-avatar" />
          <span className="nv-brand">Abhijit<span className="nv-brand-dot">.</span></span>
        </AnchorLink>

        {/* Desktop nav links */}
        <ul className="nv-links">
          {NAV_LINKS.map(({ id, label }) => (
            <li key={id} className={`nv-item ${active === id ? "nv-item--active" : ""}`}>
              <AnchorLink
                className="nv-anchor"
                offset={64}
                href={`#${id}`}
                onClick={() => handleNav(id)}
              >
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
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
        >
          <FiMenu size={22} />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`nv-overlay ${mobileOpen ? "nv-overlay--visible" : ""}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <aside
        ref={drawerRef}
        className={`nv-drawer ${mobileOpen ? "nv-drawer--open" : ""}`}
        aria-label="Navigation menu"
      >
        <button
          className="nv-drawer-close"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
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