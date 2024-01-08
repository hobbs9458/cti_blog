import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import nodemailer from "nodemailer";

export async function POST(req) {
  const { name, email, phone, company, message } = await req.json();
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const window = new JSDOM("").window;
  const purify = DOMPurify(window);
  const cleanName = purify.sanitize(name);
  const cleanEmail = purify.sanitize(email);
  const cleanPhone = purify.sanitize(phone);
  const cleanCompany = purify.sanitize(company);
  const cleanMessage = purify.sanitize(message);

  const { data, error } = await supabase
    .from("contact-form-submissions")
    .insert({ cleanName, cleanEmail, cleanPhone, cleanCompany, cleanMessage })
    .select()
    .single();

  if (error) {
    console.log("contact form post request request error", error);
  }

  const emailText =
    `Name: ${cleanName}` +
    "\n" +
    `Email: ${cleanEmail || "N/A"}` +
    "\n" +
    `Phone: ${cleanPhone || "N/A"}` +
    "\n" +
    `Company: ${cleanCompany || "N/A"}` +
    "\n" +
    `Message: ${cleanMessage}`;

  const emailAddress = process.env.EMAIL;
  const emailPass = process.env.EMAIL_PASS;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailAddress,
      pass: emailPass,
    },
  });

  const mailOptions = {
    from: `${cleanName}`,
    to: emailAddress,
    subject: "New Contact Form Submission",
    text: emailText,
  };

  try {
    const res = await transporter.sendMail(mailOptions);
    if (res) {
      return NextResponse.json("Contact form submitted!", {
        status: 201,
      });
    }
  } catch (error) {
    return NextResponse.json("There was an issue. Please try again.", {
      status: 500,
    });
  }
}
