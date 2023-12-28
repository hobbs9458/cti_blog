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
    .from("user-roles")
    .select("role-types (role)")
    .eq("user_id", userId)
    .single();

  if (roleDataError) {
    console.log(roleDataError);
  }

  const role = roleData["role-types"].role;

  return role;
}
