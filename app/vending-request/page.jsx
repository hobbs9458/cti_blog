"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

import styles from "./vendingRequest.module.css";

import { toast } from "react-toastify";
import { Hourglass } from "react-loader-spinner";
import readXlsxFile from "read-excel-file";

export default function VendingFormSubmission() {
  const [loading, setLoading] = useState(false);
  const [uploadedData, setUploadedData] = useState([]);
  const [activeTab, setActiveTab] = useState("tab1");
  const [singleUploadForm, setSingleUploadForm] = useState({
    description_1: "",
    description_2: "",
    mfg: "",
    mfg_number: "",
    supply_net_number: "",
    min: "",
    max: "",
    price: "",
    price_type: "",
    customer: "",
    issue_qty: "",
    price_type: "profit",
    sales_rep: "",
  });

  const uploadRef = useRef(null);

  useEffect(() => {
    // loading state was preventing setting uploadRef to null on submit. useEffect resets it after submission
    if (uploadRef.current?.value) {
      uploadRef.current.value = "";
    }
  }, []);

  function handleSingleUploadFormChange(e) {
    const { name, value, type, checked } = e.target;

    if (name === undefined || value === undefined) {
      return;
    }

    setSingleUploadForm({
      ...singleUploadForm,
      [name]: value,
    });
  }

  async function handleSingleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`${location.origin}/api/vending-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(singleUploadForm),
    });

    const data = await res.json();

    if (data.errorMessage) {
      return toast.error(data.errorMessage);
    }

    toast.success("Request submitted");

    // clear upload form after submission
    for (const key in singleUploadForm) {
      if (key === "price_type") {
        singleUploadForm[key] = "profit";
      } else {
        singleUploadForm[key] = "";
      }
    }

    setLoading(false);
  }

  async function handleFileChange() {
    const rows = await readXlsxFile(uploadRef.current.files[0]);
    const formattedRows = [];

    const rowTemplate = {};
    rows[0].forEach((header) => (rowTemplate[header] = ""));

    rows.slice(1).forEach((row) => {
      let index = 0;
      const rowObj = { ...rowTemplate };

      for (const key in rowObj) {
        rowObj[key] = row[index];
        index++;
      }
      formattedRows.push(rowObj);
    });

    setUploadedData(formattedRows);
  }

  async function handleUploadSubmit(e) {
    e.preventDefault();
    if (uploadedData.length < 1) {
      return toast.error("Please upload a file before submitting");
    }

    setLoading(true);

    const res = await fetch(`${location.origin}/api/vending-request-upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rows: uploadedData,
      }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success(data.success);
      setUploadedData([]);
      setLoading(false);
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
        <>
          <form
            onSubmit={handleSingleSubmit}
            className={styles.vendingSingleForm}
          >
            <label htmlFor="description_1" className="label">
              Description 1
            </label>
            <input
              type="text"
              name="description_1"
              id="description_1"
              className="input"
              onChange={handleSingleUploadFormChange}
              value={singleUploadForm.description_1}
              required
            />
            <label htmlFor="description_2" className="label">
              Description 2 (optional)
            </label>
            <input
              type="text"
              name="description_2"
              id="description_2"
              className="input"
              onChange={handleSingleUploadFormChange}
              value={singleUploadForm.description_2}
            />
            <label htmlFor="mfg" className="label">
              MFG
            </label>
            <input
              type="text"
              name="mfg"
              id="mfg"
              className="input"
              onChange={handleSingleUploadFormChange}
              value={singleUploadForm.mfg}
            />
            <label htmlFor="mfg_number" className="label">
              MFG Number
            </label>
            <input
              type="number"
              name="mfg_number"
              id="mfg_number"
              className="input"
              onChange={handleSingleUploadFormChange}
              value={singleUploadForm.mfg_number}
              required
            />
            <label htmlFor="issue_qty" className="label">
              Issue Quantity
            </label>
            <input
              type="number"
              name="issue_qty"
              id="issue_qty"
              className="input"
              onChange={handleSingleUploadFormChange}
              value={singleUploadForm.issue_qty}
              required
            />
            <label htmlFor="supply_net_number" className="label">
              Supply Net Number (optional)
            </label>
            <input
              type="number"
              name="supply_net_number"
              id="supply_net_number"
              className="input"
              onChange={handleSingleUploadFormChange}
              value={singleUploadForm.supply_net_number}
            />
            <label htmlFor="customer" className="label">
              Customer
            </label>
            <input
              type="text"
              name="customer"
              id="customer"
              className="input"
              onChange={handleSingleUploadFormChange}
              value={singleUploadForm.customer}
            />
            <label htmlFor="min" className="label">
              Min
            </label>
            <input
              type="number"
              name="min"
              id="min"
              className="input"
              onChange={handleSingleUploadFormChange}
              value={singleUploadForm.min}
              required
            />
            <label htmlFor="max" className="label">
              Max
            </label>
            <input
              type="number"
              name="max"
              id="max"
              className="input"
              onChange={handleSingleUploadFormChange}
              value={singleUploadForm.max}
              style={{ width: "100%" }}
              required
            />

            <label htmlFor="price" className="label">
              Price
            </label>

            <label htmlFor="profit" style={{ fontSize: "14px" }}>
              Profit
            </label>
            <input
              type="radio"
              name="price_type"
              id="profit"
              value="profit"
              checked={singleUploadForm.price_type === "profit"}
              onChange={handleSingleUploadFormChange}
            />
            <label htmlFor="margin" style={{ fontSize: "14px" }}>
              Margin
            </label>
            <input
              type="radio"
              name="price_type"
              id="margin"
              value="margin"
              checked={singleUploadForm.price_type === "margin"}
              onChange={handleSingleUploadFormChange}
            />
            <div className={styles.priceInputWrap}>
              <p className={styles.profitSymbol}>
                {singleUploadForm.price_type === "profit" && "$"}
              </p>
              <input
                type="number"
                name="price"
                id="price"
                className="input"
                onChange={handleSingleUploadFormChange}
                value={singleUploadForm.price}
                style={
                  singleUploadForm.price_type === "profit"
                    ? {
                        paddingLeft: ".8rem",
                      }
                    : { paddingRight: "1.1rem" }
                }
                required
              />
              <p className={styles.marginSymbol}>
                {singleUploadForm.price_type === "margin" && "%"}
              </p>
            </div>

            <label htmlFor="sales_rep" className="label">
              Sales Rep
            </label>
            <select
              name="sales_rep"
              id="sales_rep"
              className="dropdown"
              required
              value={singleUploadForm.sales_rep}
              onChange={handleSingleUploadFormChange}
            >
              <option></option>
              <option value="ronnie_turner">Ronnie Turner</option>
              <option value="john_narum">John Narum</option>
              <option value="jimmy_shelton">Jimmy Shelton</option>
            </select>

            <button className={`btn ${styles.vendingSingleFormBtn}`}>
              Submit
            </button>
          </form>
        </>
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
