import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import { getRole } from "@/utils/functions";

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

  const { data, error } = await supabase
    .from("vending-requests")
    .insert({
      ...formData,
      submitted_by: submitter.name,
    })
    .select()
    .single();

  console.log("DATA", data);
  console.log("ERROR", error);

  if (error) {
    console.log(error);
    return NextResponse.json({
      errorMessage:
        "There was a problem. Please try again or contact an administrator.",
    });
  }

  return NextResponse.json({ data });
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
        "id, created_at, min, max, submitted_by, requested_by, status, is_complete, description_1, description_2, mfg, mfg_number, price, price_type, customer, issue_qty, vending_request_comments (id, created_at, user, comment, is_auto)"
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
      .or(`requested_by.eq.${user.name},submitted_by.eq.${user.name}`);

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

  console.log(formData);
  // const { id, min, max, status } = formData.editForm;
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("vending-requests")
    .update(formData)
    .match({ id: formData.id })
    .select()
    .single();

  if (error) {
    console.log(error);
    return NextResponse.json({
      errorMessage:
        "There was a problem. Please try again or contact an administrator.",
    });
  }

  return NextResponse.json(data);
}
