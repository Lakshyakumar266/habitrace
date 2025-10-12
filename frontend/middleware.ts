import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// 1. Specify protected and public routes
const protectedRoutes = ['/profile']
const authRoutes = ['/login', '/register', '/forgotpassword'] // Routes that should redirect to hub if user is logged in

export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)
    const isAuthRoute = authRoutes.includes(path)

    const cookie = (await cookies()).get('token')?.value

    // 4. Redirect to /login if the user is not authenticated on protected routes
    if (isProtectedRoute && !cookie) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    // 5. Redirect to /hub if the user is authenticated and tries to access auth routes
    if (isAuthRoute && cookie) {
        return NextResponse.redirect(new URL('/hub', req.nextUrl))
    }

    return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}