import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req) {
  const formData = await req.json();
  const { id, min, max, status } = formData.editForm;
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("vending-requests")
    .update({
      Min: min,
      Max: max,
      Status: status,
    })
    .match({ id })
    .select()
    .single();

  return NextResponse.json({ data, error });
}
