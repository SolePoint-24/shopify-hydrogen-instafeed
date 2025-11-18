import { useEffect, useRef } from 'react';
import { togglePlay, toggleSound } from '../utils/domActions';

export function useInstafeedEvents({
  shouldAttach,
}: {
  shouldAttach: boolean;
}) {
  const isWiredRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !shouldAttach || isWiredRef.current)
      return;

    const handleBridgeClick = (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      // .closest() checks the element itself AND its parents
      const btn = target.closest(
        '.instafeed-sound-button, .instafeed-video-control',
      ) as HTMLElement | null;

      if (btn && btn.hasAttribute('data-video-id')) {
        event.preventDefault();
        event.stopPropagation();
        (event as any).stopImmediatePropagation?.();

        if (btn.classList.contains('instafeed-sound-button')) {
          toggleSound(btn);
        } else {
          togglePlay(btn);
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
  }, [shouldAttach]);
}
