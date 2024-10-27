import { clientConfig, serverConfig } from "@/lib/config";
import {
  authMiddleware,
  redirectToLogin,
  redirectToPath,
} from "next-firebase-auth-edge";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/about",
  "/actions",
  "/get-involved",
  "/get-involved/leader",
  "/api/og",
];

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    cookieSerializeOptions: serverConfig.cookieSerializeOptions,
    serviceAccount: serverConfig.serviceAccount,
    handleValidToken: async ({ token, decodedToken }, headers) => {
      if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
        return redirectToPath(request, "/dashboard");
      }

      return NextResponse.next({
        request: {
          headers,
        },
      });
    },
    handleInvalidToken: async (reason) => {
      console.info("Missing or malformed credentials", { reason });

      return redirectToLogin(request, {
        path: "/login",
        publicPaths: PUBLIC_PATHS,
      });
    },
    handleError: async (error) => {
      console.error("Unhandled authentication error", { error });

      return redirectToLogin(request, {
        path: "/login",
        publicPaths: PUBLIC_PATHS,
      });
    },
  });
}

export const config = {
  matcher: ["/", "/((?!_next|api|.*\\.).*)", "/api/login", "/api/logout"],
};
