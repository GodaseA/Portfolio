import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import "./HangingIdCard.css";

/* ─── Layout constants (SVG user-space units) ─────────── */
const ANCHOR = { x: 200, y: 12 };
const REST = { x: 200, y: 206 };
const REST_DIST = REST.y - ANCHOR.y; // natural hang distance
const MAX_LENGTH = REST_DIST + 130; // how far the rope can be pulled before going taut
const CARD_W = 220;
const CARD_H = 150;

export default function HangingIdCard() {
  const svgRef = useRef(null);
  const cardGroupRef = useRef(null);
  const ropeRef = useRef(null);
  const clipRef = useRef(null);

  const pos = useRef({ ...REST }); // current attach point (top of the clip)
  const dragging = useRef(false);
  const activeTween = useRef(null);
  const idleTween = useRef(null);

  /* Convert a pointer event to SVG user-space coordinates */
  const toSvgPoint = useCallback((clientX, clientY) => {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: clientX, y: clientY };
    const p = pt.matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  }, []);

  /* Draw the rope + card at the current pos */
  const render = useCallback(() => {
    const { x: cx, y: cy } = pos.current;
    const { x: ax, y: ay } = ANCHOR;

    const dist = Math.hypot(cx - ax, cy - ay);
    const slack = Math.max(0, REST_DIST - dist);
    const sag = slack * 0.55 + 6;
    const midX = (ax + cx) / 2;
    const midY = (ay + cy) / 2 + sag;

    if (ropeRef.current) {
      ropeRef.current.setAttribute("d", `M ${ax} ${ay} Q ${midX} ${midY} ${cx} ${cy}`);
    }

    const angle = Math.max(-32, Math.min(32, ((cx - ax) / MAX_LENGTH) * 40));

    if (clipRef.current) {
      clipRef.current.setAttribute("transform", `translate(${cx} ${cy})`);
    }
    if (cardGroupRef.current) {
      cardGroupRef.current.setAttribute(
        "transform",
        `translate(${cx - CARD_W / 2} ${cy + 10}) rotate(${angle} ${CARD_W / 2} -10)`
      );
    }
  }, []);

  useEffect(() => {
    render();
    startIdleSway();
    return () => {
      activeTween.current?.kill();
      idleTween.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startIdleSway() {
    idleTween.current?.kill();
    const proxy = { t: 0 };
    idleTween.current = gsap.to(proxy, {
      t: 1,
      duration: 3.2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      onUpdate: () => {
        if (dragging.current) return;
        const sway = Math.sin(proxy.t * Math.PI) * 8 - 4;
        pos.current.x = REST.x + sway;
        pos.current.y = REST.y;
        render();
      },
    });
  }

  const handlePointerDown = (e) => {
    e.preventDefault();
    dragging.current = true;
    activeTween.current?.kill();
    idleTween.current?.pause();
    svgRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragging.current) return;
    const p = toSvgPoint(e.clientX, e.clientY);
    const dx = p.x - ANCHOR.x;
    const dy = p.y - ANCHOR.y;
    const dist = Math.hypot(dx, dy);

    if (dist > MAX_LENGTH) {
      const ratio = MAX_LENGTH / dist;
      pos.current.x = ANCHOR.x + dx * ratio;
      pos.current.y = ANCHOR.y + dy * ratio;
    } else {
      pos.current.x = p.x;
      pos.current.y = p.y;
    }
    render();
  };

  const handlePointerUp = (e) => {
    if (!dragging.current) return;
    dragging.current = false;
    svgRef.current.releasePointerCapture(e.pointerId);

    const proxy = { x: pos.current.x, y: pos.current.y };
    activeTween.current = gsap.to(proxy, {
      x: REST.x,
      y: REST.y,
      duration: 1.3,
      ease: "elastic.out(1, 0.32)",
      onUpdate: () => {
        pos.current.x = proxy.x;
        pos.current.y = proxy.y;
        render();
      },
      onComplete: () => {
        idleTween.current?.restart();
      },
    });
  };

  return (
    <div className="hid-root" aria-hidden="false">
      <svg
        ref={svgRef}
        className="hid-svg"
        viewBox="0 0 400 340"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <defs>
          <filter id="hidShadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Anchor hook */}
        <rect x={ANCHOR.x - 14} y={0} width={28} height={10} rx={3} fill="#2a2a2e" />
        <circle cx={ANCHOR.x} cy={ANCHOR.y} r={3} fill="#3a3a3f" />

        {/* Rope */}
        <path ref={ropeRef} className="hid-rope" fill="none" />

        {/* Clip connecting rope to card */}
        <g ref={clipRef}>
          <rect x={-9} y={-4} width={18} height={16} rx={4} className="hid-clip" />
          <circle cx={0} cy={2} r={2.5} fill="#0a0a0b" />
        </g>

        {/* Draggable card */}
        <g
          ref={cardGroupRef}
          className="hid-card-group"
          onPointerDown={handlePointerDown}
          filter="url(#hidShadow)"
        >
          <rect width={CARD_W} height={CARD_H} rx={14} className="hid-card-bg" />

          {/* top accent band */}
          <path
            d={`M0 14 Q0 0 14 0 H${CARD_W - 14} Q${CARD_W} 0 ${CARD_W} 14 V32 H0 Z`}
            className="hid-card-band"
          />
          <text x={CARD_W / 2} y={22} textAnchor="middle" className="hid-band-text">
            VERIFIED
          </text>

          {/* avatar */}
          <circle cx={40} cy={68} r={22} className="hid-avatar-ring" />
          <text x={40} y={74} textAnchor="middle" className="hid-avatar-text">
            AG
          </text>

          {/* name + title */}
          <text x={76} y={62} className="hid-name">
            ABHIJIT GODASE
          </text>
          <text x={76} y={80} className="hid-title">
            Full-Stack Developer
          </text>

          {/* details */}
          <line x1={18} y1={102} x2={CARD_W - 18} y2={102} className="hid-divider" />
          <text x={18} y={118} className="hid-detail">
            Based in Pune, India
          </text>
          <text x={18} y={134} className="hid-detail">
            MERN · TypeScript · GSAP
          </text>

          {/* barcode */}
          <g transform={`translate(${CARD_W - 70} 108)`}>
            {[2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2].map((w, i) => {
              const x = i * 4;
              return (
                <rect key={i} x={x} y={0} width={w} height={26} className="hid-barcode" />
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
}