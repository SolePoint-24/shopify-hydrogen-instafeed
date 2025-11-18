import { useEffect, useState } from 'react';

export function useShopifyReady({
  onShopifyInitialised,
}: {
  onShopifyInitialised: () => void;
}) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const maxRetryCount = 20;
    let currentRetryCount = 0;

    const checkShopifyReady = () => {
      const w = window as any;
      const shopifyReady =
        typeof w.Shopify === 'object' &&
        w.Shopify !== null &&
        'customerPrivacy' in w.Shopify;

      if (shopifyReady) {
        // Fix the routes object for Headless/Hydrogen
        w.Shopify.routes = { root: '/' };
        onShopifyInitialised();
      } else {
        if (currentRetryCount <= maxRetryCount) {
          currentRetryCount++;
          setTimeout(checkShopifyReady, 100);
        } else {
          console.warn(' Shopify object not found after retries');
        }
      }
    };

    checkShopifyReady();
  }, []);
}
