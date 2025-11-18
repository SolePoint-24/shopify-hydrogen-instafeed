import { useEffect, useRef, useState } from 'react';
import { useLazyScriptLoad } from '../../../hooks/useLazyScriptLoad';

// Options for the user of the package
export type UseInstafeedOptions = {
  scriptSrc: string;
  nonce?: string;
};

declare global {
  interface Window {
    instafeedToggleSound?: (element?: HTMLElement) => void;
    instafeedTogglePlay?: (element?: HTMLElement) => void;
    instafeedSettings?: { sound: boolean; modalOpen?: string };
    // We use 'any' here to safely inject the routes property
    Shopify?: any;
  }
}

export function useInstafeed({ scriptSrc, nonce }: UseInstafeedOptions) {
  const isWiredRef = useRef(false);
  const [isShopifyReady, setIsShopifyReady] = useState(false);

  // 1. Initialize Lazy Loader
  const { loadScript, status } = useLazyScriptLoad(scriptSrc, {
    nonce,
    async: true,
    defer: true,
  });

  // 2. Wait for Shopify Environment (Privacy/Analytics wrapper)
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
        // Shim the routes object so the external script doesn't crash
        w.Shopify.routes = { root: '/' };
        setIsShopifyReady(true);
      } else {
        if (currentRetryCount <= maxRetryCount) {
          currentRetryCount++;
          setTimeout(checkShopifyReady, 100);
        } else {
          console.warn('[Instafeed] Shopify object not found.');
        }
      }
    };

    checkShopifyReady();
  }, []);

  // 3. Define Global Helpers (Play/Mute logic)
  useEffect(() => {
    if (!isShopifyReady || typeof window === 'undefined') return;

    window.instafeedToggleSound = (element?: HTMLElement) => {
      if (!element) return;
      const videoId = element.getAttribute('data-video-id');
      if (!videoId) return;
      const video = document.getElementById(videoId) as HTMLVideoElement | null;
      if (!video) return;

      video.muted = !video.muted;

      if (!window.instafeedSettings) window.instafeedSettings = { sound: true };
      window.instafeedSettings.sound = !video.muted;

      document.querySelectorAll('.instafeed-sound-button').forEach((btn) => {
        btn.classList.toggle('sound-on', !video.muted);
        btn.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute');
      });
    };

    window.instafeedTogglePlay = (element?: HTMLElement) => {
      let videoId: string | null = null;
      let playBtn: HTMLElement | null = null;

      if (element) {
        videoId = element.getAttribute('data-video-id');
        playBtn = element;
      } else if (window.instafeedSettings?.modalOpen) {
        const modalId = window.instafeedSettings.modalOpen;
        const possibleVideo =
          (document.getElementById(`video-${modalId}`) as HTMLElement | null) ||
          (document.getElementById(modalId) as HTMLElement | null);
        if (possibleVideo) {
          videoId = possibleVideo.id;
          playBtn = document.querySelector(
            `.instafeed-video-control[data-video-id="${videoId}"]`,
          ) as HTMLElement | null;
        }
      }

      if (!videoId) return;

      const video = document.getElementById(videoId) as HTMLVideoElement | null;
      if (!video) return;

      if (video.paused) {
        void video.play().catch(() => {});
        if (playBtn) {
          playBtn.classList.add('instafeed-playing');
          playBtn.setAttribute('aria-label', 'Pause');
        }
      } else {
        video.pause();
        if (playBtn) {
          playBtn.classList.remove('instafeed-playing');
          playBtn.setAttribute('aria-label', 'Play');
        }
      }
    };

    // Trigger script download
    loadScript().catch(() => {});
  }, [isShopifyReady, loadScript]);

  // 4. Event Wiring (Global Delegation)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (status !== 'ready' || !isShopifyReady || isWiredRef.current) return;

    const handleBridgeClick = (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      // Check for direct class match or closest parent match
      if (
        target.matches('.instafeed-sound-button, .instafeed-video-control') ||
        target.closest('.instafeed-sound-button, .instafeed-video-control')
      ) {
        const btn = target.matches(
          '.instafeed-sound-button, .instafeed-video-control',
        )
          ? target
          : target.closest('.instafeed-sound-button, .instafeed-video-control');

        if (btn && btn.hasAttribute('data-video-id')) {
          event.preventDefault();
          event.stopPropagation();
          (event as any).stopImmediatePropagation?.();

          if (btn.classList.contains('instafeed-sound-button')) {
            window.instafeedToggleSound?.(btn as HTMLElement);
          } else {
            window.instafeedTogglePlay?.(btn as HTMLElement);
          }
        }
      }
    };

    document.addEventListener('click', handleBridgeClick, true);
    document.addEventListener('click', handleBridgeClick, false);

    isWiredRef.current = true;

    return () => {
      isWiredRef.current = false;
      document.removeEventListener('click', handleBridgeClick, true);
      document.removeEventListener('click', handleBridgeClick, false);
    };
  }, [status, isShopifyReady]);

  // 5. Cleanup Watcher (MutationObserver to remove Cart Icon)
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
