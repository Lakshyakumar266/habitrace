// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { redirectTo = '/login' } = await request.json().catch(() => ({}))

        // Clear auth cookies
        const response = NextResponse.json(
            { 
                success: true,
                message: 'Logged out successfully',
                redirectTo 
            },
            { status: 200 }
        )

        response.cookies.set({
            name: 'token',
            value: '',
            expires: new Date(0),
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        })

        return response

    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Logout failed',error:error },
            { status: 500 }
        )
    }
}

// Support GET requests for direct link logout
export async function GET(request: NextRequest) {
    const response = NextResponse.redirect(new URL('/login', request.url))

    // Clear the token cookie
    response.cookies.set({
        name: 'token',
        value: '',
        expires: new Date(0),
        path: '/',
    })

    return response
}