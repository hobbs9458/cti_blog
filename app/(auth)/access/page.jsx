"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import styles from "./access.module.css";
import AuthForm from "../../components/AuthForm";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export default function Login() {
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {}, []);

  const handleSubmit = async (e, email, password) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    if (!error) {
      router.push("/");
    }
  };

  return (
    <main className={styles.access}>
      <h2 className="text-center">Login</h2>
      <AuthForm handleSubmit={handleSubmit} />
      {error && <div className="error">{error}</div>}
    </main>
  );
}
