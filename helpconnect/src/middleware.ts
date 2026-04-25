import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getDashboardPathForRole, getRequiredRoleForDashboardPath } from "@/lib/roles";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role as string | undefined;
    const correctDashboard = getDashboardPathForRole(role);
    const requiredRole = getRequiredRoleForDashboardPath(pathname);

    if (pathname === "/dashboard") {
      return NextResponse.redirect(new URL(correctDashboard, req.url));
    }

    if (requiredRole && role !== requiredRole) {
      return NextResponse.redirect(new URL(correctDashboard, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;

        if (
          pathname === "/" ||
          pathname.startsWith("/news") ||
          pathname.startsWith("/login") ||
          pathname.startsWith("/register") ||
          pathname.startsWith("/api/auth")
        ) {
          return true;
        }

        return !!token;
      },
    },
  },
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
