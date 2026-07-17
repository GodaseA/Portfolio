import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Contact.css";
import mail_icon from "../../assets/mail_icon.svg";
import location_icon from "../../assets/location_icon.svg";
import call_icon from "../../assets/call_icon.svg";
import bg  from "../../assets/contactBG.avif"
gsap.registerPlugin(ScrollTrigger);

const CONTACT_DETAILS = [
  { icon: mail_icon, label: "abhijitgodase04.10@gmail.com" },
  { icon: call_icon, label: "+91 7489873816" },
  { icon: location_icon, label: "Pune, Maharashtra" },
];

const FIELDS = [
  { id: "ct-name", name: "name", type: "text", label: "Your name" },
  { id: "ct-email", name: "email", type: "email", label: "Your email" },
  { id: "ct-message", name: "message", label: "Write your message", textarea: true },
];

// Vertical stops for the rail indicator inside a 0-300 viewBox (percentage-proportional)
const RAIL_STOPS = [30, 150, 270];

export default function Contact() {
  const rootRef = useRef(null);
  const btnRef = useRef(null);
  const btnLabelRef = useRef(null);
  const spinnerRef = useRef(null);

  const railDotRef = useRef(null);
  const railRingRef = useRef(null);

  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [activeIndex, setActiveIndex] = useState(null);
  const [filled, setFilled] = useState({ name: false, email: false, message: false });

  /* Scroll-triggered entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(".ct-eyebrow", { opacity: 0, x: -24, duration: 0.5, ease: "power2.out" })
        .from(".ct-word", { opacity: 0, y: 32, duration: 0.6, stagger: 0.1, ease: "power3.out" }, "-=0.2")
        .from(".ct-info", { opacity: 0, x: -30, duration: 0.6, ease: "power2.out" }, "-=0.3")
        .from(".ct-detail", { opacity: 0, x: -16, duration: 0.4, stagger: 0.1, ease: "power2.out" }, "-=0.3")
        .from(".ct-form-wrap", { opacity: 0, x: 30, duration: 0.6, ease: "power2.out" }, "-=0.5")
        .from(".form-field", { opacity: 0, y: 18, duration: 0.45, stagger: 0.08, ease: "power2.out" }, "-=0.35")
        .from(".contact-submit", { opacity: 0, y: 18, duration: 0.45, ease: "power2.out" }, "-=0.2");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  /* Rest position for the rail dot when nothing is focused */
  useEffect(() => {
    if (activeIndex === null && railDotRef.current) {
      gsap.to(railDotRef.current, {
        y: 10,
        opacity: 0.35,
        scale: 0.9,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [activeIndex]);

  /* Spin the loading icon while submitting */
  useEffect(() => {
    if (status !== "loading") return;
    const tween = gsap.to(spinnerRef.current, {
      rotate: 360,
      duration: 0.8,
      repeat: -1,
      ease: "linear",
    });
    return () => tween.kill();
  }, [status]);

  const moveRailTo = (index) => {
    gsap.to(railDotRef.current, {
      y: RAIL_STOPS[index],
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.55)",
    });
  };

  const handleFocus = (e, index) => {
    setActiveIndex(index);
    moveRailTo(index);

    const field = e.currentTarget.closest(".form-field");
    const label = field.querySelector(".form-label");
    const underline = field.querySelector(".form-underline");
    gsap.to(label, { y: -22, scale: 0.82, color: "#ffffff", duration: 0.25, ease: "power2.out" });
    gsap.to(underline, { scaleX: 1, duration: 0.35, ease: "power2.out" });
  };

  const handleBlur = (e) => {
    const field = e.currentTarget.closest(".form-field");
    const label = field.querySelector(".form-label");
    const underline = field.querySelector(".form-underline");
    const hasValue = e.currentTarget.value.trim().length > 0;

    if (!hasValue) {
      gsap.to(label, { y: 0, scale: 1, color: "#9a9aa2", duration: 0.25, ease: "power2.out" });
      gsap.to(underline, { scaleX: 0, duration: 0.3, ease: "power2.out" });
    }

    setTimeout(() => {
      const stillInForm = document.activeElement?.closest?.(".ct-form");
      if (!stillInForm) setActiveIndex(null);
    }, 0);
  };

  /* Ripple pulse on the rail dot + tiny bounce, on every keystroke */
  const handleInput = (e, index, name) => {
    const field = e.currentTarget.closest(".form-field");
    const underline = field.querySelector(".form-underline");
    gsap.fromTo(underline, { scaleY: 2.2 }, { scaleY: 1, duration: 0.25, ease: "power2.out", overwrite: "auto" });

    gsap.fromTo(
      railDotRef.current,
      { scale: 1.3 },
      { scale: 1, duration: 0.25, ease: "power1.inOut", overwrite: "auto" }
    );
    gsap.fromTo(
      railRingRef.current,
      { scale: 0.6, opacity: 0.8 },
      { scale: 2.2, opacity: 0, duration: 0.55, ease: "power2.out", overwrite: "auto" }
    );

    setFilled((f) => ({ ...f, [name]: e.currentTarget.value.trim().length > 0 }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    gsap.to(btnRef.current, {
      width: 52,
      paddingLeft: 0,
      paddingRight: 0,
      borderRadius: 26,
      duration: 0.35,
      ease: "power2.inOut",
    });
    gsap.to(btnLabelRef.current, { opacity: 0, duration: 0.2 });

    const formData = new FormData(event.target);
    formData.append("access_key", "63895d0e-ff42-4d9a-8ee6-8be821453e73");
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      }).then((r) => r.json());

      if (res.success) {
        setStatus("success");
        event.target.reset();
        setFilled({ name: false, email: false, message: false });
        document.querySelectorAll(".form-label").forEach((label) =>
          gsap.to(label, { y: 0, scale: 1, color: "#9a9aa2", duration: 0.2 })
        );
        document.querySelectorAll(".form-underline").forEach((u) =>
          gsap.to(u, { scaleX: 0, duration: 0.2 })
        );
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }

    gsap.to(btnRef.current, { scale: 1.08, duration: 0.15, yoyo: true, repeat: 1, delay: 0.1 });

    setTimeout(() => {
      setStatus("idle");
      gsap.to(btnRef.current, {
        width: "auto",
        paddingLeft: 32,
        paddingRight: 32,
        borderRadius: 10,
        duration: 0.4,
        ease: "power2.inOut",
      });
      gsap.to(btnLabelRef.current, { opacity: 1, duration: 0.25, delay: 0.15 });
    }, 2200);
  };

  return (
    <section id="contact" className="contact-root" ref={rootRef}>
      <div className="contact-header">
        <p className="ct-eyebrow">Get in touch</p>
        <h2 className="ct-headline">
          <span className="ct-word">Let&apos;s</span>{" "}
          <span className="ct-word ct-word--accent">talk.</span>
        </h2>
      </div>



{/* <img src={bg} alt="" className="cnt-background" /> */}
      <div className="contact-body">
         <div className="ct-info">
          <p className="ct-info-desc">
            I&apos;m currently available for new projects and full-time roles. Reach out and
            I&apos;ll get back to you within a day.
          </p>

          <div className="ct-detail-list">
            {CONTACT_DETAILS.map((d) => (
              <div className="ct-detail" key={d.label}>
                <span className="ct-detail-icon">
                  <img src={d.icon} alt="" />
                </span>
                <p>{d.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: rail + form */}
        <div className="ct-form-wrap">
           <svg className="ct-rail" viewBox="0 0 40 300" preserveAspectRatio="none" aria-hidden="true">
            <line x1="20" y1="0" x2="20" y2="300" className="ct-rail-line" />

            {RAIL_STOPS.map((y, i) => (
              <g
                key={i}
                transform={`translate(20 ${y})`}
                className={`ct-rail-node ${activeIndex === i ? "ct-rail-node--active" : ""} ${
                  filled[FIELDS[i].name] ? "ct-rail-node--filled" : ""
                }`}
              >
                <circle r="9" className="ct-rail-node-bg" />
                {i === 0 && (
                  <path d="M-4 3.5c0-2.2 1.8-4 4-4s4 1.8 4 4M0 -0.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" className="ct-rail-icon" />
                )}
                {i === 1 && (
                  <path d="M-4.5 -2.5h9v5h-9v-5zM-4.5 -2.5l4.5 3.2 4.5 -3.2" className="ct-rail-icon" />
                )}
                {i === 2 && (
                  <path d="M-4.5 -3h9a1 1 0 011 1v3.5a1 1 0 01-1 1h-6l-3 2.2v-2.2h-0.5a1 1 0 01-1-1v-3.5a1 1 0 011-1z" className="ct-rail-icon" />
                )}
              </g>
            ))}

            <g ref={railDotRef} transform="translate(20 10)" style={{ opacity: 0.35 }}>
              <circle ref={railRingRef} r="9" className="ct-rail-ring" />
              <circle r="6" className="ct-rail-dot" />
            </g>
          </svg>

          <form onSubmit={onSubmit} className="ct-form">
            {FIELDS.map((field, i) =>
              field.textarea ? (
                <div className="form-field form-field--area" key={field.id}>
                  <textarea
                    name={field.name}
                    id={field.id}
                    rows="6"
                    required
                    onFocus={(e) => handleFocus(e, i)}
                    onBlur={handleBlur}
                    onInput={(e) => handleInput(e, i, field.name)}
                  />
                  <label htmlFor={field.id} className="form-label">
                    {field.label}
                  </label>
                  <span className="form-underline" />
                </div>
              ) : (
                <div className="form-field" key={field.id}>
                  <input
                    type={field.type}
                    name={field.name}
                    id={field.id}
                    required
                    onFocus={(e) => handleFocus(e, i)}
                    onBlur={handleBlur}
                    onInput={(e) => handleInput(e, i, field.name)}
                  />
                  <label htmlFor={field.id} className="form-label">
                    {field.label}
                  </label>
                  <span className="form-underline" />
                </div>
              )
            )}

            <button
              type="submit"
              className={`contact-submit contact-submit--${status}`}
              ref={btnRef}
              disabled={status === "loading"}
            >
              <span className="btn-label" ref={btnLabelRef}>
                {status === "success" ? "Sent" : status === "error" ? "Try again" : "Submit now"}
              </span>

              {status === "loading" && (
                <svg ref={spinnerRef} className="btn-spinner" viewBox="0 0 24 24" width="18" height="18">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeDasharray="40"
                    strokeDashoffset="10"
                    strokeLinecap="round"
                  />
                </svg>
              )}

              {status === "success" && (
                <svg className="btn-check" viewBox="0 0 24 24" width="18" height="18">
                  <path
                    d="M4 12.5l5 5L20 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}