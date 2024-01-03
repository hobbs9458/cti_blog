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
    id: "",
    min: "",
    max: "",
    status: "",
    is_complete: "",
  });
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(null);

  const usersWithUpdatePermission = ["it", "sales", "logistics"];

  useEffect(() => {
    async function getVendingRequest() {
      setLoading(true);
      const res = await fetch(
        `${location.origin}/api/vending-request?id=${reqId}`
      );

      const data = await res.json();

      if (data.errorMessage) {
        toast.error(data.errorMessage);
      }

      const { id, min, max, status, is_complete } = data.request;

      setRequestFormData({
        id,
        min,
        max,
        status,
        is_complete,
      });
      setRequest(data.request);
      setUserRoles(data.userRoles);
      setComments(data.request.vending_request_comments);
      setLoading(false);
    }

    getVendingRequest();
  }, [reqId]);

  function handleEditFormChange(e) {
    const { name, value, type, checked } = e.target;

    if (!name || !value) {
      return;
    }

    setRequestFormData({
      ...requestFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function getComments() {
    const commentsRes = await fetch(
      `${location.origin}/api/vending-request-comments?reqId=${request.id}`
    );

    const commentsData = await commentsRes.json();

    if (commentsData.errorMessage) {
      return toast.error(
        "Error getting comments. Please try again or contact an administrator."
      );
    }

    return commentsData.comments;
  }

  async function handleUpdateRequestFormSubmit(e) {
    e.preventDefault();

    setLoading(true);

    const res = await fetch(`${location.origin}/api/vending-request`, {
      method: "PATCH",
      "Content-Type": "application/json",
      body: JSON.stringify({ requestFormData }),
    });

    const updatedRequest = await res.json();

    if (updatedRequest.errorMessage) {
      return toast.error(updatedRequest.errorMessage);
    }

    // compare the original request and the updated request to identify which fields have changed
    const updated = {};

    for (const key in request) {
      if (updatedRequest.hasOwnProperty(key)) {
        if (request[key] !== updatedRequest[key]) {
          updated[key] = updatedRequest[key];
        }
      }
    }

    // toast if a change is detected, otherwise shouldn't be an update unless there's a field on the data that is not on the request
    if (Object.keys(updated).length > 0) {
      setRequest(updatedRequest);
      toast.success("Request updated");

      // auto generate a comment indicating what has updated
      let autoComment = "updated this request: \n\n";

      for (const key in updated) {
        autoComment += `${key.replace(/_/g, " ").toUpperCase()} updated from ${
          typeof request[key] === "number"
            ? request[key]
            : request[key].toString().toUpperCase()
        } to ${
          typeof updated[key] === "number"
            ? updated[key]
            : updated[key].toString().toUpperCase()
        }\n`;
      }

      const res = await fetch(
        `${location.origin}/api/vending-request-comments`,
        {
          method: "POST",
          "Content-Type": "application/json",
          body: JSON.stringify({
            comment: autoComment,
            requestId: request.id,
            isAuto: true,
          }),
        }
      );

      const data = await res.json();

      if (data.errorMessage) {
        return toast.error(data.errorMessage);
      }

      if (data.successMessage) {
        const comments = await getComments();
        if (comments) {
          setComments(comments);
        }
      }
    }

    setLoading(false);
  }

  async function handleSubmitComment(e) {
    e.preventDefault();

    if (comment === "") {
      return toast.error("Cannot submit blank comment");
    }

    setLoading(true);

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

    const comments = await getComments();

    if (comments) {
      setComments(comments);
      setComment("");
    }

    setLoading(false);
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <main className={styles.vendingRequestMain}>
      <div className={styles.requestInfoWrap}>
        <h1 className={styles.requestHeader}> Vending Request {request.id}</h1>
        <div className={styles.requestInfo}>
          <p>Created At: {readableDate(request.created_at)}</p>
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
          <form
            className={styles.requestUpdateForm}
            onSubmit={handleUpdateRequestFormSubmit}
          >
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
                  <label htmlFor="isComplete">Mark Completed</label>
                  <input
                    type="checkbox"
                    name="is_complete"
                    id="isComplete"
                    onChange={handleEditFormChange}
                    value={requestFormData.is_complete}
                  />
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
        <h2>Add a Comment</h2>
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
        <h2 className="center-text">Request Feed</h2>
        {comments.length > 0 &&
          comments.map((comment, id) => {
            console.log(comment);
            return (
              <div key={id} className={styles.comment}>
                <div className={styles.commentNameDateWrap}>
                  {comment.is_auto === true ? (
                    <b>
                      <p>Update</p>
                    </b>
                  ) : (
                    <p>{capitalize(comment.user, "_")}</p>
                  )}
                  <p>{readableDate(comment.created_at)}</p>
                </div>
                <hr style={{ marginTop: "0", marginBottom: "1rem" }} />
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {comment.is_auto
                    ? capitalize(comment.user, "_") + " " + comment.comment
                    : comment.comment}
                </div>
              </div>
            );
          })}
        {comments.length < 1 && <p>No comments or updates for this request</p>}
      </div>
    </main>
  );
}

export default Request;
