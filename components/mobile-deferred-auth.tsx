'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { FallbackAuthProvider } from '@/lib/auth-context-base';

/**
 * On mobile: defer loading AuthProvider (and Firebase) until after 'load' so auth/iframe
 * is not on the critical path. Desktop: load AuthProvider immediately after mount.
 * Keeps desktop unchanged; improves mobile FCP/LCP.
 */
export function MobileDeferredAuth({ children }: { children: ReactNode }) {
  const [Provider, setProvider] = useState<React.ComponentType<{ children: ReactNode }> | null>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
    setIsMobile(mobile);

    const loadAuth = () =>
      import('@/lib/auth-context').then((m) => setProvider(() => m.AuthProvider));

    if (!mobile) {
      loadAuth();
      return;
    }
    if (document.readyState === 'complete') {
      loadAuth();
      return;
    }
    const onLoad = () => loadAuth();
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  if (Provider) return <Provider>{children}</Provider>;
  return <FallbackAuthProvider>{children}</FallbackAuthProvider>;
}
