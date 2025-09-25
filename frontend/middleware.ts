import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// 1. Specify protected and public routes
const protectedRoutes = ['/']
const publicRoutes = ['/login', '/signup']

export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path)

    // 3. Decrypt the session from the cookie
      const cookie = (await cookies()).get('token')?.value
    // const cookie = localStorage.getItem('token');
    // console.log('Cookie:', cookie);

    //   const session = await decryp(cookie)


    // 4. Redirect to /login if the user is not authenticated
      if (isProtectedRoute && !cookie) {
            // console.log("PROTECTED ROUTE");
            return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    // 5. Redirect to /dashboard if the user is authenticated
    if (
        isPublicRoute &&
        // session?.userId &&
        !req.nextUrl.pathname.startsWith('/')
    ) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}