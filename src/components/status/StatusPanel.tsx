import { RefreshCw, Signal, WifiOff } from "lucide-react";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

export type NodeStatus = {
  nodeId: string;
  mode: "live" | "cached" | "offline";
  lastSeen: string;
  temperatureC: number;
  humidity: number;
  voltage: number;
  rssiDbm: number;
  source: string;
};

function formatSeen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function StatusPanel({
  initialStatus,
  accent = "#22c55e",
}: {
  initialStatus: NodeStatus;
  accent?: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/status", { headers: { accept: "application/json" } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus((await response.json()) as NodeStatus);
    } catch {
      setError("Status endpoint unavailable");
      setStatus((current) => ({ ...current, mode: "offline" }));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const metrics = useMemo(
    () => [
      { label: "Temperature", value: `${status.temperatureC.toFixed(1)} C` },
      { label: "Humidity", value: `${status.humidity}%` },
      { label: "Voltage", value: `${status.voltage.toFixed(2)} V` },
      { label: "RSSI", value: `${status.rssiDbm} dBm` },
    ],
    [status],
  );

  const style = { "--accent": accent } as CSSProperties;
  const Icon = status.mode === "offline" ? WifiOff : Signal;

  return (
    <section className={`status-panel status-${status.mode}`} style={style} aria-label="ESP32 node status">
      <div className="status-panel-top">
        <div>
          <p className="micro-label">Node Telemetry</p>
          <h2>{status.nodeId}</h2>
        </div>
        <button className="button button-icon" type="button" onClick={refresh} aria-label="Refresh status">
          <RefreshCw size={18} aria-hidden="true" className={loading ? "is-spinning" : ""} />
        </button>
      </div>

      <div className="status-mode" aria-live="polite">
        <span className="status-dot" aria-hidden="true" />
        <Icon size={19} aria-hidden="true" />
        <strong>{status.mode}</strong>
        <span>{error ?? status.source}</span>
      </div>

      <div className="status-metrics">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <span>{metric.label}</span>
            <strong className="mono-value">{metric.value}</strong>
          </div>
        ))}
      </div>

      <p className="status-seen">
        Last seen <span className="mono-value">{formatSeen(status.lastSeen)}</span>
      </p>
    </section>
  );
}
