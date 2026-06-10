import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const metricSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const timelineSchema = z.object({
  time: z.string(),
  title: z.string(),
  body: z.string(),
});

const factSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const seoSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    eyebrow: z.string(),
    summary: z.string(),
    status: z.string(),
    accent: z.enum(["drone", "vajra", "esp32", "fabrication"]),
    accentColor: z.string(),
    secondaryColor: z.string().optional(),
    visual: z.string(),
    visualAlt: z.string(),
    href: z.string(),
    metrics: z.array(metricSchema),
    facts: z.array(factSchema),
    timeline: z.array(timelineSchema),
    stack: z.array(z.string()),
    proofIds: z.array(z.string()),
    seo: seoSchema,
  }),
});

const failures = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/failures" }),
  schema: z.object({
    failureId: z.string(),
    title: z.string(),
    order: z.number(),
    status: z.string(),
    severity: z.enum(["low", "medium", "high"]),
    system: z.string(),
    detectedAt: z.string(),
    summary: z.string(),
    symptom: z.string(),
    rootCause: z.string(),
    fix: z.string(),
    lesson: z.string(),
    relatedProofIds: z.array(z.string()),
    tags: z.array(z.string()),
    seo: seoSchema,
  }),
});

export const collections = {
  projects,
  failures,
};
