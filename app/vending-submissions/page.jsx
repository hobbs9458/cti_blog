"use client";

import { useState, useEffect, useRef } from "react";

import { capitalize } from "@/utils/functions";

import { Hourglass } from "react-loader-spinner";
import { toast } from "react-toastify";
import styles from "./vendingSubmissions.module.css";

function VendingRequests() {
  const [requests, setRequests] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    id: "",
    createdAt: "",
    item: "",
    min: "",
    max: "",
    reqBy: "",
    subBy: "",
    status: "",
  });
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const editFormRef = useRef(null);

  async function getSubmissions() {
    const res = await fetch(`${location.origin}/api/vending-request`);
    const data = await res.json();
    setRequests(data);
    setLoading(false);
  }

  useEffect(() => {
    getSubmissions();
  }, []);

  function handleOutsideClick(e) {
    if (editFormRef.current && !editFormRef.current.contains(e.target)) {
      setIsEditFormOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function handleTableClick(e) {
    if (e.target.tagName === "TD") {
      handleRowEdit(e);
    }
  }

  function handleRowEdit(e) {
    const row = Array.from(e.target.parentElement.childNodes);
    const fields = Object.keys(editForm);
    const updatedForm = { ...editForm };

    row.forEach((col, i) => {
      const fieldToSet = fields[i];
      updatedForm[fieldToSet] = col.innerText;
    });

    setEditForm(updatedForm);
    setIsEditFormOpen(true);
  }

  function handleEditFormChange(e) {
    const { name, value } = e.target;

    setEditForm({
      ...editForm,
      [name]: value,
    });
  }

  async function handleEditFormSubmit(e) {
    e.preventDefault();

    const res = await fetch(`${location.origin}/api/vending-request-edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        editForm,
      }),
    });

    const data = await res.json();

    if (data.error === null) {
      toast.success("Edit successful");
      getSubmissions();
      setEditForm({
        id: "",
        createdAt: "",
        item: "",
        min: "",
        max: "",
        reqBy: "",
        subBy: "",
        status: "",
      });
      setIsEditFormOpen(false);
    } else {
      toast.error("Edit unsuccessful, please try again");
    }
  }

  if (loading) {
    return (
      <div className={styles.vendingSubmissionsLoaderWrap}>
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
    <>
      {isEditFormOpen && <div className={styles.editFormOverlay}></div>}
      <main className={styles.vendingSubmissions}>
        <h1 className={styles.vendingSubmissionsHeader}>
          Vending Request Submissions
        </h1>
        <table
          className={styles.vendingSubmissionsTable}
          onClick={handleTableClick}
        >
          <thead>
            <tr>
              <th className={styles.th}>ID</th>
              <th className={styles.th}>Created At</th>
              <th className={styles.th}>Item</th>
              <th className={styles.th}>Min</th>
              <th className={styles.th}>Max</th>
              <th className={styles.th}>Requested By</th>
              <th className={styles.th}>Submitted By</th>
              <th className={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => {
              return (
                <tr key={request.id} className={styles.tr}>
                  <td className={styles.td}>{request.id}</td>
                  <td className={styles.td}>
                    {request.created_at.slice(0, 10)}
                  </td>
                  <td className={styles.td}>{request.item}</td>
                  <td className={styles.td}>{request.min}</td>
                  <td className={styles.td}>{request.max}</td>
                  <td className={styles.td}>
                    {capitalize(request.requested_by, "_")}
                  </td>
                  <td className={styles.td}>
                    {capitalize(request.submitted_by, "_")}
                  </td>
                  <td className={styles.td}>{request.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {isEditFormOpen && (
          <form
            className={styles.editRowForm}
            onSubmit={handleEditFormSubmit}
            ref={editFormRef}
          >
            <h4>Edit Row</h4>
            <p className={styles.editFormInfo}>ID: {editForm.id}</p>
            <p className={styles.editFormInfo}>
              Created At: {editForm.createdAt}
            </p>
            <p className={styles.editFormInfo}>
              Requested By: {editForm.reqBy}
            </p>
            <p className={`mb1 ${styles.editFormInfo}`}>
              Submitted By: {editForm.subBy}
            </p>
            <label htmlFor="item" className="label">
              Item
            </label>
            <input
              type="text"
              name="item"
              id="item"
              className="input"
              onChange={handleEditFormChange}
              value={editForm.item}
            />
            <label htmlFor="min" className="label">
              Min
            </label>
            <input
              type="text"
              name="min"
              id="min"
              className="input"
              onChange={handleEditFormChange}
              value={editForm.min}
            />
            <label htmlFor="max" className="label">
              Max
            </label>
            <input
              type="text"
              name="max"
              id="max"
              className="input"
              onChange={handleEditFormChange}
              value={editForm.max}
            />

            <label htmlFor="status" className="label">
              Status
            </label>
            <input
              type="text"
              name="status"
              id="status"
              className="input"
              onChange={handleEditFormChange}
              value={editForm.status}
            />
            <button className={`btn ${styles.editFormBtn}`}>
              Edit Request
            </button>
          </form>
        )}
      </main>
    </>
  );
}

export default VendingRequests;
