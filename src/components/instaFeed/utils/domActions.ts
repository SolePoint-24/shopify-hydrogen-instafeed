declare global {
  interface Window {
    instafeedSettings?: { sound: boolean; modalOpen?: string };
  }
}

export const toggleSound = (element?: HTMLElement) => {
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

export const togglePlay = (element?: HTMLElement) => {
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
    video.play().catch(() => {});
    if (playBtn) {
      playBtn.classList.remove('paused');
      playBtn.classList.add('playing');
      playBtn.setAttribute('aria-label', 'Pause');
    }
  } else {
    video.pause();
    if (playBtn) {
      playBtn.classList.remove('playing');
      playBtn.classList.add('paused');
      playBtn.setAttribute('aria-label', 'Play');
    }
  }
};
