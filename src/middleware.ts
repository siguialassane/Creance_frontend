export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    // Protect everything except API routes, Next assets, static files, and login
    "/((?!api|_next|.*\\..*|login).*)",
  ],
};



