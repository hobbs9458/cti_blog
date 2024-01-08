import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import nodemailer from 'nodemailer';
import { capitalize, sendMail } from '@/utils/functions';

export async function GET(req) {
  const reqId = req.nextUrl.searchParams.get(['reqId']);
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from('vending_request_feed')
    .select()
    .eq('request', reqId)
    .order('id', { ascending: true });

  if (error) {
    console.log(error);
    return NextResponse.json({
      errorMessage:
        'There was a problem getting comments. Please try again or contact an administrator.',
    });
  }

  if (data) {
    return NextResponse.json({
      comments: data,
      successMessage: 'Comments fetched successfully',
    });
  }
}

export async function POST(req) {
  const { comment, requestId, isUpdate } = await req.json();
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const sessionData = await supabase.auth.getSession();
  const userId = sessionData.data.session.user.id;
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);
  let cleanComment = purify.sanitize(comment);

  // get users name for comment
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('name, email')
    .eq('id', userId)
    .single();

  if (userError) {
    console.log(userError);
    return NextResponse.json({
      errorMessage:
        'There was a problem adding your comment. Please try again or contact an administrator.',
    });
  }

  const { data: newComment, error: newCommentError } = await supabase
    .from('vending_request_feed')
    .insert({
      comment: cleanComment,
      user: userData.name,
      request: requestId,
      is_update: typeof isUpdate === 'boolean' ? isUpdate : false,
    })
    .select()
    .single();

  if (newCommentError) {
    console.log(newCommentError);
    return NextResponse.json({
      errorMessage:
        'There was a problem adding your comment. Please try again or contact an administrator.',
    });
  }

  const subject = `${
    newComment.is_update ? 'Update' : 'Comment'
  } For Vending Request ${newComment.request}`;

  let text;

  if (newComment.is_update) {
    text = newComment.comment
      .split('\n')
      .slice(2, -1)
      .map((update) => `<p style="margin: 0;">${update}</p>`)
      .join('');
  } else {
    text = newComment.comment;
  }

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
      <h1 font-size: 20px">New ${
        newComment.is_update ? 'Update' : 'Comment'
      } For Vending Request ${newComment.request}</h1>
      <h2 style="margin: 0; font-size: 18px">${
        newComment.is_update ? 'Updated' : 'Submitted'
      } by ${capitalize(newComment.user, '_')}</h2>
      <hr/>
      ${text}
      <p>Click <a href="http://www.cuttingtoolsinc.com/vending-submissions/${
        newComment.request
      }" style="color: black">here<a/> to view the request.</p>
    </body>
  </html>`;

  // need to email logistics, commenter, and sales rep
  // account for when sales rep is the commenter and make sure not to send the email twice

  const { data: request, error: requestError } = await supabase
    .from('vending-requests')
    .select('sales_rep')
    .eq('id', requestId)
    .single();

  if (requestError) {
    console.log(requestError);
  }

  const emailAddresses = [process.env.LOGISTICS_EMAIL, userData.email];

  // if sales rep is not the commenter/updater add their email to the send list
  if (userData.name !== request.sales_rep) {
    const { data: salesRepEmail, error: salesRepEmailError } = await supabase
      .from('users')
      .select('email')
      .eq('name', request.sales_rep)
      .single();

    if (salesRepEmailError) {
      console.log(salesRepEmailError);
    }

    emailAddresses.push(salesRepEmail.email);
  }

  await sendMail(nodemailer, subject, message, emailAddresses);

  return NextResponse.json({
    successMessage: 'Comment added',
    comment: newComment,
  });
}
