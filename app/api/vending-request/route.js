import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import nodemailer from "nodemailer";
import { sendMail } from "@/utils/functions";

import { capitalize, getRole } from "@/utils/functions";

export async function POST(req) {
  const formData = await req.json();
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
    return NextResponse.json({
      errorMessage:
        "User not found. Please try again or contact an administrator.",
    });
  }

  const { data: vendingRequest, vendingRequestError } = await supabase
    .from("vending-requests")
    .insert({
      ...formData,
      submitted_by: submitter.name,
    })
    .select()
    .single();

  if (vendingRequestError) {
    console.log(vendingRequestError);
    return NextResponse.json({
      errorMessage:
        "There was a problem. Please try again or contact an administrator.",
    });
  }

  // send email to submitter, logistics, and sales rep

  const { data: salesRepEmail, error: salesRepEmailError } = await supabase
    .from("users")
    .select("email")
    .eq("name", vendingRequest.sales_rep)
    .single();

  if (salesRepEmailError) {
    console.log(salesRepEmailError);
  }

  const emailAddresses = [
    submitter.email,
    salesRepEmail.email,
    process.env.LOGISTICS_EMAIL,
  ];

  const subject = "New Vending Request Submission";

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
      <h1 font-size: 20px">Vending request ${vendingRequest.id}</h1>
      <h2 style="margin: 0; font-size: 18px">Submitted by ${capitalize(
        submitter.name,
        "_"
      )}</h2>
      <hr/>
      <p style="margin: 0;">Sales Rep: ${capitalize(
        vendingRequest.sales_rep,
        "_"
      )}</p>
      <p style="margin: 0;">Description 1: ${vendingRequest.description_1}</p>
      <p style="margin: 0;">Supply Net Number: ${
        vendingRequest.supply_net_number || "N/A"
      }</p>
      <p style="margin: 0;">Min: ${vendingRequest.min}</p>
      <p style="margin: 0;">Max: ${vendingRequest.max}</p>
      <p style="margin: 0;">Customer: ${vendingRequest.customer}</p>
      <p>Click <a href="http://www.cuttingtoolsinc.com/vending-submissions/${
        vendingRequest.id
      }" style="color: black">here<a/> to view the request.</p>
    </body>
  </html>`;

  await sendMail(nodemailer, subject, message, emailAddresses);

  return NextResponse.json({ vendingRequest });
}

export async function GET(req) {
  // get supabase client and session
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const session = await supabase.auth.getSession();

  // get permissions of user
  const userId = session.data.session.user.id;
  const userRoles = await getRole(createRouteHandlerClient, cookies);
  const rolesThatAccessAllRequests = ["admin", "it", "mgmt", "logistics"];
  const rolesThatAccessPersonalRequests = ["sales"];
  const allRequestAccess = userRoles.some((role) =>
    rolesThatAccessAllRequests.includes(role)
  );
  const personalRequestAccess = userRoles.some((role) =>
    rolesThatAccessPersonalRequests.includes(role)
  );

  // check for id in query
  const reqId = req.nextUrl.searchParams.get(["id"]);

  // if an id is present in query string, check roles and send back the request
  if (reqId) {
    if (!allRequestAccess && !personalRequestAccess) {
      return NextResponse.json({
        errorMessage: `You don't have permission to see this page.`,
      });
    }

    // if user is admin or if user is associated with request then send back request
    const { data: request, error: requestError } = await supabase
      .from("vending-requests")
      .select(
        "id, created_at, min, max, submitted_by, sales_rep, status, is_complete, description_1, description_2, mfg, mfg_number, price, price_type, customer, issue_qty, supply_net_number, vending_request_comments (id, created_at, user, comment, is_auto)"
      )
      .eq("id", reqId)
      .single();

    if (requestError) {
      console.log(requestError);
      return NextResponse.json({
        errorMessage: `There was a problem. Please try again or contact an administrator.`,
      });
    }

    return NextResponse.json({
      request,
      userRoles,
    });
  }

  // if no id in query string check role and send requests based on user role
  if (allRequestAccess) {
    const { data, error: vendingRequestError } = await supabase
      .from("vending-requests")
      .select()
      .order("id", { ascending: true });

    if (vendingRequestError) {
      console.log(vendingRequestError);
      return NextResponse.json({
        errorMessage:
          "There was a problem. Please try again or contact an administrator.",
      });
    }
    return NextResponse.json(data);
  }

  // if user is sales role only select the rows where the user is either the requester or the submitter.
  if (personalRequestAccess) {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("name")
      .eq("id", userId)
      .single();

    if (userError) {
      console.log(userError);
      return NextResponse.json({
        errorMessage:
          "There was a problem. Please try again or contact an administrator.",
      });
    }

    const { data: rows, error: rowsError } = await supabase
      .from("vending-requests")
      .select()
      .or(`sales_rep.eq.${user.name},submitted_by.eq.${user.name}`)
      .order("id", { ascending: true });

    if (rowsError) {
      console.log(rowsError);
      return NextResponse.json({
        errorMessage:
          "There was a problem. Please try again or contact an administrator.",
      });
    }

    return NextResponse.json(rows);
  }
}

export async function PATCH(req) {
  const requestData = await req.json();
  const formData = requestData.requestFormData;
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data: updatedRequest, error: updatedRequestError } = await supabase
    .from("vending-requests")
    .update(formData)
    .match({ id: formData.id })
    .select()
    .single();

  if (updatedRequestError) {
    console.log(updatedRequestError);
    return NextResponse.json({
      errorMessage:
        "There was a problem. Please try again or contact an administrator.",
    });
  }

  if (updatedRequest.status === "approved") {
    // if vending request is approved notify it
    const { data: users, erro: usersError } = await supabase
      .from("users")
      .select();

    if (usersError) {
      console.log(usersError);
    }

    const itUsers = users.filter((user) => user.roles.includes("it"));
    const itEmails = itUsers.map((itUser) => itUser.email);

    const subject = `Vending Request ${updatedRequest.id} Has Been Approved`;
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
      <h1 font-size: 20px">Vending Request ${updatedRequest.id} Has Been Approved</h1>
      <hr/>
      <p>Click <a href="http://www.cuttingtoolsinc.com/vending-submissions/${updatedRequest.id}" style="color: black">here<a/> to review the request.</p>
    </body>
  </html>`;

    await sendMail(nodemailer, subject, message, itEmails);
  }

  return NextResponse.json(updatedRequest);
}
