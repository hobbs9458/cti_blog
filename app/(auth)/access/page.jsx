"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import styles from "./access.module.css";
import AuthForm from "../../components/AuthForm";

import { Hourglass } from "react-loader-spinner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import LogoutBtn from "../../components/LogoutBtn";

const supabase = createClientComponentClient();

export default function Login() {
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      setLoading(true);
      const session = (await supabase.auth.getSession()).data.session;
      console.log(session);
      if (session) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
      setLoading(false);
    }

    checkSession();
  }, []);

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

  if (loading) {
    return (
      <div style={{ minHeight: "650px" }}>
        <Hourglass
          visible={true}
          height="80"
          width="80"
          ariaLabel="hourglass-loading"
          wrapperStyle={{ display: "block", margin: "8rem auto 0" }}
          wrapperClass=""
          colors={["#1b1b1b", "#1b1b1b"]}
        />
      </div>
    );
  }

  return (
    <main className={styles.access}>
      {loggedIn ? (
        <h2 className="text-center">You are logged in</h2>
      ) : (
        <h2 className="text-center">Login</h2>
      )}

      {loggedIn ? <LogoutBtn /> : <AuthForm handleSubmit={handleSubmit} />}
      {error && <div className="error">{error}</div>}
    </main>
  );
}
