import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import nodemailer from "nodemailer";

import {
  getUser,
  getUserByName,
  sendMail,
  capitalize,
} from "@/utils/functions";

export async function POST(req) {
  const formData = await req.json();
  const rows = formData.rows;
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const user = await getUser(supabase);
  const successfullyInsertedIds = [];
  let salesRepOnUpload = null;

  try {
    for (let i = 0; i < rows.length; i++) {
      const {
        min,
        max,
        sales_rep,
        description_1,
        description_2,
        mfg,
        mfg_number,
        supply_net_number,
        price,
        price_type,
        customer,
        issue_qty,
      } = rows[i];

      const { data, error } = await supabase
        .from("vending-requests")
        .insert({
          min,
          max,
          submitted_by: user.name,
          description_1,
          description_2,
          mfg,
          mfg_number,
          supply_net_number,
          price,
          price_type,
          customer,
          issue_qty,
          sales_rep: sales_rep
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

      // If no error, track the successful insertion so we can simulate rollback in the event of an error
      successfullyInsertedIds.push(data.id);

      // grab the sales rep from one of the rows so you can email them
      if (salesRepOnUpload === null) {
        salesRepOnUpload = sales_rep;
      }
    }

    // send email to submitter, logistics, and all sales rep
    const uniqueEmailAddresses = new Set();
    uniqueEmailAddresses.add(process.env.LOGISTICS_EMAIL);
    uniqueEmailAddresses.add(user.email);
    // only need email for sales rep if they are not submitting
    if (user.name !== salesRepOnUpload) {
      const rep = await getUserByName(supabase, salesRepOnUpload);
      uniqueEmailAddresses.add(rep.email);
    }

    const emailAddresses = Array.from(uniqueEmailAddresses);
    const subject = "Vending Requests Uploaded";
    const message = `<html>
      <head>
        <style>
          h1, h2, p {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }

          p {
            font-size: 16px;
          }

          a:hover {
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <h1 style="font-size: 20px; color: black">Vending Requests Uploaded</h1>
        <h2 style="margin: 0; font-size: 18px; color: black">Uploaded by ${capitalize(
          user.name,
          "_"
        )}</h2>
        <hr/>
        <p style="color: black;">Click <a href="http://www.cuttingtoolsinc.com/vending-submissions?redirect=/vending-submissions" style="color: black;">here</a> to view the requests.</p>
      </body>
    </html>`;

    await sendMail(nodemailer, subject, message, emailAddresses);

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
