import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    service: "wisperaway-web",
    status: "ok",
    version: "0.1.0",
  });
}
