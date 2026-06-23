import { useState, useEffect, useRef } from "react";
import { assets } from "../../assets/assets";
import "./About.css";
import { label } from "three/tsl";
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJs } from "react-icons/fa";
import { SiMongodb, SiExpress } from "react-icons/si";

const WORDS = ["React", "Node.js", "HTML", "CSS", "JavaScript", "MongoDB"];
const imgWords = ["A full-stack Developer", "I am Abhijit Godase", "A full-stack Developer"];
const ROWS = 24;
const COLS = 24;
// const ProfilePic = assets.ProfilePic
import ProfilePic from "../../assets/mydemoo.png"
const SKILLS = [
  { icon: FaReact, label: "React" },
  { icon: FaNodeJs, label: "Node.js" },
  { icon: SiExpress, label: "Express" },
  { icon: SiMongodb, label: "MongoDB" },
  { icon: FaJs, label: "JavaScript" },
  { icon: FaHtml5, label: "HTML" },
  { icon: FaCss3Alt, label: "CSS" },
];

const STATS = [
  { num: "1+", label: ["Years of", "Experience"] },
  { num: "10+", label: ["Projects", "Completed"] },
  { num: "50+", label: ["LeetCode", "Solved"] },
];

const About = () => {
  const rootRef = useRef(null);
  const bgRef = useRef(null);
  const spotRef = useRef(null);
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const [barsReady, setBarsReady] = useState(false);

  /* Animate skill bars after mount */
  useEffect(() => {
    const t = setTimeout(() => setBarsReady(true), 400);
    return () => clearTimeout(t);
  }, []);

  /* Custom cursor + spotlight + proximity word highlight */
  useEffect(() => {
    const root = rootRef.current;
    const bg = bgRef.current;
    const spot = spotRef.current;
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!root) return;

    const onMove = (e) => {
      const rect = root.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

      [cursor, ring, spot].forEach((el) => {
        if (!el) return;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.opacity = inside ? "1" : "0";
      });

      if (inside && bg) {
        bg.querySelectorAll(".ab-bg-row span").forEach((sp) => {
          const sr = sp.getBoundingClientRect();
          const cx = sr.left + sr.width / 2 - rect.left;
          const cy = sr.top + sr.height / 2 - rect.top;
          const dist = Math.sqrt((cx - x) ** 2 + (cy - y) ** 2);
          if (dist < 180) {
            const t = 1 - dist / 180;
            sp.style.color = `rgba(99,102,241,${0.08 + t * 0.55})`;
            sp.style.transform = `scale(${1 + t * 0.15})`;
          } else {
            sp.style.color = "";
            sp.style.transform = "";
          }
        });
      }
    };

    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="ab-root" id="about" ref={rootRef}>

      {/* Scrolling background words */}
      <div className="ab-bg" ref={bgRef} aria-hidden="true">
        {Array.from({ length: ROWS }, (_, r) => (
          <div
            key={r}
            className="ab-bg-row"
            style={{ animationDelay: `-${r * 1.8}s` }}
          >
            {Array.from({ length: COLS * 2 }, (_, c) => (
              <span key={c}>{WORDS[c % WORDS.length]}</span>
            ))}
          </div>
        ))}
      </div>

      {/* Spotlight */}
      <div className="ab-spotlight" ref={spotRef} style={{ opacity: 0 }} />

      {/* Custom cursor */}
      <div className="ab-cursor" ref={cursorRef} style={{ opacity: 0 }} />
      <div className="ab-cursor-ring" ref={ringRef} style={{ opacity: 0 }} />

      {/* Main content */}
      <div className="ab-inner">

        <p className="ab-eyebrow">Get to know me</p>
        <h1 className="ab-headline">
          About <span>Me.</span>
        </h1>

        <div className="ab-grid">

          {/* Profile image */}
          <div className="ab-img-wrap">
            <img src={ProfilePic} alt="Profile" />
            {/* <img src={assets.ProfilePic} alt="Profile" /> */}
            {/* <span className="ab-img-text">My Self Abhijit Godase </span> */}




            {/* <div className="ab-img-bg" ref={bgRef} aria-hidden="true">

              {Array.from({ length: ROWS }, (_, r) => (
                <div
                  key={r}
                  className="ab-img-text"
                  style={{ animationDelay: `-${r * 1.8}s` }}
                >
                  {Array.from({ length: COLS * 2 }, (_, c) => (
                    <span key={c}>{imgWords[c % imgWords.length]}</span>
                  ))}
                </div>
              ))}
            </div> */}




            <div className="ab-img-tag">
              <strong>1+</strong>
              <small>Yrs Exp</small>
            </div>
          </div>

          {/* Bio + Skills */}
          <div className="ab-right">
            <div className="ab-bio">
              <p>
                I&apos;m a <strong>full-stack developer</strong> who loves
                building interactive web apps that solve real-world problems —
                from concept to shipped product.
              </p>
              <p>
                Currently sharpening my skills across the{" "}
                <strong>MERN stack</strong>, with a focus on performance, clean
                APIs, and interfaces that feel alive.
              </p>
            </div>

            <div className="ab-skills">
              <p className="ab-skills-label">Technical skills</p>

              <div className="ab-skill-container">
                {SKILLS.map(({ icon: Icon, label }) => (

                  <div className="ab-skill" key={label}>
                    <Icon className="ab-skill-icon" />
                    <span className="ab-skill-label">{label}</span>
                  </div>

                ))}
              </div>




              {/* {SKILLS.map(({ label, pct }) => (
                <div className="ab-skill" key={label}>
                  <div className="ab-skill-header">
                    <span>{label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="ab-track">
                    <div
                      className="ab-fill"
                      style={{
                        transform: barsReady
                          ? `scaleX(${pct / 100})`
                          : "scaleX(0)",
                      }}
                    />
                  </div>
                </div>
              ))} */}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="ab-stats">
          {STATS.map(({ num, label }) => (
            <div className="ab-stat" key={num}>
              <div className="ab-stat-num">{num}</div>
              <div className="ab-stat-label">
                {label[0]}
                <br />
                {label[1]}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default About;