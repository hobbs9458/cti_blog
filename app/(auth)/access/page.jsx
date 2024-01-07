'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import styles from './access.module.css';
import AuthForm from '../../components/AuthForm';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import LogoutBtn from '../../components/LogoutBtn';
import Loader from '@/app/components/Loader';
import { capitalize } from '@/utils/functions';

const supabase = createClientComponentClient();

export default function Login() {
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  console.log(userName);

  useEffect(() => {
    async function checkSession() {
      setLoading(true);
      const { data: sessionData, error: sessionDataError } =
        await supabase.auth.getSession();

      if (sessionDataError) {
        toast.error(
          'There was a problem. Please try again or contact an administrator.'
        );
        setLoggedIn(false);
        setLoading(false);
      }

      if (sessionData.session) {
        const res = await fetch(
          `${location.origin}/api/user?userId=${sessionData.session.user.id}`
        );

        const data = await res.json();

        if (data.status === 500) {
          toast.error(data.errorMessage);
        }

        if (data.status === 200) {
          setUserName(capitalize(data.data.name, '_').split(' ')[0]);
        }

        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
      setLoading(false);
    }

    checkSession();
  }, []);

  const handleSubmit = async (e, email, password) => {
    e.preventDefault();
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    if (!error) {
      setLoggedIn(true);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <main className={styles.access}>
      <div className={styles.accessWrap}>
        {loggedIn ? (
          <div className={styles.loggedInMenu}>
            <h2 className={`${styles.welcomeText} text-center`}>
              Hello {userName}
            </h2>
            <ul className={styles.accessUl}>
              <li>
                <Link href='/vending-request' className=' link'>
                  Create Vending Request
                </Link>
              </li>
              <li>
                <Link href='/vending-submissions' className='link'>
                  View Vending Submissions
                </Link>
              </li>
            </ul>
            <LogoutBtn setLoggedIn={setLoggedIn} />
          </div>
        ) : (
          <h2 className='text-center'>Login</h2>
        )}

        {/* {loggedIn ? (
          <LogoutBtn setLoggedIn={setLoggedIn} />
        ) : (
          <AuthForm handleSubmit={handleSubmit} />
        )} */}

        {!loggedIn && <AuthForm handleSubmit={handleSubmit} />}
        {error && <div className='error'>{error}</div>}
      </div>
    </main>
  );
}
