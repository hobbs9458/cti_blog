import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req) {
  const formData = await req.json();

  const { item, min, max, requester } = formData;

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session.user.id;

  const { data: requesterData, errorReqId } = await supabase
    .from("users")
    .select()
    .eq("name", requester)
    .single();

  const reqId = requesterData.id;

  const { data, error } = await supabase
    .from("vending-requests")
    .insert({
      Item: item,
      Min: min,
      Max: max,
      sub_id: userId,
      req_id: reqId,
    })
    .select()
    .single();

  return NextResponse.json({ data, error });
}
