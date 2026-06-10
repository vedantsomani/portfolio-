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

export const cachedStatus: NodeStatus = {
  nodeId: "esp32-s3-01",
  mode: "cached",
  lastSeen: "2026-06-10T09:42:11+05:30",
  temperatureC: 22.8,
  humidity: 48,
  voltage: 3.31,
  rssiDbm: -58,
  source: "static fallback payload",
};
