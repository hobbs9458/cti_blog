"use client";

import { useEffect, useMemo, useState } from "react";

import { usePathname } from "next/navigation";

import Loader from "@/app/components/Loader";
import { capitalize } from "@/utils/functions";
import { readableDate } from "@/utils/functions";

import styles from "./vendingRequest.module.css";

import { toast } from "react-toastify";

function Request() {
  const pathname = usePathname();
  const reqId = pathname.split("/").slice(-1)[0];
  const [userRoles, setUserRoles] = useState([]);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestFormData, setRequestFormData] = useState({
    min: "",
    max: "",
    status: "",
    completed: "",
  });
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(null);

  const usersWithUpdatePermission = ["it", "sales", "logistics"];

  useEffect(() => {
    async function getVendingRequest() {
      const res = await fetch(
        `${location.origin}/api/vending-request?id=${reqId}`
      );
      const data = await res.json();

      if (data.errorMessage) {
        toast.error(data.errorMessage);
      }

      const {
        min,
        max,
        status,
        vending_request_comments: comments,
      } = data.request;

      setRequestFormData({
        min,
        max,
        status,
      });

      setUserRoles(data.userRoles);
      setRequest(data.request);
      setComments(comments);
      setLoading(false);
    }
    getVendingRequest();
  }, [reqId]);

  const localDate = useMemo(() => {
    if (request) {
      const date = new Date(request.created_at);
      return date.toLocaleString();
    }
  }, [request]);

  function handleEditFormChange(e) {
    const { name, value } = e.target;

    if (!name || !value) {
      return;
    }

    setRequestFormData({
      ...requestFormData,
      [name]: value,
    });
  }

  async function handleSubmitComment(e) {
    e.preventDefault();

    if (comment === "") {
      return toast.error("Cannot submit blank comment");
    }

    const res = await fetch(`${location.origin}/api/vending-request-comments`, {
      method: "POST",
      "Content-Type": "application/json",
      body: JSON.stringify({ comment, requestId: request.id }),
    });

    const data = await res.json();

    if (data.errorMessage) {
      toast.error(data.errorMessage);
    } else if (data.successMessage) {
      toast.success(data.successMessage);
    }

    const commentsRes = await fetch(
      `${location.origin}/api/vending-request-comments?reqId=${request.id}`
    );
    const commentsData = await commentsRes.json();

    setComments(commentsData.comments);
    setComment("");
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <main className={styles.vendingRequestMain}>
      <div className={styles.requestInfoWrap}>
        <h1 className={styles.requestHeader}> Vending Request {request.id}</h1>
        <div className={styles.requestInfo}>
          <p>Created At: {localDate}</p>
          <p>Requested By: {capitalize(request.requested_by, "_")}</p>
          <p>Submitted By: {capitalize(request.submitted_by, "_")}</p>
          <p>Item: {request.item}</p>
          <p>Min: {request.min}</p>
          <p>Max: {request.max}</p>
          <p>Current Status: {request.status}</p>
        </div>
      </div>
      {usersWithUpdatePermission.some((role) => userRoles.includes(role)) && (
        <div className={styles.requestUpdateFormWrap}>
          <h2 className={styles.updateRequestHeader}>Update Request</h2>
          <form className={styles.requestUpdateForm}>
            <div className={styles.requestUpdateFormContentWrap}>
              {userRoles.includes("sales") && (
                <>
                  <label htmlFor="min" className="label">
                    Min
                  </label>
                  <input
                    type="number"
                    name="min"
                    id="min"
                    className="input"
                    onChange={handleEditFormChange}
                    value={requestFormData.min}
                    disabled={!userRoles.includes("sales")}
                  />
                  <label htmlFor="max" className="label">
                    Max
                  </label>
                  <input
                    type="number"
                    name="max"
                    id="max"
                    className="input"
                    onChange={handleEditFormChange}
                    value={requestFormData.max}
                    disabled={!userRoles.includes("sales")}
                  />
                </>
              )}
              {userRoles.includes("logistics") && (
                <>
                  <label htmlFor="status" className="label">
                    Update Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={requestFormData.status}
                    onChange={handleEditFormChange}
                    className="dropdown"
                  >
                    <option></option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="denied">Denied</option>
                  </select>
                </>
              )}
              {userRoles.includes("it") && (
                <div className={styles.updateRequestCheckbox}>
                  <label htmlFor="completed">Mark Completed</label>
                  <input type="checkbox" name="completed" id="completed" />
                </div>
              )}
            </div>
            <button className={`btn standardBtn`} type="submit">
              Submit Update
            </button>
          </form>
        </div>
      )}
      <form className={styles.commentForm} onSubmit={handleSubmitComment}>
        <h2>Leave a Comment</h2>
        {/* <label htmlFor='comment' className='label'>
          Comment
        </label> */}
        <textarea
          name="comment"
          id="comment"
          cols="30"
          rows="10"
          className="text-area"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button className="btn standardBtn">Submit Comment</button>
      </form>
      <div className={styles.commentsWrap}>
        <h2 className="center-text">Comments</h2>
        {comments.map((comment, id) => {
          return (
            <div key={id} className={styles.comment}>
              <div className={styles.commentNameDateWrap}>
                <p>{capitalize(comment.user, "_")}</p>
                <p>{readableDate(comment.created_at)}</p>
              </div>
              <hr style={{ marginTop: "0" }} />
              <div style={{ whiteSpace: "pre-wrap" }}>{comment.comment}</div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default Request;
