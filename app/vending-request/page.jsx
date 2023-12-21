"use client";

import { useState } from "react";

import styles from "./vendingRequest.module.css";

import { toast } from "react-toastify";
import { Hourglass } from "react-loader-spinner";

export default function VendingFormSubmission() {
  const [item, setItem] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [requester, setRequester] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

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

    if (data.error) {
      return toast.error(data.error);
    }

    toast.success("Request submitted");

    setItem("");
    setMin("");
    setMax("");
    setRequester("");

    setLoading(false);
  }

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
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
        required
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
            required
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
            required
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
