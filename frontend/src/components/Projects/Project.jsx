import { useState, useCallback } from "react";
import { FiGithub, FiExternalLink, FiArrowUpRight } from "react-icons/fi";
import img from "../../assets/demo.jpg";
import "./Project.css";

/* ─── Data ───────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: 1,
    name: "Food Delivery App",
    tag: "Full-Stack",
    des: "End-to-end food ordering platform with real-time tracking, cart management, and Stripe payments.",
    img: img,
    icon: img,
    github: "#",
    live: "#",
  },
  {
    id: 2,
    name: "Portfolio Website",
    tag: "Frontend",
    des: "Animated personal portfolio with custom cursor effects, 3D globe, and smooth scroll transitions.",
    img: img,
    icon: img,
    github: "#",
    live: "#",
  },
  {
    id: 3,
    name: "Chat Application",
    tag: "Full-Stack",
    des: "Real-time messaging app powered by Socket.io with room-based channels and media sharing.",
    img: img,
    icon: img,
    github: "#",
    live: "#",
  },
  {
    id: 4,
    name: "E-Commerce Store",
    tag: "Full-Stack",
    des: "Product catalogue with search, filters, wishlist, and an admin dashboard for inventory management.",
    img: img,
    icon: img,
    github: "#",
    live: "#",
  },
  {
    id: 5,
    name: "Task Manager",
    tag: "Frontend",
    des: "Drag-and-drop Kanban board with local persistence, labels, and deadline reminders.",
    img: img,
    icon: img,
    github: "#",
    live: "#",
  },
  {
    id: 6,
    name: "Weather Dashboard",
    tag: "API",
    des: "7-day forecast dashboard using OpenWeatherMap API with animated weather icons and geolocation.",
    img: img,
    icon: img,
    github: "#",
    live: "#",
  },
];

/* ─── Component ──────────────────────────────────────────── */
export default function Project() {
  const [active, setActive]     = useState(PROJECTS[0]); // drives the static right-side panel
  const [expanded, setExpanded] = useState(null);         // mobile tap state

  const handleFocus = useCallback((project) => {
    setActive(project);
  }, []);

  /* Mobile: toggle expanded card */
  const handleTap = (project) => {
    setExpanded((prev) => (prev?.id === project.id ? null : project));
  };

  return (
    <section id="project" className="pj-root">

      {/* Header */}
      <div className="pj-header">
        <p className="pj-eyebrow">Selected work</p>
        <h2 className="pj-headline">
          My Latest <span>Work.</span>
        </h2>
      </div>

      <div className="pj-layout">

        {/* Project list — left column */}
        <ul className="pj-list" role="list">
          {PROJECTS.map((project, i) => (
            <li key={project.id} className="pj-item">

              {/* Row */}
              <div
                className={`pj-row ${active?.id === project.id ? "pj-row--active" : ""}`}
                onMouseEnter={() => handleFocus(project)}
                onFocus={() => handleFocus(project)}
                onClick={() => handleTap(project)}
                role="button"
                tabIndex={0}
                aria-label={`View ${project.name}`}
                aria-pressed={active?.id === project.id}
                onKeyDown={(e) => e.key === "Enter" && handleTap(project)}
              >
                <span className="pj-index">0{i + 1}</span>

                <div className="pj-icon-wrap">
                  <img src={project.icon} alt="" className="pj-icon" />
                </div>

                <span className="pj-name">{project.name}</span>

                <span className="pj-tag">{project.tag}</span>

                <span className="pj-row-arrow" aria-hidden="true">
                  <FiArrowUpRight size={16} />
                </span>
              </div>

              {/* Mobile expanded panel (tap-to-open, replaces the desktop side panel) */}
              <div className={`pj-expand ${expanded?.id === project.id ? "pj-expand--open" : ""}`}>
                <img src={project.img} alt={project.name} className="pj-expand-img" />
                <p className="pj-expand-des">{project.des}</p>
                <div className="pj-expand-links">
                  <a
                    href={project.github}
                    className="pj-icon-link"
                    aria-label={`${project.name} GitHub repository`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiGithub size={16} />
                    <span>Code</span>
                  </a>
                  <a
                    href={project.live}
                    className="pj-icon-link pj-icon-link--primary"
                    aria-label={`${project.name} live site`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiExternalLink size={16} />
                    <span>Live site</span>
                  </a>
                </div>
              </div>

            </li>
          ))}
        </ul>

        {/* Static detail dive — right column, swaps content on hover/focus */}
        <div className="pj-detail">
          <div className="pj-detail-card" key={active.id}>
            <div className="pj-detail-img-wrap">
              <img src={active.img} alt={active.name} className="pj-detail-img" />
            </div>

            <div className="pj-detail-body">
              <p className="pj-detail-tag">{active.tag}</p>
              <h3 className="pj-detail-name">{active.name}</h3>
              <p className="pj-detail-des">{active.des}</p>

              <div className="pj-detail-links">
                <a
                  href={active.github}
                  className="pj-detail-link"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${active.name} GitHub repository`}
                >
                  <FiGithub size={18} />
                  <span>GitHub</span>
                </a>
                <a
                  href={active.live}
                  className="pj-detail-link pj-detail-link--primary"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${active.name} live site`}
                >
                  <FiExternalLink size={18} />
                  <span>Live site</span>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}