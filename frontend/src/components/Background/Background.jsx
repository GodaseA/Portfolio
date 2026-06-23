import { useEffect, useRef, useState, useCallback } from "react";
import Globe from "react-globe.gl";
import "./GlobeBackground.css";

export default function GlobeBackground() {
  const globeEl = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  /* Measure container, not window — works in any layout */
  const updateSize = useCallback(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  useEffect(() => {
    updateSize();

    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [updateSize]);

  /* Globe controls — runs after dimensions are set */
  useEffect(() => {
    if (!globeEl.current || dimensions.width === 0) return;

    const controls = globeEl.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false; // decorative only — disable manual drag
  }, [dimensions]);

  return (
    <div className="globe-bg" ref={containerRef} aria-hidden="true">
      {/* Fade-in wrapper */}
      <div className={`globe-bg__canvas ${isLoaded ? "globe-bg__canvas--visible" : ""}`}>
        {dimensions.width > 0 && (
          <Globe
            ref={globeEl}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            backgroundColor="rgba(0,0,0,0)"
            animateIn={false}        /* we handle our own fade */
            width={dimensions.width}
            height={dimensions.height}
            onGlobeReady={() => setIsLoaded(true)}
          />
        )}
      </div>

      {/* Vignette overlays — blend globe into page */}
      <div className="globe-bg__vignette globe-bg__vignette--radial" />
      <div className="globe-bg__vignette globe-bg__vignette--bottom"  />
      <div className="globe-bg__vignette globe-bg__vignette--top"     />
    </div>
  );
}