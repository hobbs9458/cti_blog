"use client";

import { useState } from "react";

import { toast } from "react-toastify";
import { Hourglass } from "react-loader-spinner";
import validator from "validator";

import styles from "./ContactUs.module.css";

function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFormSubmit(e) {
    e.preventDefault();

    if (email === "" && phone === "") {
      return toast.error("Phone or email is required!");
    }

    setLoading(true);

    const res = await fetch(`${location.origin}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        company,
        message,
      }),
    });

    if (res.ok) {
      setLoading(false);
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
      setPhone("");
      setCompany("");
      setMessage("");
    } else {
      setLoading(false);
      toast.error("There was an issue submitting the form. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  if (loading) {
    return (
      <form
        id="contact"
        className={`${styles.form}`}
        onSubmit={handleFormSubmit}
      >
        <h2 className={styles.contactUsH2}>Contact Us</h2>
        <Hourglass
          visible={true}
          height="80"
          width="80"
          ariaLabel="hourglass-loading"
          wrapperStyle={{ display: "block", margin: "8rem auto 0" }}
          wrapperClass=""
          colors={["#1b1b1b", "#1b1b1b"]}
        />
      </form>
    );
  }

  return (
    <form id="contact" className={`${styles.form}`} onSubmit={handleFormSubmit}>
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
        required
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
      <label htmlFor="phone" className="label">
        Phone Number
      </label>
      <input
        type="tel"
        id="phone"
        name="phone"
        // pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
        className="input"
        onChange={(e) => setPhone(e.target.value)}
        value={phone}
      />
      <label htmlFor="company" className="label">
        Company
      </label>
      <input
        type="text"
        name="company"
        id="company"
        className="input"
        onChange={(e) => setCompany(e.target.value)}
        value={company}
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
        required
      ></textarea>
      <button className={`btn ${styles.contactBtn}`}>Submit</button>
    </form>
  );
}

export default ContactUs;
