import { NextResponse } from 'next/server'
import { cookies } from 'next/headers';

export async function middleware(request) {
    const cookieStore = cookies();
    if((await cookieStore).get("SID")){
        console.log();
    }else{
        return NextResponse.redirect(new URL('/auth?login=true', request.url))
    }
}

export const config = {
    matcher: '/dashboard/:path*',
}