import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import { getRole } from "@/utils/functions";

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

  const { data, error } = await supabase
    .from("vending-requests")
    .insert({
      item,
      min,
      max,
      submitted_by: submitter.name,
      requested_by: requester,
    })
    .select()
    .single();

  return NextResponse.json({ data, error });
}

export async function GET(req) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const session = await supabase.auth.getSession();
  const userId = session.data.session.user.id;
  const userRole = await getRole(createRouteHandlerClient, cookies);
  const reqId = req.nextUrl.searchParams.get(["id"]);

  // if an id is present in query string, check roles and send back the request
  if (reqId) {
    // if user is admin or if user is associated with request then send back request
    return NextResponse.json({ single: "request" });
  }

  // if no id in query string check role and send all requests if admin. if not admin send requests associated with user only
  if (userRole === "admin") {
    const { data, error } = await supabase
      .from("vending-requests")
      .select()
      .order("id", { ascending: true });

    if (error) {
      return NextResponse(error);
    }
    return NextResponse.json(data);
  }

  // only select the rows where the user is either the requester or the submitter.
  const { data: userData, error: userDataError } = await supabase
    .from("users")
    .select()
    .eq("id", userId)
    .single();

  if (userDataError) {
    console.log(userDataError);
  }

  const { data: rows, error: rowsError } = await supabase
    .from("vending-requests")
    .select()
    .or(`requested_by.eq.${userData.name},submitted_by.eq.${userData.name}`);

  if (rowsError) {
    return NextResponse(rowsError);
  }

  return NextResponse.json(rows);
}
