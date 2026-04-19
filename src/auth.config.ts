import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

const authUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL;
const useSecureCookies = authUrl
  ? authUrl.startsWith("https://")
  : process.env.NODE_ENV === "production";

type LoginResponse = {
  data?: {
    token: string;
    refreshToken: string;
    type: string;
    sessionId?: string;
    username: string;
    fullName: string;
    email: string;
    roles: string[];
    privileges: string[];
    expiresAt: string; // ISO
    message?: string;
    success?: boolean;
  };
  message?: string;
  status?: string;
  error?: { code?: string; details?: string; path?: string };
  timestamp?: string;
};

async function loginWithCredentials(username: string, password: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  console.log("🔐 [NextAuth] Login attempt using API URL:", baseUrl);
  console.log("   -> Env var NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    // Important to avoid caching credentials
    cache: "no-store",
  });

  let json: LoginResponse | undefined;
  try {
    json = (await res.json()) as LoginResponse;
  } catch {
    // no-op
  }

  if (!res.ok) {
    const message = json?.error?.details || json?.message || "INVALID_CREDENTIALS";
    throw new Error(message);
  }

  const payload = json?.data;

  if (!payload?.token) {
    const message = payload?.message || json?.message || "INVALID_RESPONSE";
    throw new Error(message);
  }

  return {
    id: payload.username || payload.email,
    name: payload.fullName,
    email: payload.email,
    username: payload.username,
    sessionId: payload.sessionId ?? payload.username,
    accessToken: payload.token,
    refreshToken: payload.refreshToken,
    tokenType: payload.type || 'Bearer',
    accessTokenExpiresAt: payload.expiresAt,
  } as const;
}

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        maxAge: 60 * 60 * 24 * 30, // 30 jours (aligné avec le refresh token)
      },
    },
  },
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const username = credentials?.username as string;
          const password = credentials?.password as string;
          if (!username || !password) return null;
          const user = await loginWithCredentials(username, password);
          return user;
        } catch (e) {
          // Propagate backend error message to the client result.error
          throw e as Error;
        }
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      if (pathname.startsWith("/api/auth")) {
        return true;
      }

      return !!auth?.user;
    },
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        // Store the complete token structure including accessToken
        token.user = {
          id: (user as any).id,
          name: (user as any).name,
          email: (user as any).email,
          username: (user as any).username,
        };
        token.sessionId = (user as any).sessionId;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.tokenType = (user as any).tokenType || 'Bearer';
        token.accessTokenExpiresAt = (user as any).accessTokenExpiresAt;
      }
      // Handle client-initiated session updates (e.g., after refresh token)
      if (trigger === 'update' && session) {
        if ((session as any).accessToken) {
          token.accessToken = (session as any).accessToken;
        }
        if ((session as any).refreshToken) {
          token.refreshToken = (session as any).refreshToken;
        }
        if ((session as any).tokenType) {
          token.tokenType = (session as any).tokenType;
        }
        if ((session as any).accessTokenExpiresAt) {
          token.accessTokenExpiresAt = (session as any).accessTokenExpiresAt;
        }
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).user = {
        ...(((token as any)?.user) || {}),
        sessionId: (token as any)?.sessionId,
      };
      // Add tokens to session for API calls
      (session as any).accessToken = (token as any)?.accessToken;
      (session as any).refreshToken = (token as any)?.refreshToken;
      (session as any).tokenType = (token as any)?.tokenType;
      (session as any).accessTokenExpiresAt = (token as any)?.accessTokenExpiresAt;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
} satisfies NextAuthConfig;



