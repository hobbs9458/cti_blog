"use client";

import { useRouter } from "next/navigation";

import styles from "./LogoutBtn.module.css";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LogoutBtn() {
  const router = useRouter();

  const handleLogout = async function () {
    const supabase = createClientComponentClient();
    const { error } = await supabase.auth.signOut();

    if (!error) {
      router.push("/");
    }

    if (error) {
      console.log(error);
    }
  };

  return (
    <button className={`${styles.logoutBtn} btn`} onClick={handleLogout}>
      Logout
    </button>
  );
}
