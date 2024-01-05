export function capitalize(name, splitChar) {
  const arr = name.split(`${splitChar}`);
  return arr.map((name) => name[0].toUpperCase() + name.slice(1)).join(" ");
}

export async function getRole(createRouteHandlerClient, cookies) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const session = await supabase.auth.getSession();
  const userId = session.data.session.user.id;

  const { data: roleData, error: roleDataError } = await supabase
    .from("users")
    .select("roles")
    .eq("id", userId)
    .single();

  if (roleDataError) {
    console.log(roleDataError);
  }

  return roleData.roles;
}

export function readableDate(createdAt) {
  const date = new Date(createdAt);
  return date.toLocaleString();
}

export async function sendMail(nodemailer, subject, message, emailAddresses) {
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
    from: `${emailAddress}`,
    to: emailAddresses,
    subject,
    html: message,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
}
