import { useCallback, useRef, useState } from 'react';

export type ScriptStatus = 'idle' | 'loading' | 'ready' | 'error';

type Options = {
  nonce?: string;
  async?: boolean;
  defer?: boolean;
  type?: string;
};

export function useLazyScriptLoad(src: string, opts: Options = {}) {
  const { nonce, async = true, defer = true, type = 'text/javascript' } = opts;
  const [status, setStatus] = useState<ScriptStatus>('idle');
  const hasRequestedRef = useRef(false);
  const promiseRef = useRef<Promise<unknown> | null>(null);

  const loadScript = useCallback(() => {
    if (!src) return Promise.reject(new Error('No script src'));
    if (hasRequestedRef.current && promiseRef.current)
      return promiseRef.current;

    hasRequestedRef.current = true;
    setStatus('loading');

    promiseRef.current = new Promise((resolve, reject) => {
      // Check if script already exists
      let script = document.querySelector<HTMLScriptElement>(
        `script[src="${src}"]`,
      );

      const finalize = (ok: boolean) => {
        const s: ScriptStatus = ok ? 'ready' : 'error';
        script?.setAttribute('data-status', s);
        setStatus(s);
        if (ok) {
          resolve(undefined);
        } else {
          reject(new Error(`Failed to load: ${src}`));
        }
      };

      if (!script) {
        script = document.createElement('script');
        script.src = src;
        script.async = async;
        script.defer = defer;
        script.type = type;
        script.setAttribute('data-status', 'loading');
        if (nonce) script.nonce = nonce;

        const onLoad = () => {
          script?.removeEventListener('load', onLoad);
          script?.removeEventListener('error', onError);
          finalize(true);
        };
        const onError = () => {
          script?.removeEventListener('load', onLoad);
          script?.removeEventListener('error', onError);
          finalize(false);
        };

        script.addEventListener('load', onLoad);
        script.addEventListener('error', onError);
        document.body.appendChild(script);
      } else {
        const current =
          (script.getAttribute('data-status') as ScriptStatus) || 'ready';
        setStatus(current);
        if (current === 'ready') {
          resolve(undefined);
        } else {
          reject(new Error(`Status: ${current}`));
        }
      }
    });

    return promiseRef.current;
  }, [src, async, defer, type, nonce]);

  return { loadScript, status };
}
