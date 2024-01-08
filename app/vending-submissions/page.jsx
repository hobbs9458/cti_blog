'use client';

import { useState, useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';

import { capitalize } from '@/utils/functions';

import styles from './vendingSubmissions.module.css';

import Loader from '@/app/components/Loader.jsx';
import { toast } from 'react-toastify';
import Link from 'next/link';

function VendingRequests() {
  const [requests, setRequests] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    let isMounted = true;

    async function getSubmissions() {
      try {
        const res = await fetch(`${location.origin}/api/vending-request`, {
          signal,
        });

        if (!isMounted) {
          // Component is unmounted, do not update state
          return;
        }

        const data = await res.json();
        console.log(data);

        if (data.error) {
          toast.error(
            'There was a problem. Please try again or contact the administrator.'
          );
        } else {
          console.log(data);
          setRequests(data);
          setLoading(false);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted!');
        } else {
          console.log('Error fetching data', error);
        }
      }
    }

    getSubmissions();

    return () => {
      // Abort the request when the component unmounts or when a dependency changes
      isMounted = false;
      controller.abort();
    };
  }, []);

  function handleNavigateToRequestPage(e) {
    // access data link on tr to route to request page
    if (e.target.getAttribute('data-tag') === 'table-data') {
      // have to get parent of parent because using div inside td for styling on table
      router.push(
        e.target.parentElement.parentElement.getAttribute('data-link')
      );
    }
    if (e.target.tagName === 'TD') {
      router.push(e.target.parentElement.getAttribute('data-link'));
    }
  }

  if (loading) {
    return <Loader />;
  }

  if (requests.length < 1) {
    return 'No submissions';
  }

  return (
    <>
      {isEditFormOpen && <div className={styles.editFormOverlay}></div>}
      <main className={styles.vendingSubmissions}>
        <div className={`${styles.menuLinkWrap}`}>
          <Link href='/access' className={`${styles.menuLink} link`}>
            Portal Home
          </Link>
          <Link href='/vending-request' className={`${styles.menuLink} link`}>
            Create Vending Request
          </Link>
        </div>
        <h1 className={styles.vendingSubmissionsHeader}>
          Vending Request Submissions
        </h1>
        <div className={styles.tableWrap}>
          <table
            className={styles.vendingSubmissionsTable}
            onClick={handleNavigateToRequestPage}
          >
            <thead>
              <tr>
                <th className={styles.th} style={{ width: '70px' }}>
                  ID
                </th>
                <th className={styles.th} style={{ width: '120px' }}>
                  Created At
                </th>

                <th className={styles.th} style={{ width: '200px' }}>
                  Sales Rep
                </th>
                <th className={styles.th} style={{ width: '200px' }}>
                  Customer
                </th>
                <th className={styles.th} style={{ width: '200px' }}>
                  MFG
                </th>
                <th className={styles.th} style={{ width: '200px' }}>
                  Desc 1
                </th>
                <th className={styles.th} style={{ width: '200px' }}>
                  SN Number
                </th>

                <th className={styles.th} style={{ width: '200px' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => {
                return (
                  <tr
                    key={request.id}
                    className={styles.tr}
                    data-link={`/vending-submissions/${request.id}`}
                  >
                    <td className={styles.td}>{request.id}</td>
                    <td className={styles.td}>
                      {request.created_at.slice(0, 10)}
                    </td>

                    <td className={styles.td}>
                      {capitalize(request.sales_rep, '_')}
                    </td>
                    <td className={styles.td}>{request.customer}</td>
                    <td className={styles.td}>{request.mfg}</td>

                    <td className={styles.td}>
                      <div
                        style={{ maxHeight: '50px', overflow: 'auto' }}
                        data-tag='table-data'
                      >
                        {request.description_1}
                      </div>
                    </td>

                    <td className={styles.td}>{request.supply_net_number}</td>
                    <td className={styles.td}>
                      {request.is_complete
                        ? 'Complete'
                        : capitalize(request.status)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

export default VendingRequests;
