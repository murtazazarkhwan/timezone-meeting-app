import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  //console.log("tariq", forwardedFor);
  //console.log("ASd", request.headers);
  const ip =
    forwardedFor?.split(",")[0] ||
    request.ip || // will only work in prod, not dev
    "127.0.0.1"; // fallback for local

  const response = NextResponse.next();
  response.headers.set("x-client-ip", ip);
  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
