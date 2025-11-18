import { useEffect, useRef, useState } from 'react';
import { useInstafeedEvents } from './useInstafeedEvents';
import { useLazyScriptLoad } from '../../../hooks/useLazyScriptLoad';
import { useShopifyReady } from '../../../hooks/useShopifyReady';


export type UseInstafeedOptions = {
  scriptSrc: string;
  nonce?: string;
};

declare global {
  interface Window {
    instafeedToggleSound?: (element?: HTMLElement) => void;
    instafeedTogglePlay?: (element?: HTMLElement) => void;
    instafeedSettings?: { sound: boolean; modalOpen?: string };
  }
}

export function useInstafeed({ scriptSrc, nonce }: UseInstafeedOptions) {
  const { loadScript, status } = useLazyScriptLoad(scriptSrc, {
    nonce,
    async: true,
    defer: true,
  });

  useShopifyReady({
    onShopifyInitialised: loadScript,
  });

  const isScriptLoaded = status === 'ready';

  useInstafeedEvents({ shouldAttach: isScriptLoaded });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMutations = (mutations: MutationRecord[]) => {
      const classChanged = mutations.some(
        (m) => m.type === 'attributes' && m.attributeName === 'class',
      );

      if (
        classChanged ||
        document.body.classList.contains('instafeed-body-no-scroll')
      ) {
        const cartIcons = document.querySelectorAll('.instafeed-cart-icon');
        cartIcons.forEach((icon) => icon.remove());
      }
    };

    const observer = new MutationObserver(handleMutations);

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
      childList: true,
      subtree: false,
    });

    // Initial sweep
    document
      .querySelectorAll('.instafeed-cart-icon')
      .forEach((el) => el.remove());

    return () => {
      observer.disconnect();
    };
  }, []);
  return { status };
}
