import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const userEmail = req.nextauth.token?.email;

    // Allow access if user is admin or superadmin
    if (role === "admin" || role === "superadmin") {
      return NextResponse.next();
    }

    // Not an admin, redirect to home
    return NextResponse.redirect(new URL("/", req.url));
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Must be logged in
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"], // Only run this middleware on /admin routes
};