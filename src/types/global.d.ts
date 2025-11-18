export {};

declare global {
  interface Window {
    instafeedToggleSound?: (element?: HTMLElement) => void;
    instafeedTogglePlay?: (element?: HTMLElement) => void;
    instafeedSettings?: { sound: boolean; modalOpen?: string };
    instafeedInitialized?: boolean;
  }
}