'use client';
import { useEffect, type JSX, type ReactNode } from 'react';
import { coreThunks, useDispatch } from '@/lib/redux';

function ClientProviders({ children }: { children: ReactNode }): JSX.Element {
  const dispatch = useDispatch();
  useEffect(() => {
    // client initail
    dispatch(coreThunks.initailizeAsync());

    return () => {};
  }, []);

  return <>{children}</>;
}

export default ClientProviders;
