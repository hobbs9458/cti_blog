'use client';

import { useEffect, useMemo, useState } from 'react';

import { usePathname } from 'next/navigation';

import Loader from '@/app/components/Loader';
import { capitalize } from '@/utils/functions';
import { readableDate } from '@/utils/functions';

import styles from './vendingRequest.module.css';

import { toast } from 'react-toastify';
import Link from 'next/link';

function Request() {
  const pathname = usePathname();
  const reqId = pathname.split('/').slice(-1)[0];
  const [userRoles, setUserRoles] = useState([]);
  const [request, setRequest] = useState('');
  const [loading, setLoading] = useState(true);
  const [requestFormData, setRequestFormData] = useState({
    id: '',
    min: '',
    max: '',
    status: '',
    is_complete: '',
    description_1: '',
    description_2: '',
    price: '',
    price_type: '',
    mfg: '',
    mfg_number: '',
    issue_qty: '',
    supply_net_number: '',
    customer: '',
  });
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState('');

  const usersWithUpdatePermission = ['sales', 'logistics'];

  useEffect(() => {
    async function getVendingRequest() {
      setLoading(true);
      const res = await fetch(
        `${location.origin}/api/vending-request?id=${reqId}`
      );

      const data = await res.json();

      if (data.errorMessage) {
        // toast.error(data.errorMessage);
        setLoading(false);
        return;
      }

      const {
        id,
        min,
        max,
        status,
        is_complete,
        description_1,
        description_2,
        price,
        price_type,
        mfg,
        mfg_number,
        issue_qty,
        supply_net_number,
        customer,
      } = data.request;

      setRequestFormData({
        id,
        min,
        max,
        status,
        is_complete,
        description_1,
        description_2,
        price,
        price_type,
        mfg,
        mfg_number,
        issue_qty,
        supply_net_number,
        customer,
      });
      setRequest(data.request);
      setUserRoles(data.userRoles);
      setComments(data.request.vending_request_feed);
      setLoading(false);
    }

    getVendingRequest();
  }, [reqId]);

  function handleEditFormChange(e) {
    const { name, value, type, checked } = e.target;

    if (name === undefined || value === undefined) {
      return;
    }

    setRequestFormData({
      ...requestFormData,
      [name]: type === 'checkbox' ? checked : value,
    });
  }

  async function getComments() {
    const commentsRes = await fetch(
      `${location.origin}/api/vending-request-comments?reqId=${request.id}`
    );

    const commentsData = await commentsRes.json();

    if (commentsData.errorMessage) {
      return toast.error(
        'Error getting comments. Please try again or contact an administrator.'
      );
    }

    return commentsData.comments;
  }

  async function handleUpdateRequestFormSubmit(e) {
    e.preventDefault();

    setLoading(true);

    if (requestFormData.supply_net_number === '') {
      requestFormData.supply_net_number = null;
    }

    const res = await fetch(`${location.origin}/api/vending-request`, {
      method: 'PATCH',
      'Content-Type': 'application/json',
      body: JSON.stringify({ requestFormData }),
    });

    const updatedRequest = await res.json();

    if (updatedRequest.errorMessage) {
      toast.error(updatedRequest.errorMessage);
      setLoading(false);
      return;
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
      toast.success('Request updated');

      // auto generate a comment indicating what has updated.
      // updaters name is added in the api handler
      // if is_completed is present in update, it should always indicate that is_completed has been marked true, as is_completed is only ever changed from false to true and nobody other than IT can change it
      let autoComment;

      console.log('updated', updated);

      if (updated.hasOwnProperty('is_complete')) {
        autoComment = 'has updated the STATUS of this request to COMPLETE.';
      } else {
        autoComment = 'updated this request: \n\n';
        for (const key in updated) {
          autoComment += `${key
            .replace(/_/g, ' ')
            .toUpperCase()} updated from ${
            request[key] === null || request[key] === ''
              ? 'N/A'
              : typeof request[key] === 'number'
              ? request[key]
              : request[key].toString().toUpperCase()
          } to ${
            updated[key] === null || updated[key] === ''
              ? 'N/A'
              : typeof updated[key] === 'number'
              ? updated[key]
              : updated[key].toString().toUpperCase()
          }\n`;
        }
      }

      const res = await fetch(
        `${location.origin}/api/vending-request-comments`,
        {
          method: 'POST',
          'Content-Type': 'application/json',
          body: JSON.stringify({
            comment: autoComment,
            requestId: request.id,
            isUpdate: true,
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

    return setLoading(false);
  }

  async function handleSubmitComment(e) {
    e.preventDefault();

    if (comment === '') {
      return toast.error('Cannot submit blank comment');
    }

    setLoading(true);

    const res = await fetch(`${location.origin}/api/vending-request-comments`, {
      method: 'POST',
      'Content-Type': 'application/json',
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
      setComment('');
    }

    setLoading(false);
    return;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <main className={styles.vendingRequestMain}>
      <div className={styles.requestInfoWrap}>
        <div className={`${styles.menuLinkWrap}`}>
          <Link href='/portal' className={`${styles.menuLink} link`}>
            Portal Home
          </Link>
          <Link
            href='/vending-submissions'
            className={`${styles.menuLink} link`}
          >
            All Submissions
          </Link>
        </div>

        {!request && (
          <h1 style={{ textAlign: 'center', marginTop: '3rem' }}>No Request</h1>
        )}
        {request && (
          <>
            <h1 className={styles.requestHeader}>
              {' '}
              Vending Request {request.id}
            </h1>
            <div className={styles.requestInfo}>
              <p>Created At: {readableDate(request.created_at)}</p>
              <p style={{ fontWeight: '600' }}>
                Current Status:{' '}
                {request.is_complete ? 'Completed' : capitalize(request.status)}
              </p>
              <hr />
              <p>Submitted By: {capitalize(request.submitted_by, '_')}</p>
              <p>Sales Rep: {capitalize(request.sales_rep, '_')}</p>
              <hr />
              <p>Description 1: {request.description_1}</p>
              {request.description_2 && (
                <p>Description 2: {request.description_2}</p>
              )}
              <hr />
              {request.supply_net_number !== '' && (
                <p>Supply Net Number: {request.supply_net_number || 'N/A'}</p>
              )}
              <hr />
              <p>MFG: {request.mfg}</p>
              <p>MFG Number: {request.mfg_number}</p>
              <hr />
              <p>Issue Quantity: {request.issue_qty}</p>
              <hr />
              <p>
                {request.price_type === 'profit'
                  ? 'Profit: '
                  : 'Profit Margin: '}
                {request.price_type === 'profit' && '$'}
                {request.price}
                {request.price_type === 'margin' && '%'}
              </p>
              <hr />
              <p>Min: {request.min}</p>
              <p>Max: {request.max}</p>
              <hr />
              <p>Customer: {request.customer}</p>
            </div>
          </>
        )}
      </div>

      {request && (
        <>
          {/* if item is not approved sales can update data and logistics can update status. if item is approved no editing allowed other than IT marking complete */}
          {(usersWithUpdatePermission.some((role) =>
            userRoles.includes(role)
          ) &&
            request.status !== 'approved') ||
          (userRoles.includes('it') &&
            request.status === 'approved' &&
            request.is_complete === false) ? (
            <div className={styles.requestUpdateFormWrap}>
              <h2 className={styles.updateRequestHeader}>Update Request</h2>
              <form
                className={styles.requestUpdateForm}
                onSubmit={handleUpdateRequestFormSubmit}
              >
                <div className={styles.requestUpdateFormContentWrap}>
                  {userRoles.includes('sales') && (
                    <>
                      <label htmlFor='description_1' className='label'>
                        Description 1
                      </label>
                      <input
                        type='text'
                        name='description_1'
                        id='description_1'
                        className='input'
                        onChange={handleEditFormChange}
                        value={requestFormData.description_1}
                        required
                      />
                      <label htmlFor='description_2' className='label'>
                        Description 2 (optional)
                      </label>
                      <input
                        type='text'
                        name='description_2'
                        id='description_2'
                        className='input'
                        onChange={handleEditFormChange}
                        value={
                          requestFormData.description_2 === null
                            ? ''
                            : requestFormData.description_2
                        }
                      />
                      <label htmlFor='supply_net_number' className='label'>
                        Supply Net Number (optional)
                      </label>
                      <input
                        type='number'
                        min='0'
                        name='supply_net_number'
                        id='supply_net_number'
                        className='input'
                        onChange={handleEditFormChange}
                        value={
                          requestFormData.supply_net_number === null
                            ? ''
                            : requestFormData.supply_net_number
                        }
                      />
                      <label htmlFor='mfg' className='label'>
                        MFG
                      </label>
                      <input
                        type='text'
                        name='mfg'
                        id='mfg'
                        className='input'
                        onChange={handleEditFormChange}
                        value={requestFormData.mfg}
                        required
                      />
                      <label htmlFor='mfg_number' className='label'>
                        MFG Number
                      </label>
                      <input
                        type='number'
                        min='0'
                        name='mfg_number'
                        id='mfg_number'
                        className='input'
                        onChange={handleEditFormChange}
                        value={requestFormData.mfg_number}
                        required
                      />
                      <label htmlFor='issue_qty' className='label'>
                        Issue Quantity
                      </label>
                      <input
                        type='number'
                        min='0'
                        name='issue_qty'
                        id='issue_qty'
                        className='input'
                        onChange={handleEditFormChange}
                        value={requestFormData.issue_qty}
                        required
                      />
                      <label htmlFor='price' className='label'>
                        Price
                        {/* {singleUploadForm.price_type === "margin" ? "%" : "$"} */}
                      </label>

                      <label htmlFor='profit' style={{ fontSize: '14px' }}>
                        Profit
                      </label>
                      <input
                        type='radio'
                        name='price_type'
                        id='profit'
                        value='profit'
                        checked={requestFormData.price_type === 'profit'}
                        onChange={handleEditFormChange}
                        required
                      />
                      <label htmlFor='margin' style={{ fontSize: '14px' }}>
                        Margin
                      </label>
                      <input
                        type='radio'
                        name='price_type'
                        id='margin'
                        value='margin'
                        checked={requestFormData.price_type === 'margin'}
                        onChange={handleEditFormChange}
                        required
                      />
                      <div className={styles.priceInputWrap}>
                        <p className={styles.profitSymbol}>
                          {requestFormData.price_type === 'profit' && '$'}
                        </p>
                        <input
                          type='number'
                          min='0'
                          name='price'
                          id='price'
                          className='input'
                          onChange={handleEditFormChange}
                          value={requestFormData.price}
                          style={
                            requestFormData.price_type === 'profit'
                              ? {
                                  paddingLeft: '.8rem',
                                }
                              : { paddingRight: '1.1rem' }
                          }
                          required
                        />
                        <p className={styles.marginSymbol}>
                          {requestFormData.price_type === 'margin' && '%'}
                        </p>
                      </div>
                      <label htmlFor='min' className='label'>
                        Min
                      </label>
                      <input
                        type='number'
                        name='min'
                        min='0'
                        id='min'
                        className='input'
                        onChange={handleEditFormChange}
                        value={requestFormData.min}
                        required
                      />
                      <label htmlFor='max' className='label'>
                        Max
                      </label>
                      <input
                        type='number'
                        name='max'
                        min='0'
                        id='max'
                        className='input'
                        onChange={handleEditFormChange}
                        value={requestFormData.max}
                        required
                      />
                      <label htmlFor='customer' className='label'>
                        Customer
                      </label>
                      <input
                        type='text'
                        name='customer'
                        id='customer'
                        className='input'
                        onChange={handleEditFormChange}
                        value={requestFormData.customer}
                        required
                      />
                    </>
                  )}
                  {userRoles.includes('logistics') && (
                    <>
                      <label htmlFor='status' className='label'>
                        Update Status
                      </label>
                      <select
                        name='status'
                        id='status'
                        value={requestFormData.status}
                        onChange={handleEditFormChange}
                        className='dropdown'
                        required
                      >
                        <option></option>
                        <option value='pending'>Pending</option>
                        <option value='approved'>Approved</option>
                        <option value='denied'>Denied</option>
                      </select>
                    </>
                  )}
                  {userRoles.includes('it') && (
                    <div className={styles.updateRequestCheckbox}>
                      <label htmlFor='isComplete'>Mark Complete</label>
                      <input
                        type='checkbox'
                        name='is_complete'
                        id='isComplete'
                        onChange={handleEditFormChange}
                        value={requestFormData.is_complete}
                        required
                      />
                    </div>
                  )}
                </div>
                <button
                  className={`btn standardBtn ${styles.updateBtn}`}
                  type='submit'
                >
                  Submit Update
                </button>
              </form>
            </div>
          ) : (
            ''
          )}
          <form className={styles.commentForm} onSubmit={handleSubmitComment}>
            <h2 className={styles.commentHeader}>Add a Comment</h2>
            {/* <label htmlFor='comment' className='label'>
          Comment
        </label> */}
            <textarea
              name='comment'
              id='comment'
              cols='30'
              rows='10'
              className={`${styles.textArea} text-area`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <button className={`${styles.commentBtn} btn standardBtn`}>
              Submit Comment
            </button>
          </form>
          <div className={styles.commentsWrap}>
            <h2 className={`center-text ${styles.feedHeader}`}>Request Feed</h2>
            {comments.length > 0 &&
              comments.map((comment, id) => {
                return (
                  <div key={id} className={styles.comment}>
                    <div className={styles.commentNameDateWrap}>
                      {comment.is_update === true ? (
                        <b>
                          <p>Update</p>
                        </b>
                      ) : (
                        <p>{capitalize(comment.user, '_')}</p>
                      )}
                      <p>{readableDate(comment.created_at)}</p>
                    </div>
                    <hr style={{ marginTop: '0', marginBottom: '1rem' }} />
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                      {comment.is_update
                        ? capitalize(comment.user, '_') + ' ' + comment.comment
                        : comment.comment}
                    </div>
                  </div>
                );
              })}
            {comments.length < 1 && (
              <p>No comments or updates for this request</p>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default Request;
