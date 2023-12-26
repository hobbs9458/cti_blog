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

  const { data: submitter, error: submitterError } = await supabase
    .from("users")
    .select()
    .eq("id", userId)
    .single();

  if (submitterError) {
    console.log(submitterError);
    return NextResponse.json(
      { error: "Error retrieving submitter name" },
      { status: 500 }
    );
  }

  const subNameArr = submitter.name
    .split("_")
    .map((name) => `${name[0].toUpperCase()}${name.slice(1)}`);
  const subName = `${subNameArr[0]} ${subNameArr[1]}`;

  const reqNameArr = requester
    .split("_")
    .map((name) => `${name[0].toUpperCase()}${name.slice(1)}`);
  const reqName = `${reqNameArr[0]} ${reqNameArr[1]}`;

  const { data, error } = await supabase
    .from("vending-requests")
    .insert({
      Item: item,
      Min: min,
      Max: max,
      "Submitted By": subName,
      "Requested By": reqName,
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

  return NextResponse.json(data);
}
