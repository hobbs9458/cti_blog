"use client";

import { useState, useEffect } from "react";

import { Hourglass } from "react-loader-spinner";
import styles from "./vendingSubmissions.module.css";

function VendingRequests() {
  const [requests, setRequests] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSubmissions() {
      const res = await fetch(`${location.origin}/api/vending-request`);
      const data = await res.json();
      setRequests(data);
      setLoading(false);
    }

    getSubmissions();
  }, []);

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
    <main className={styles.vendingSubmissions}>
      <h1 className={styles.vendingSubmissionsHeader}>
        Vending Request Submissions
      </h1>
      <table className={styles.vendingSubmissionsTable}>
        <thead>
          <tr>
            <th className={styles.th}>ID</th>
            <th className={styles.th}>Created At</th>
            <th className={styles.th}>Item</th>
            <th className={styles.th}>Min</th>
            <th className={styles.th}>Max</th>
            <th className={styles.th}>Requested By</th>
            <th className={styles.th}>Submitted By</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => {
            return (
              <tr key={request.id}>
                <td className={styles.td}>{request.id}</td>
                <td className={styles.td}>{request.created_at.slice(0, 10)}</td>
                <td className={styles.td}>{request.Item}</td>
                <td className={styles.td}>{request.Min}</td>
                <td className={styles.td}>{request.Max}</td>
                <td className={styles.td}>{request.req_name}</td>
                <td className={styles.td}>{request.sub_name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}

export default VendingRequests;
