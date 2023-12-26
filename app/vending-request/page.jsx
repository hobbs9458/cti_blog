"use client";

import { useState, useRef } from "react";
import Link from "next/link";

import styles from "./vendingRequest.module.css";

import { toast } from "react-toastify";
import { Hourglass } from "react-loader-spinner";
import readXlsxFile from "read-excel-file";

export default function VendingFormSubmission() {
  const [item, setItem] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [requester, setRequester] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedData, setUploadedData] = useState([]);
  const [activeTab, setActiveTab] = useState("tab1");
  const uploadRef = useRef(null);

  async function handleSingleSubmit(e) {
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

  async function handleFileChange() {
    const rows = await readXlsxFile(uploadRef.current.files[0]);
    setUploadedData(rows);
  }

  async function handleUploadSubmit(e) {
    e.preventDefault();
    if (uploadedData.length < 1) {
      return toast.error("Please upload a file before submitting");
    }

    const res = await fetch(
      `http://localhost:3000/api/vending-request-upload`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows: uploadedData,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      toast.success(data.success);
      uploadRef.current.value = "";
      setUploadedData([]);
    } else {
      toast.error("Upload not successful. Please try again.");
    }
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
    <main className={styles.vendingReqMain}>
      <h1 className={styles.vendingReqHeader}>Vending Request</h1>

      <div className={styles.tabBtns}>
        <button
          className={`${styles.tabBtn} ${
            activeTab === "tab1" ? styles.activeTab : ""
          } btn`}
          onClick={() => setActiveTab("tab1")}
        >
          Single Request
        </button>
        <button
          className={`${styles.tabBtn} ${
            activeTab === "tab2" ? styles.activeTab : ""
          } btn`}
          onClick={() => setActiveTab("tab2")}
        >
          Upload Requests
        </button>
        <button
          className={`${styles.tabBtn} ${
            activeTab === "tab3" ? styles.activeTab : ""
          } btn`}
          onClick={() => setActiveTab("tab3")}
        >
          Item Search
        </button>
      </div>

      {activeTab === "tab1" && (
        <form
          onSubmit={handleSingleSubmit}
          className={styles.vendingSingleForm}
        >
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

          <button className={`btn ${styles.vendingSingleFormBtn}`}>
            Submit
          </button>
        </form>
      )}

      {activeTab === "tab2" && (
        <form
          className={styles.vendingUploadForm}
          onSubmit={handleUploadSubmit}
        >
          <p className={styles.downloadTemplateP}>
            {" "}
            <Link href="/vending-request-excel-template.xlsx" className="link">
              Download the excel template
            </Link>{" "}
            and upload requests in bulk.
          </p>

          <input
            type="file"
            name="upload"
            id="upload"
            className={styles.uploadFileInput}
            ref={uploadRef}
            onChange={handleFileChange}
          />
          <button className={`${styles.uploadSubmitBtn} btn`}>Upload</button>
        </form>
      )}

      {activeTab === "tab3" && (
        <div style={{ textAlign: "center" }}>Search Page...</div>
      )}
    </main>
  );
}
