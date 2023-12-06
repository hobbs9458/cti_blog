'use client';

// function that connects to supabase and allows us to sign up users, login, logout, connect to db, etc
// it returns a supabase client object which contains methods we use to communicate with supabase
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import AuthForm from '../../components/AuthForm';

export default function SignUp() {
  const [formError, setFormError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e, email, password) => {
    e.preventDefault();

    const supabase = createClientComponentClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // user must verify email before account is verified. signUp sends an email to the one they signed up with asking the user to verify the account. the verification link in the email redirects them back to our app where an api route gets access to a special code in the request url, we send the code to supabase to indicate the user has been verified and we exchange the code for a session for the user. the user get's redirected back to our app logged in.
        emailRedirectTo: `${location.origin}/api/auth`,
      },
    });

    if (error) {
      setFormError(error.message);
    }

    if (!error) {
      router.push('/verify');
    }
  };

  return (
    <main>
      <h2 className='text-center'>Sign Up</h2>
      <AuthForm handleSubmit={handleSubmit} />
      {formError && <div className='error'>{formError}</div>}
    </main>
  );
}
