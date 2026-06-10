import type { APIRoute } from "astro";
import { cachedStatus } from "@lib/status";

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(cachedStatus), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=30, stale-while-revalidate=120",
    },
  });
};
