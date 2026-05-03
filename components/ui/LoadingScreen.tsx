"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const LETTERS = ["Z", "a", "y", "l", "o"];

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.45,
          ease: "power2.inOut",
          onComplete: () => setVisible(false),
        });
      },
    });

    // Letters drop in with stagger
    tl.fromTo(
      letterRefs.current,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.06,
        ease: "power3.out",
      }
    );

    // Underline draws in
    tl.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.4, ease: "power2.out" },
      "-=0.2"
    );

    // Hold, then collapse line
    tl.to(lineRef.current, {
      scaleX: 0,
      transformOrigin: "right center",
      duration: 0.3,
      ease: "power2.in",
      delay: 0.35,
    });

    // Letters float up and out
    tl.to(
      letterRefs.current,
      {
        y: -20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.04,
        ease: "power2.in",
      },
      "-=0.15"
    );

    return () => { tl.kill(); };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg-primary"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="flex" aria-label="Zaylo">
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              ref={(el) => { letterRefs.current[i] = el; }}
              className="text-largetitle font-bold tracking-[-0.04em] text-text-primary select-none"
              style={{ display: "inline-block" }}
            >
              {letter}
            </span>
          ))}
        </div>
        <div
          ref={lineRef}
          className="h-[2px] w-full rounded-full bg-apple-blue"
          style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
        />
      </div>
    </div>
  );
}
