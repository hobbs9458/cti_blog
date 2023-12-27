import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req) {
  const formData = await req.json();
  const rows = formData.rows;
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
  }

  const successfullyInsertedIds = [];

  try {
    for (let i = 0; i < rows.length; i++) {
      const { item, min, max, requested_by } = rows[i];

      const { data, error } = await supabase
        .from("vending-requests")
        .insert({
          item,
          min,
          max,
          submitted_by: submitter.name,
          requested_by: requested_by
            .split(" ")
            .map((name) => name[0].toLowerCase() + name.slice(1))
            .join("_"),
        })
        .select()
        .single();

      if (error) {
        console.log(error);
        throw new Error(error);
      }

      // If no error, log the successful insertion so we can simulate rollback in the event of an error
      successfullyInsertedIds.push(data.id);
    }

    return NextResponse.json({ success: "Upload successful" }, { status: 200 });
  } catch (err) {
    // Delete rows based on successfullyInsertedIds
    for (const id of successfullyInsertedIds) {
      try {
        const { error: deleteError } = await supabase
          .from("vending-requests")
          .delete()
          .eq("id", id);
        if (deleteError) {
          console.error("Error deleting row:", deleteError);
        } else {
          console.log(`Row with ID ${id} deleted successfully.`);
        }
      } catch (deleteErr) {
        console.error("Error deleting row:", deleteErr);
      }
    }

    return NextResponse.json(
      { error: "Upload not successful" },
      { status: 500 }
    );
  }
}
