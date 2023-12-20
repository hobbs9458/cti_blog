"use client";

import { useState } from "react";

import styles from "./AuthForm.module.css";

export default function AuthForm({ handleSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form onSubmit={(e) => handleSubmit(e, email, password)}>
      <label className="label">
        <span>Email:</span>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
          className="input"
        />
      </label>
      <label className="label">
        <span>Password:</span>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
          className="input"
        />
      </label>
      <button className={`${styles.authFormBtn} btn`}>Submit</button>
    </form>
  );
}
