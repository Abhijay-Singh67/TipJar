import { NextResponse } from 'next/server'
import { cookies } from 'next/headers';

export async function middleware(request) {
    const cookieStore = cookies();
    if (request.nextUrl.pathname.startsWith('/auth')) {
        if ((await cookieStore).get("SID")) {            
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }else if(request.nextUrl.pathname.startsWith('/dashboard')){
        if ((await cookieStore).get("SID")) {
            console.log();
        } else {
            return NextResponse.redirect(new URL('/auth?login=true', request.url))
        }
    }
}