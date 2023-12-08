'use client';

import { useLayoutEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

export default function Layout({ children }) {
  const router = useRouter();
  let [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    const handleRouteChange = async () => {
      const supabase = createClientComponentClient();
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      if (!data.user) return router.push('/');
      setLoading(false);
      // user.current = data.user;
    };
    handleRouteChange();
  }, [router]);

  if (loading) return 'Loading...';

  // return 'Loading...';
  if (loading === false) return children;
}
