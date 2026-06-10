import { motion, useInView, useReducedMotion } from "motion/react";
import React, { useRef } from "react";

const VIOLET = "#8b5cf6";
const CYAN = "#38bdf8";

export default function ProtocolGraph() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-18% 0px" });
  const animatePackets = inView && !reduce;

  return (
    <div className="proto" ref={ref}>
      <svg viewBox="0 0 560 250" className="proto-svg" role="img" aria-label="VAJRA handshake: Node A sends ML-KEM encapsulation to Node B, Node B replies ready, both derive a session key.">
        {/* Node A */}
        <g className={inView ? "proto-node is-on" : "proto-node"}>
          <rect x="22" y="58" width="112" height="110" rx="6" fill="rgba(13,17,23,0.92)" stroke={VIOLET} strokeWidth="1.5" />
          <text x="78" y="92" textAnchor="middle" className="proto-node-title">NODE A</text>
          <text x="78" y="114" textAnchor="middle" className="proto-node-sub">initiator</text>
          <circle cx="78" cy="140" r="4" fill={VIOLET} className="proto-node-dot" />
        </g>

        {/* Node B */}
        <g className={inView ? "proto-node is-on" : "proto-node"}>
          <rect x="426" y="58" width="112" height="110" rx="6" fill="rgba(13,17,23,0.92)" stroke={CYAN} strokeWidth="1.5" />
          <text x="482" y="92" textAnchor="middle" className="proto-node-title">NODE B</text>
          <text x="482" y="114" textAnchor="middle" className="proto-node-sub">responder</text>
          <circle cx="482" cy="140" r="4" fill={CYAN} className="proto-node-dot" />
        </g>

        {/* Lane 1: A -> B (ML-KEM) */}
        <motion.line
          x1="138"
          y1="92"
          x2="422"
          y2="92"
          stroke={VIOLET}
          strokeWidth="1.5"
          initial={{ opacity: 0.25 }}
          animate={inView ? { opacity: 0.85 } : undefined}
          transition={{ duration: 0.4 }}
        />
        <polygon points="422,92 412,87 412,97" fill={VIOLET} opacity={inView ? 0.9 : 0.3} />
        <text x="280" y="80" textAnchor="middle" className="proto-lane-label" fill={VIOLET}>
          ML-KEM ENCAPS →
        </text>
        {animatePackets ? (
          <motion.rect
            y="86.5"
            width="14"
            height="11"
            rx="2"
            fill={VIOLET}
            initial={{ x: 140, opacity: 0 }}
            animate={{ x: [140, 404], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.7, repeat: Infinity, repeatDelay: 1.4, ease: "linear", delay: 0.3 }}
          />
        ) : (
          <rect x="270" y="86.5" width="14" height="11" rx="2" fill={VIOLET} opacity="0.8" />
        )}

        {/* Lane 2: B -> A (READY) */}
        <motion.line
          x1="138"
          y1="136"
          x2="422"
          y2="136"
          stroke={CYAN}
          strokeWidth="1.5"
          initial={{ opacity: 0.25 }}
          animate={inView ? { opacity: 0.85 } : undefined}
          transition={{ duration: 0.4, delay: 0.15 }}
        />
        <polygon points="138,136 148,131 148,141" fill={CYAN} opacity={inView ? 0.9 : 0.3} />
        <text x="280" y="156" textAnchor="middle" className="proto-lane-label" fill={CYAN}>
          ← READY
        </text>
        {animatePackets ? (
          <motion.rect
            y="130.5"
            width="14"
            height="11"
            rx="2"
            fill={CYAN}
            initial={{ x: 404, opacity: 0 }}
            animate={{ x: [404, 140], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.7, repeat: Infinity, repeatDelay: 1.4, ease: "linear", delay: 1.85 }}
          />
        ) : (
          <rect x="270" y="130.5" width="14" height="11" rx="2" fill={CYAN} opacity="0.8" />
        )}

        {/* Session key */}
        <motion.g
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: reduce ? 0 : 0.7, duration: 0.35 }}
        >
          <rect x="170" y="194" width="220" height="34" rx="17" fill="rgba(13,17,23,0.92)" stroke="url(#proto-key-stroke)" strokeWidth="1.5" />
          <text x="280" y="215" textAnchor="middle" className="proto-key-label">⚷ SESSION KEY DERIVED</text>
        </motion.g>

        <defs>
          <linearGradient id="proto-key-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={VIOLET} />
            <stop offset="1" stopColor={CYAN} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
