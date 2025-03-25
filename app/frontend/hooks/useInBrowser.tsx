import { DependencyList, useEffect } from 'react';

// https://remix.run/docs/en/main/guides/constraints#initializing-browser-only-apis
export function useInBrowser(func: () => void, dependencies: DependencyList = []) {
  const isBrowser = typeof document !== 'undefined' && typeof window !== 'undefined';
  useEffect(() => {
    if (isBrowser) {
      func();
    } else {
      console.warn('This hook can only be used in the browser.');
    }
    // Spreading is necessary to ensure correct matching behaviour.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBrowser, ...dependencies]);
}
