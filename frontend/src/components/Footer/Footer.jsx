import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaLinkedinIn, FaInstagram, FaGithub, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import "./Footer.css";
import footer_logo from "../../assets/footer_logo.svg";
import user_icon from "../../assets/user_icon.svg";
import { assets } from "../../assets/assets";

gsap.registerPlugin(ScrollTrigger);

// Replace these with your real profile URLs
const SOCIALS = [
  { name: "LinkedIn", icon: FaLinkedinIn, url: "https://linkedin.com/in/abhijitgodase" },
  { name: "Instagram", icon: FaInstagram, url: "https://instagram.com/abhijitgodase" },
  { name: "GitHub", icon: FaGithub, url: "https://github.com/abhijitgodase" },
  { name: "Mail", icon: FaEnvelope, url: "mailto:abhijitgodase04.10@gmail.com" },
  { name: "WhatsApp", icon: FaWhatsapp, url: "https://wa.me/917489873816" },
];

const Footer = () => {
  const rootRef = useRef(null);
  const subscribeRef = useRef(null);
  const subscribeLabelRef = useRef(null);
  const [subscribed, setSubscribed] = useState(false);

  /* Scroll-triggered entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(".footer-logo-mark", { opacity: 0, y: 16, duration: 0.5, ease: "power2.out" })
        .from(".ppp", { opacity: 0, scale: 0.8, duration: 0.5, ease: "back.out(1.7)" }, "-=0.3")
        .from(".footer-bio", { opacity: 0, y: 16, duration: 0.5, ease: "power2.out" }, "-=0.3")
        .from(".footer-email-input", { opacity: 0, x: 24, duration: 0.5, ease: "power2.out" }, "-=0.4")
        .from(".footer-subscribe", { opacity: 0, x: 24, duration: 0.5, ease: "power2.out" }, "-=0.35")
        .from(
          ".footer-social-icon",
          { opacity: 0, y: 16, scale: 0.6, duration: 0.4, stagger: 0.08, ease: "back.out(2)" },
          "-=0.2"
        )
        .from(".footer-bottom-left", { opacity: 0, duration: 0.4, ease: "power2.out" }, "-=0.1")
        .from(
          ".footer-bottom-right p",
          { opacity: 0, y: 10, duration: 0.4, stagger: 0.08, ease: "power2.out" },
          "-=0.3"
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handleIconEnter = (e) => {
    gsap.to(e.currentTarget, { y: -5, scale: 1.12, duration: 0.25, ease: "back.out(2)" });
  };

  const handleIconLeave = (e) => {
    gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" });
  };

  const handleSubscribeClick = () => {
    if (subscribed) return;

    gsap.to(subscribeRef.current, { scale: 0.94, duration: 0.1, ease: "power1.out" });
    gsap.to(subscribeRef.current, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.4)", delay: 0.1 });

    gsap.to(subscribeLabelRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.15,
      onComplete: () => {
        setSubscribed(true);
        gsap.fromTo(
          subscribeLabelRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
        );
      },
    });

    setTimeout(() => {
      gsap.to(subscribeLabelRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.15,
        onComplete: () => {
          setSubscribed(false);
          gsap.fromTo(
            subscribeLabelRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
          );
        },
      });
    }, 2200);
  };

  return (
    <div id="footer" className="footer" ref={rootRef}>
      <div className="footer-top">
        <div className="footer-top-left">
          {/* <img className="footer-logo-mark" src={footer_logo} alt="Logo" /> */}
          <span className="footer-logo-mark">Abhijit<span className="footer-logo-mark-dot">.</span></span>
          <img className="ppp" src={assets.ProfilePic} alt="" />
          <p className="footer-bio">
            I am a Full Stack developer, I am in 3rd year pursuing Computer Engineering at GCOEARA
          </p>
        </div>
        <div className="footer-top-right">
          <div className="footer-email-input">
            <img src={user_icon} alt="" />
            <input type="email" placeholder="Enter your email" />
          </div>
          <button
            type="button"
            className="footer-subscribe"
            ref={subscribeRef}
            onClick={handleSubscribeClick}
          >
            <span ref={subscribeLabelRef}>{subscribed ? "Subscribed!" : "Subscribe"}</span>
          </button>
        </div>
      </div>

      <div className="footer-social">
        <p className="footer-social-label">Connect with me</p>
        <div className="footer-social-icons">
          {SOCIALS.map(({ name, icon: Icon, url }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="footer-social-icon"
              aria-label={name}
              onMouseEnter={handleIconEnter}
              onMouseLeave={handleIconLeave}
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>

      <hr />

      <div className="footer-bottom">
        <p className="footer-bottom-left">© 2025 Abhijit Godase. All rights reserved.</p>
        <div className="footer-bottom-right">
          <p>Terms of Service</p>
          <p>Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;