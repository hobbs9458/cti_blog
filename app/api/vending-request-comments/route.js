import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req) {
  const comment = await req.json();

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const sessionData = await supabase.auth.getSession();
  const userId = sessionData.data.session.user.id;

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('name')
    .eq('id', userId)
    .single();

  console.log(userData);
  console.log(userError);
  const { data, error } = await supabase
    .from('vending_request_comments')
    .insert({ comment, user: userData.name, request:  })
    .select()
    .single();

  console.log(data);
  console.log(error);

  return NextResponse.json({ key: 'api-test' });
}
