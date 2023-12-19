import { NextResponse } from "next/server";

import nodemailer from "nodemailer";

export async function POST(req) {
  const data = await req.json();

  const contactName = data.name;
  const contactEmail = data.email;
  const contactPhone = data.phone;
  const contactCompany = data.company;

  console.log(typeof contactPhone);

  const message =
    `Name: ${contactName}` +
    "\n" +
    `Email: ${contactEmail || "N/A"}` +
    "\n" +
    `Phone: ${contactPhone || "N/A"}` +
    "\n" +
    `Company: ${contactCompany || "N/A"}` +
    "\n" +
    `Message: ${data.message}`;

  const emailAddress = process.env.EMAIL;
  const emailPass = process.env.EMAIL_PASS;

  console.log("api email log", contactEmail);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailAddress,
      pass: emailPass,
    },
  });

  const mailOptions = {
    from: `${contactName}`,
    to: emailAddress,
    subject: "New Contact Form Submission",
    text: message,
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
