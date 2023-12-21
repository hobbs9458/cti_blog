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

export async function GET(req) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase.from("vending-requests").select();

  if (error) {
    return NextResponse(error);
  }

  const subs = await Promise.all(
    data.map(async (submission) => {
      const { data: submitter, error: submitterError } = await supabase
        .from("users")
        .select()
        .eq("id", submission.sub_id)
        .single();

      const { data: requester, error: requesterError } = await supabase
        .from("users")
        .select()
        .eq("id", submission.req_id)
        .single();

      if (submitterError) {
        console.log(submitterError);
      }

      if (requesterError) {
        console.log(requesterError);
      }

      const subName = submitter.name.split("_").join(" ").toUpperCase();
      const reqName = requester.name.split("_").join(" ").toUpperCase();

      const sub = {
        ...submission,
        sub_name: subName,
        req_name: reqName,
      };

      return sub;
    })
  );

  return NextResponse.json(subs);
}
