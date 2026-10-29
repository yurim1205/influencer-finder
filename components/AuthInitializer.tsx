'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/app/stores/useAuthStore';

export function AuthInitializer() {
  // setUser, setLoading을 통해 값을 넣음
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, [setUser, setLoading]);

  return null;
}