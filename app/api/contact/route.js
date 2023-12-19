import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import nodemailer from "nodemailer";

export async function POST(req) {
  const { name, email, phone, company, message } = await req.json();
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("contact-form-submissions")
    .insert({ name, email, phone, company, message })
    .select()
    .single();

  if (data) {
    console.log("data", data);
  }

  if (error) {
    console.log("error", error);
  }

  const emailText =
    `Name: ${name}` +
    "\n" +
    `Email: ${email || "N/A"}` +
    "\n" +
    `Phone: ${phone || "N/A"}` +
    "\n" +
    `Company: ${company || "N/A"}` +
    "\n" +
    `Message: ${message}`;

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
    from: `${name}`,
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
