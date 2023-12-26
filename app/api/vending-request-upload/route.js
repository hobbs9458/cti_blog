import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req) {
  console.log("POST!!!");
  const formData = await req.json();
  const rows = formData.rows.slice(1);

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

  const successfullyInsertedIds = [];

  try {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const item = row[0];
      const min = row[1];
      const max = row[2];
      const reqName = row[3];

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

      if (error) {
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
