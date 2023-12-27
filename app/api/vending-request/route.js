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

  const { data: roleData, error: roleDataError } = await supabase
    .from("user-roles")
    .select("role-types (role)")
    .eq("user_id", userId)
    .single();

  if (roleDataError) {
    console.log(roleDataError);
  }

  const role = roleData["role-types"].role;

  if (role === "admin") {
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
}
