import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ScrollSequence.css";
import frames from "../../assets/frames";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = frames.length;
const SCROLL_DISTANCE = 1000;
const dr = 0.2;

// Height of your fixed/sticky navbar. Bump this if the navbar height changes.
const NAVBAR_HEIGHT = 50;
// Extra breathing room below the navbar before the image content starts.
const NAV_BUFFER = 30;
const TOP_OFFSET = NAVBAR_HEIGHT + NAV_BUFFER;

function useImagePreloader(sources) {
  const [images, setImages] = useState([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loaded = new Array(sources.length);
    let count = 0;

    sources.forEach((src, i) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = img.onerror = () => {
        if (cancelled) return;
        loaded[i] = img;
        count += 1;
        setLoadedCount(count);
        if (count === sources.length) {
          setImages(loaded);
          setIsReady(true);
        }
      };
      img.src = src;
    });

    return () => {
      cancelled = true;
    };
  }, [sources]);

  return { images, loadedCount, total: sources.length, isReady };
}

// topOffset (in device pixels) pushes the drawn image down within the
// canvas, so content that would otherwise sit under a fixed navbar moves
// into view instead.
function drawCover(ctx, img, canvasWidth, canvasHeight, topOffset = 0) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = canvasWidth / canvasHeight;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (canvasRatio > imgRatio) {
    drawWidth = canvasWidth;
    drawHeight = canvasWidth / imgRatio;
    offsetX = 0;
    offsetY = (canvasHeight - drawHeight) / 2;
  } else {
    drawHeight = canvasHeight;
    drawWidth = canvasHeight * imgRatio;
    offsetX = (canvasWidth - drawWidth) / 2;
    offsetY = 0;
  }

  offsetY += topOffset;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

export default function ScrollSequence() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);
  const leftSubTextRef = useRef(null);
  const rightSubTextRef = useRef(null);
  const counterRef = useRef(null);
  const scrubRef = useRef(null);
  const currentFrameRef = useRef(0);

  const { images, loadedCount, total, isReady } = useImagePreloader(frames);

  const draw = useCallback(
    (index) => {
      const canvas = canvasRef.current;
      const img = images[index];
      if (!canvas || !img) return;
      const ctx = canvas.getContext("2d");
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      drawCover(ctx, img, canvas.width, canvas.height, TOP_OFFSET * dpr);
    },
    [images]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = section.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      draw(currentFrameRef.current);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(section);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => {
    if (images[0]) draw(0);
  }, [images, draw]);

  // Single timeline for perfect synchronization between the frame sequence
  // and the text animations.
  useEffect(() => {
    if (!isReady) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${SCROLL_DISTANCE}`, //1000
          pin: true,
          scrub: 1,
          pinSpacing: true,
           refreshPriority: 1,
          onUpdate: (self) => {
            const index = Math.min(
              FRAME_COUNT - 1,
              Math.floor(self.progress * FRAME_COUNT)
            );

            if (scrubRef.current) {
              scrubRef.current.style.width = `${self.progress * 100}%`;
            }

            if (index !== currentFrameRef.current) {
              currentFrameRef.current = index;
              draw(index);
              if (counterRef.current) {
                counterRef.current.textContent = `${String(
                  index + 1
                ).padStart(3, "0")} / ${FRAME_COUNT}`;
              }
            }
          },
        },
      } );

      if (!prefersReducedMotion) {
        tl.fromTo(
          leftTextRef.current,
          { opacity: 0, x: -80, y: 20 },
          { opacity: 1, x: 0, y: 0, duration: 0.4, ease: "power2.out" },
          0
        );

        tl.fromTo(
          leftSubTextRef.current,
          { opacity: 0, x: -60, y: 10 },
          { opacity: 0.85, x: 0, y: 0, duration: 0.8, ease: "power2.out" },
          0.4
        );

        tl.fromTo(
          rightTextRef.current,
          { opacity: 0, x: 80, y: 20 },
          { opacity: 1, x: 0, y: 0, duration: 1, ease: "power2.out" },
          0.8
        );

        tl.fromTo(
          rightSubTextRef.current,
          { opacity: 0, x: 60, y: 10 },
          { opacity: 0.8, x: 0, y: 0, duration: 1, ease: "power2.out" },
          1.2
        );

        tl.fromTo(
          ".scroll-indicator",
          { opacity: 0, y: 10 },
          { opacity: 0.5, y: 0, duration: 1, ease: "power1.out" },
          0.7
        );
      } else {
        gsap.set(
          [
            leftTextRef.current,
            rightTextRef.current,
            leftSubTextRef.current,
            rightSubTextRef.current,
            counterRef.current,
            ".scroll-indicator",
          ],
          {
            opacity: 1,
            x: 0,
            y: 0,
          }
        );
      }
    }, sectionRef);
requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [isReady, draw]);

  const progressPct = total ? Math.round((loadedCount / total) * 100) : 0;

  return (
    <section ref={sectionRef} className="sequence" id="hero">
      {!isReady && (
        <div className="sequence-loader" role="status" aria-live="polite">
          <div className="sequence-loader-bar">
            <div
              className="sequence-loader-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="sequence-loader-label">{progressPct}%</span>
        </div>
      )}

      <canvas ref={canvasRef} className="sequence-canvas" aria-hidden="true" />

      <div className="sequence-overlay">
        <header className="sequence-topbar">
          <span className="wordmark">...godase</span>
          <span className="frame-counter" ref={counterRef}>
            {`001 / ${FRAME_COUNT}`}
          </span>
        </header>

        <div className="sequence-main">
          <div className="content-left">
            <div className="text-block left-text" ref={leftTextRef}>
              <p className="eyebrow">Scroll to experience</p>
              <h1 className="hi-text">
                HI, I&apos;M
                <br />
                <span>ABHIJIT</span>
              </h1>
            </div>

            <div className="text-block left-subtext" ref={leftSubTextRef}>
              <p className="pos-text">FULL-STACK DEVELOPER</p>
              <p className="tagline">Crafting digital experiences</p>
            </div>
          </div>

          <div className="content-right">
            <div className="text-block right-text" ref={rightTextRef}>
              <p className="description">
                I build fast, considered interfaces &mdash; and the systems
                that keep them running underneath.
              </p>
            </div>

            <div className="text-block right-subtext" ref={rightSubTextRef}>
              <div className="content-right-links">
                <a href="#projects">
                  View Work <span aria-hidden="true">&rarr;</span>
                </a>
                <a href="#footer">
                  Let's Talk <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <span>Keep scrolling</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </div>

      <div className="sequence-scrub" aria-hidden="true">
        <div className="sequence-scrub-fill" ref={scrubRef} />
      </div>
    </section>
  );
}