import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(req) {
  // get supabase client and session
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // check for id in query
  const userId = req.nextUrl.searchParams.get(["userId"]);

  const { data: userData, error: userDataError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (userDataError) {
    console.log(userDataError);
    return NextResponse.json({
      status: 500,
      errorMessage:
        "There was a problem getting the user's name. Please try loggin in again or contact an administrator.",
    });
  }

  if (userData) {
    return NextResponse.json({ status: 200, data: userData });
  }
}
