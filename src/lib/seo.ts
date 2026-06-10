export type PageMeta = {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
};

export const defaultMeta: PageMeta = {
  title: "VEDANT LAB - Vedant Somani",
  description:
    "Engineering portfolio of Vedant Somani: drones, ESP32 telemetry, Rust security prototypes, 3D printed hardware, and the failures behind them.",
  image: "/visuals/proof-archive.svg",
};

export function pageTitle(title?: string) {
  return title ? `${title} - Vedant Lab` : defaultMeta.title;
}
