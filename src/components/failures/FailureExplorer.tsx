import { ChevronDown, ExternalLink, Filter } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import React, { useMemo, useState } from "react";

export type FailureTicket = {
  slug: string;
  failureId: string;
  title: string;
  system: string;
  severity: "low" | "medium" | "high";
  status: string;
  detectedAt: string;
  summary: string;
  symptom: string;
  cause: string;
  fix: string;
  lesson: string;
  tags: string[];
  href: string;
  evidence: { label: string; href: string }[];
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

export default function FailureExplorer({
  failures,
  showFilter = false,
}: {
  failures: FailureTicket[];
  showFilter?: boolean;
}) {
  const [tag, setTag] = useState("all");
  const [openSlug, setOpenSlug] = useState<string>("");
  const tags = useMemo(
    () => ["all", ...Array.from(new Set(failures.flatMap((failure) => failure.tags)))],
    [failures],
  );
  const visible = tag === "all" ? failures : failures.filter((failure) => failure.tags.includes(tag));

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}>
      <div className="ticket-wall">
        {showFilter && (
          <div className="ticket-filters" aria-label="Failure filters">
            <span>
              <Filter size={16} aria-hidden="true" />
              Filter
            </span>
            {tags.map((item) => (
              <button
                key={item}
                type="button"
                className={item === tag ? "is-active" : ""}
                onClick={() => setTag(item)}
                aria-pressed={item === tag}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        <div className="ticket-list">
          {visible.map((failure) => {
            const open = failure.slug === openSlug;
            return (
              <article className={`ticket severity-${failure.severity} ${open ? "is-open" : ""}`} key={failure.slug}>
                <button
                  type="button"
                  className="ticket-head"
                  aria-expanded={open}
                  onClick={() => setOpenSlug(open ? "" : failure.slug)}
                >
                  <span className="ticket-id mono-value">{failure.failureId}</span>
                  <span className="ticket-titles">
                    <strong>{failure.title}</strong>
                    <small>
                      SYS: {failure.system} / {formatDate(failure.detectedAt)}
                    </small>
                  </span>
                  <span className={`ticket-severity severity-${failure.severity}`}>{failure.severity}</span>
                  <ChevronDown className={open ? "is-open" : ""} size={19} aria-hidden="true" />
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      className="ticket-body"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <dl>
                        <div>
                          <dt>Symptom</dt>
                          <dd>{failure.symptom}</dd>
                        </div>
                        <div>
                          <dt>Cause</dt>
                          <dd>{failure.cause}</dd>
                        </div>
                        <div>
                          <dt>Fix</dt>
                          <dd>{failure.fix}</dd>
                        </div>
                        <div>
                          <dt>Lesson</dt>
                          <dd>{failure.lesson}</dd>
                        </div>
                      </dl>
                      <div className="ticket-foot">
                        <div className="ticket-evidence">
                          <span>Evidence:</span>
                          {failure.evidence.length > 0 ? (
                            failure.evidence.map((item) => (
                              <a key={item.href + item.label} href={item.href}>
                                {item.label}
                              </a>
                            ))
                          ) : (
                            <em>capture pending</em>
                          )}
                        </div>
                        <a className="ticket-link" href={failure.href}>
                          Full report
                          <ExternalLink size={15} aria-hidden="true" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </div>
    </MotionConfig>
  );
}
