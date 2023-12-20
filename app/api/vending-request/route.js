import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req) {
  const formData = await req.json();

  const { item, min, max } = formData;

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("TEST")
    .insert({ Item: item, Min: min, Max: max })
    .select()
    .single();

  return NextResponse.json({ data, error });
}
