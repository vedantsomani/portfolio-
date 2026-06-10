import { motion, useScroll, useSpring } from "motion/react";
import React from "react";
import { useRef } from "react";
import type { CSSProperties } from "react";

export type TimelineEvent = {
  time: string;
  title: string;
  body: string;
};

export default function Timeline({ events, accent }: { events: TimelineEvent[]; accent: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 25%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 22, mass: 0.2 });
  const style = { "--accent": accent } as CSSProperties;

  return (
    <ol ref={ref} className="timeline-list" style={style}>
      <motion.span className="timeline-progress" style={{ scaleY }} aria-hidden="true" />
      {events.map((event, index) => (
        <motion.li
          className="timeline-event"
          key={`${event.time}-${event.title}`}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ delay: index * 0.04, duration: 0.22 }}
        >
          <span className="timeline-dot" aria-hidden="true" />
          <div>
            <p className="mono-value">{event.time}</p>
            <h3>{event.title}</h3>
            <p>{event.body}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
