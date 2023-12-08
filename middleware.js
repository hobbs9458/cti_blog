import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export const config = {
    matcher: '/admin/:path*',
}

export async function middleware(req) {
    // const res = NextResponse.next()
    // const supabase = createMiddlewareClient({ req, res })
    // const data = await supabase.auth.getSession(res);
    
    // if(!data) {
    //    // Use the dot notation to call the res.redirect() method
    //    NextResponse.redirect('/');
    //    // Return the res object after redirecting
    // //    return res
    // } 
    // return res;
    console.log('kill me')
  }
  
  
  

  