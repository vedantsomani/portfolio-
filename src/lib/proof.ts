export type AccentKey = "drone" | "vajra" | "esp32" | "fabrication" | "failure" | "proof";

export type ProofArtifact = {
  id: string;
  title: string;
  mission: string;
  type: "log" | "screenshot" | "diagram" | "photo" | "code" | "cad" | "api";
  date: string;
  summary: string;
  href: string;
  media: string;
  mediaAlt: string;
  accent: AccentKey;
  status: "verified" | "cached" | "planned" | "needs-real-asset";
  tags: string[];
};

export const accentColors: Record<AccentKey, string> = {
  drone: "#f59e0b",
  vajra: "#38bdf8",
  esp32: "#22c55e",
  fabrication: "#f97316",
  failure: "#facc15",
  proof: "#60a5fa",
};

export const proofArtifacts: ProofArtifact[] = [
  {
    id: "drone-flightlog-23",
    title: "Flight Log 23 Replay",
    mission: "Drone Mission Replay",
    type: "log",
    date: "2026-06-09",
    summary: "Mission Planner replay markers for mode changes, optical-flow health, and controlled abort points.",
    href: "/projects/drone-mission-replay#evidence",
    media: "/visuals/drone-mission.svg",
    mediaAlt: "Diagram of a quadcopter mission timeline with sensor and abort markers.",
    accent: "drone",
    status: "needs-real-asset",
    tags: ["pixhawk", "mission-planner", "flight-log"],
  },
  {
    id: "drone-mp-01",
    title: "Mission Planner Screenshot Set",
    mission: "Drone Mission Replay",
    type: "screenshot",
    date: "2026-06-09",
    summary: "Placeholder frame for adding real Mission Planner screenshots and parameter captures.",
    href: "/projects/drone-mission-replay#evidence",
    media: "/visuals/proof-archive.svg",
    mediaAlt: "Archive grid with screenshot slots and telemetry chips.",
    accent: "drone",
    status: "needs-real-asset",
    tags: ["parameters", "screenshots"],
  },
  {
    id: "vajra-handshake-01",
    title: "VAJRA Handshake Graph",
    mission: "VAJRA Secure Link",
    type: "diagram",
    date: "2026-06-08",
    summary: "Protocol node map for key exchange, nonce handling, retransmission, and audit checkpoints.",
    href: "/projects/vajra-secure-link#evidence",
    media: "/visuals/vajra-link.svg",
    mediaAlt: "Secure communication graph with sender, verifier, and receiver nodes.",
    accent: "vajra",
    status: "verified",
    tags: ["rust", "protocol", "audit"],
  },
  {
    id: "vajra-code-02",
    title: "Rust Packet Inspector",
    mission: "VAJRA Secure Link",
    type: "code",
    date: "2026-06-08",
    summary: "Code evidence slot for parser traces, negative tests, and retry instrumentation.",
    href: "/projects/vajra-secure-link#evidence",
    media: "/visuals/proof-archive.svg",
    mediaAlt: "Proof archive panel with code and packet evidence rows.",
    accent: "vajra",
    status: "planned",
    tags: ["rust", "tests", "packets"],
  },
  {
    id: "esp32-status-01",
    title: "Cached ESP32 Status Contract",
    mission: "ESP32 Live Node",
    type: "api",
    date: "2026-06-10",
    summary: "A transparent cached status payload with node mode, last seen, voltage, RSSI, humidity, and temperature.",
    href: "/status",
    media: "/visuals/esp32-node.svg",
    mediaAlt: "ESP32 telemetry node diagram with sensor and radio values.",
    accent: "esp32",
    status: "cached",
    tags: ["esp32", "telemetry", "api"],
  },
  {
    id: "esp32-wiring-01",
    title: "Wiring Photo Slot",
    mission: "ESP32 Live Node",
    type: "photo",
    date: "2026-06-10",
    summary: "Reserved proof card for the real bench wiring photo and power notes.",
    href: "/projects/esp32-live-node#evidence",
    media: "/visuals/esp32-node.svg",
    mediaAlt: "ESP32 board connected to sensor and power rails.",
    accent: "esp32",
    status: "needs-real-asset",
    tags: ["wiring", "bench", "sensor"],
  },
  {
    id: "fabrication-cad-01",
    title: "Arm Bracket CAD Frame",
    mission: "Fabrication Bench",
    type: "cad",
    date: "2026-06-07",
    summary: "CAD-to-print evidence frame for iteration notes, tolerances, and failed-print learnings.",
    href: "/projects/fabrication-bench#evidence",
    media: "/visuals/fabrication-bench.svg",
    mediaAlt: "CAD bracket, print bed, caliper, and iteration markers.",
    accent: "fabrication",
    status: "needs-real-asset",
    tags: ["cad", "3d-printing", "tolerance"],
  },
  {
    id: "failure-wall-003",
    title: "FAIL-003 Optical Flow Health",
    mission: "Failure Wall",
    type: "log",
    date: "2026-06-09",
    summary: "Failure incident tying unstable optical-flow health to the next constrained test plan.",
    href: "/failures/fail-003-optical-flow-health",
    media: "/visuals/failure-wall.svg",
    mediaAlt: "Failure wall with incident rows and root cause notes.",
    accent: "failure",
    status: "verified",
    tags: ["optical-flow", "debugging", "root-cause"],
  },
];

export function getProofByIds(ids: string[]) {
  const lookup = new Map(proofArtifacts.map((artifact) => [artifact.id, artifact]));
  return ids.map((id) => lookup.get(id)).filter((item): item is ProofArtifact => Boolean(item));
}

export function getFeaturedProof(limit = 6) {
  return proofArtifacts.slice(0, limit);
}
