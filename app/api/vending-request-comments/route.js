import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req) {
  const { comment, requestId } = await req.json();
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const sessionData = await supabase.auth.getSession();
  const userId = sessionData.data.session.user.id;

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('name')
    .eq('id', userId)
    .single();

  if (userError) {
    console.log(userError);
    return NextResponse.json({
      errorMessage:
        'There was a problem adding your comment. Please try again or contact an administrator.',
    });
  }

  const { data, error } = await supabase
    .from('vending_request_comments')
    .insert({ comment, user: userData.name, request: requestId })
    .select()
    .single();

  if (error) {
    console.log(error);
    return NextResponse.json({
      errorMessage:
        'There was a problem adding your comment. Please try again or contact an administrator.',
    });
  }

  if (data) {
    return NextResponse.json({ successMessage: 'Comment added' });
  }
}
