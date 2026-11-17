import { NextResponse } from "next/server";
import { getConfiguredProvidersCount } from "@/lib/ai/registry";

export async function GET() {
  const count = getConfiguredProvidersCount();

  return NextResponse.json(
    {
      status: "online",
      providersConfigured: count,
      timestamp: new Date().toISOString()
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Content-Type-Options": "nosniff"
      }
    }
  );
}
