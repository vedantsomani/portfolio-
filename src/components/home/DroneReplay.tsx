import { motion, useMotionValue, useReducedMotion, useScroll, useSpring } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

const ACCENT = "#f59e0b";

const EVENTS = [
  { time: "00:00", label: "Frame + Pixhawk setup", at: 0.02 },
  { time: "00:12", label: "Optical flow connected", at: 0.2 },
  { time: "00:25", label: "BAD OPTFLOW HEALTH detected", at: 0.4, warn: true },
  { time: "00:41", label: "Telemetry inspected", at: 0.58 },
  { time: "01:03", label: "Placement checked", at: 0.76 },
  { time: "01:20", label: "Next controlled test planned", at: 0.94 },
];

// Telemetry frames indexed by number of events passed (0..6).
const TELEM = [
  { alt: "0.0 m", flow: "INIT", range: "-", status: "SETUP", warn: false },
  { alt: "0.0 m", flow: "OK", range: "0.2 m", status: "BENCH", warn: false },
  { alt: "0.6 m", flow: "OK", range: "0.6 m", status: "HOVER", warn: false },
  { alt: "0.6 m", flow: "BAD HEALTH", range: "0.6 m", status: "HOLD", warn: true },
  { alt: "0.4 m", flow: "BAD HEALTH", range: "0.4 m", status: "INSPECT", warn: true },
  { alt: "0.0 m", flow: "RECHECK", range: "0.1 m", status: "BENCH", warn: false },
  { alt: "0.0 m", flow: "RETEST", range: "-", status: "PLANNED", warn: false },
];

const PATH_D = "M 28 268 C 90 150 150 92 232 96 C 304 100 330 168 392 158 C 452 148 484 96 564 88";

export default function DroneReplay() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [dots, setDots] = useState<{ x: number; y: number }[]>([]);
  const [passed, setPassed] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start 78%", "end 45%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const markerX = useMotionValue(28);
  const markerY = useMotionValue(268);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    setDots(
      EVENTS.map((event) => {
        const point = path.getPointAtLength(event.at * total);
        return { x: point.x, y: point.y };
      }),
    );

    if (reduce) {
      const end = path.getPointAtLength(total);
      markerX.set(end.x);
      markerY.set(end.y);
      setPassed(EVENTS.length);
      return;
    }

    return progress.on("change", (value) => {
      const clamped = Math.max(0, Math.min(1, value));
      const point = path.getPointAtLength(clamped * total);
      markerX.set(point.x);
      markerY.set(point.y);
      const count = EVENTS.filter((event) => clamped >= event.at).length;
      setPassed((current) => (current === count ? current : count));
    });
  }, [progress, reduce, markerX, markerY]);

  const telem = TELEM[passed] ?? TELEM[0];

  return (
    <div className="replay" ref={wrapRef}>
      <div className="replay-panel" role="img" aria-label="Replay of a drone test: setup, hover, optical-flow warning, inspection, and a planned retest.">
        <div className="replay-panel-head">
          <span className="replay-id">LOG 23 / F450</span>
          <span className="replay-mode">REPLAY</span>
        </div>
        <svg viewBox="0 0 600 320" className="replay-svg">
          <g stroke="rgba(245,158,11,0.1)" strokeWidth="1">
            {[64, 128, 192, 256].map((y) => (
              <line key={y} x1="0" y1={y} x2="600" y2={y} />
            ))}
            {[120, 240, 360, 480].map((x) => (
              <line key={x} x1={x} y1="0" x2={x} y2="320" />
            ))}
          </g>
          <line x1="16" y1="290" x2="584" y2="290" stroke="rgba(245,158,11,0.3)" strokeWidth="1.4" strokeDasharray="3 6" />
          <path d={PATH_D} fill="none" stroke="rgba(245,158,11,0.16)" strokeWidth="2" />
          <motion.path
            ref={pathRef}
            d={PATH_D}
            fill="none"
            stroke={ACCENT}
            strokeWidth="2.4"
            strokeLinecap="round"
            style={reduce ? undefined : { pathLength: progress }}
          />
          {dots.map((dot, i) => {
            const lit = passed > i;
            const warn = EVENTS[i].warn;
            return (
              <g key={EVENTS[i].time}>
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={lit ? 5.5 : 4}
                  fill={lit ? (warn ? "#facc15" : ACCENT) : "rgba(245,158,11,0.18)"}
                  stroke={warn && lit ? "#facc15" : ACCENT}
                  strokeWidth={lit ? 0 : 1}
                />
                {warn && lit && <circle cx={dot.x} cy={dot.y} r="10" fill="none" stroke="#facc15" strokeWidth="1.2" opacity="0.55" />}
              </g>
            );
          })}
          <motion.g style={{ x: markerX, y: markerY }}>
            <line x1="-7" y1="-7" x2="7" y2="7" stroke={ACCENT} strokeWidth="2" />
            <line x1="-7" y1="7" x2="7" y2="-7" stroke={ACCENT} strokeWidth="2" />
            <circle cx="-7" cy="-7" r="2.6" fill={ACCENT} />
            <circle cx="7" cy="-7" r="2.6" fill={ACCENT} />
            <circle cx="-7" cy="7" r="2.6" fill={ACCENT} />
            <circle cx="7" cy="7" r="2.6" fill={ACCENT} />
          </motion.g>
        </svg>
        <p className="replay-note">Scroll to replay / path follows flight log 23</p>
      </div>

      <div className="replay-side">
        <div className="replay-telem" aria-label="Telemetry readout">
          {[
            { label: "ALT", value: telem.alt, warn: false },
            { label: "FLOW", value: telem.flow, warn: telem.warn },
            { label: "RANGE", value: telem.range, warn: false },
            { label: "STATUS", value: telem.status, warn: telem.warn },
          ].map((cell) => (
            <div key={cell.label} className={cell.warn ? "is-warn" : ""}>
              <span>{cell.label}</span>
              <strong className="mono-value">{cell.value}</strong>
            </div>
          ))}
        </div>

        <ol className="replay-timeline">
          {EVENTS.map((event, i) => {
            const lit = passed > i;
            return (
              <li key={event.time} className={`${lit ? "is-lit" : ""} ${event.warn ? "is-warn" : ""}`}>
                <span className="replay-dot" aria-hidden="true" />
                <span className="mono-value">{event.time}</span>
                <span>{event.label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
