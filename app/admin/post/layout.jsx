'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Layout({ children }) {
  const router = useRouter();
  // let user = useRef(null);
  let [loading, setLoading] = useState();

  useEffect(() => {
    const handleRouteChange = async () => {
      const supabase = createClientComponentClient();
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      setLoading(false);
      if (!data.user) return router.push('/');
      // user.current = data.user;
    };
    handleRouteChange();
  }, [router]);

  // if (user.current !== null) return children;

  if (loading) return 'Loading...';

  // return 'Loading...';
  if (!loading) return children;
}
