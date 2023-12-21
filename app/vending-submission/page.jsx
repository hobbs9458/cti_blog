"use client";

import { useState, useRef } from "react";

import styles from "./vendingSubmission.module.css";

export default function VendingFormSubmission() {
  const [item, setItem] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [requester, setRequester] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(requester);

    const res = await fetch(`http://localhost:3000/api/vending-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        item,
        min,
        max,
        requester,
      }),
    });

    const data = await res.json();
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.vendingSubmission}>
      <h1>Vending Request</h1>
      <label htmlFor="item" className="label">
        Item
      </label>
      <input
        type="text"
        id="item"
        className="input"
        onChange={(e) => setItem(e.target.value)}
        value={item}
      />

      <div className={styles.minMaxWrap}>
        <div>
          <label htmlFor="min" className="label">
            Min
          </label>
          <input
            type="number"
            name="min"
            id="min"
            className="input"
            onChange={(e) => setMin(e.target.value)}
            value={min}
          />
        </div>
        <div>
          <label htmlFor="max" className="label">
            Max
          </label>
          <input
            type="number"
            name="max"
            id="max"
            className="input"
            onChange={(e) => setMax(e.target.value)}
            value={max}
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <label htmlFor="requester" className="label">
        Requested by
      </label>
      <select
        name="requester"
        id="requester"
        className={styles.reqDropdown}
        required
        value={requester}
        onChange={(e) => setRequester(e.target.value)}
      >
        <option className={styles.reqOption}></option>
        <option value="ronnie_turner" className={styles.reqOption}>
          Ronnie Turner
        </option>
        <option value="john_narum" className={styles.reqOption}>
          John Narum
        </option>
        <option value="jimmy_shelton" className={styles.reqOption}>
          Jimmy Shelton
        </option>
      </select>

      <button className={`btn ${styles.vendingSubmissionBtn}`}>Submit</button>
    </form>
  );
}
