import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


const protectedRoutes = [
  "/dashboard",
  "/interview",
  "/profile",
  "/resume",
  "/api/profile",
  "/api/resume",
  "/api/interview",
];

const authRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  
  const isAuthRoute = authRoutes.some((route) => 
    pathname.startsWith(route)
  );
  
  const isApiRoute = pathname.startsWith("/api/");


  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  const isAuthenticated = !!token;


  
  
  if (isApiRoute && isProtectedRoute && !isAuthenticated) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

 
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }


  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  
  return NextResponse.next();
}


export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};