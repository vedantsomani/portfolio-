import { ChevronDown, RefreshCw, Signal, WifiOff } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import React, { useEffect, useMemo, useState } from "react";
import type { NodeStatus } from "@lib/status";

// Static sample retained until the hardware feed is wired; the panel labels it as such.
const TEMP_TREND = [22.1, 22.4, 22.2, 22.5, 22.7, 22.6, 22.9, 22.8, 23.0, 22.8];

function relativeSeen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const diffMin = Math.round((Date.now() - date.getTime()) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 48) return `${diffHr} h ago`;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function Sparkline({ values }: { values: number[] }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * 200},${34 - ((v - min) / span) * 26}`)
    .join(" ");
  return (
    <svg viewBox="0 0 200 40" className="node-spark" aria-hidden="true">
      <polyline points={points} fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="200" cy={34 - ((values[values.length - 1] - min) / span) * 26} r="3" fill="#22c55e" />
    </svg>
  );
}

export default function NodePanel({ initialStatus }: { initialStatus: NodeStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonOpen, setJsonOpen] = useState(false);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/status", { headers: { accept: "application/json" } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus((await response.json()) as NodeStatus);
    } catch {
      setError("status endpoint unreachable");
      setStatus((current) => ({ ...current, mode: "offline" }));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const payload = useMemo(
    () =>
      JSON.stringify(
        {
          node: status.nodeId,
          status: status.mode === "offline" ? "offline" : "online",
          temperature_c: status.temperatureC,
          humidity_percent: status.humidity,
          voltage_v: status.voltage,
          wifi_rssi_dbm: status.rssiDbm,
          data_mode: status.mode,
          last_seen: status.lastSeen,
        },
        null,
        2,
      ),
    [status],
  );

  const modeLabel = status.mode.toUpperCase();
  const Icon = status.mode === "offline" ? WifiOff : Signal;

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
      <section className={`node-panel node-${status.mode}`} aria-label="ESP32 node telemetry">
        <div className="node-head">
          <div>
            <p className="micro-label">ESP32-S3 NODE #01</p>
            <div className="node-mode" aria-live="polite">
              <span className="node-dot" aria-hidden="true" />
              <Icon size={17} aria-hidden="true" />
              <strong>{modeLabel}</strong>
              <span>{error ?? status.source}</span>
            </div>
          </div>
          <button className="button button-icon" type="button" onClick={refresh} aria-label="Refresh node status">
            <RefreshCw size={17} aria-hidden="true" className={loading ? "is-spinning" : ""} />
          </button>
        </div>

        <div className="node-metrics">
          {[
            { label: "Temperature", value: `${status.temperatureC.toFixed(1)} °C` },
            { label: "Humidity", value: `${status.humidity} %` },
            { label: "Voltage", value: `${status.voltage.toFixed(2)} V` },
            { label: "Wi-Fi RSSI", value: `${status.rssiDbm} dBm` },
          ].map((metric) => (
            <div key={metric.label}>
              <span>{metric.label}</span>
              <strong className="mono-value">{metric.value}</strong>
            </div>
          ))}
        </div>

        <div className="node-trend">
          <div>
            <span>Temp trend</span>
            <small>{status.mode === "live" ? "live samples" : "cached sample window"}</small>
          </div>
          <Sparkline values={TEMP_TREND} />
        </div>

        <div className="node-foot">
          <span>
            Last update <strong className="mono-value">{relativeSeen(status.lastSeen)}</strong>
          </span>
          <button type="button" className="node-json-toggle" onClick={() => setJsonOpen((open) => !open)} aria-expanded={jsonOpen}>
            View JSON
            <ChevronDown size={16} aria-hidden="true" className={jsonOpen ? "is-open" : ""} />
          </button>
        </div>

        <AnimatePresence initial={false}>
          {jsonOpen && (
            <motion.div
              className="node-json"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <pre>
                <code>{payload}</code>
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </MotionConfig>
  );
}
