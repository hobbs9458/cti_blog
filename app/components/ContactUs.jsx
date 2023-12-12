"use client";

import { useState } from "react";

import { toast } from "react-toastify";

import styles from "./ContactUs.module.css";

function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleFormSubmit(e) {
    e.preventDefault();

    const res = await fetch(`${location.origin}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
      }),
    });

    if (res.ok) {
      toast.success("Contact form submitted successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setName("");
      setEmail("");
      setMessage("");
    } else {
      toast.success(
        "There was an issue submitting the form. Please try again.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
  }

  return (
    <form id="contact" className={`${styles.form}`} onSubmit={handleFormSubmit}>
      {/* GET ICON VERSION OF HEADER */}
      <h2 className={styles.contactUsH2}>Contact Us</h2>
      <label htmlFor="name" className="label">
        Name
      </label>
      <input
        type="text"
        name="name"
        id="name"
        className="input"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <label htmlFor="email" className="label">
        Email
      </label>
      <input
        type="email"
        name="email"
        id="email"
        className="input"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <label htmlFor="message" className="label">
        Message
      </label>
      <textarea
        name="message"
        id="message"
        cols="30"
        rows="10"
        className="text-area"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      ></textarea>
      <button className={`btn ${styles.contactBtn}`}>Submit</button>
    </form>
  );
}

export default ContactUs;
