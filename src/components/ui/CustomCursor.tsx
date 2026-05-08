"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trail = trailRef.current;
    if (!cursor || !trail) return;

    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    };

    const animateTrail = () => {
      trailX += (mouseX - trailX) * 0.15;
      trailY += (mouseY - trailY) * 0.15;
      trail.style.left = `${trailX}px`;
      trail.style.top = `${trailY}px`;
      requestAnimationFrame(animateTrail);
    };

    const handleMouseDown = () => {
      cursor.style.transform = "translate(-50%, -50%) scale(0.8)";
      trail.style.transform = "translate(-50%, -50%) scale(1.5)";
    };

    const handleMouseUp = () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
      trail.style.transform = "translate(-50%, -50%) scale(1)";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    animateTrail();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "#39FF14",
          boxShadow: "0 0 10px #39FF14, 0 0 20px #39FF14, 0 0 40px rgba(57,255,20,0.4)",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          transition: "transform 0.15s ease, width 0.15s ease, height 0.15s ease",
          mixBlendMode: "screen",
        }}
      />
      {/* Trail / glow ring */}
      <div
        ref={trailRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "1.5px solid rgba(57, 255, 20, 0.4)",
          boxShadow: "0 0 15px rgba(57, 255, 20, 0.15)",
          pointerEvents: "none",
          zIndex: 9998,
          transform: "translate(-50%, -50%)",
          transition: "transform 0.3s ease, width 0.3s ease, height 0.3s ease",
        }}
      />
    </>
  );
}
