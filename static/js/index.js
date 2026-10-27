(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroVideos = [...document.querySelectorAll('[data-hero-video]')];

  function playHero(index) {
    if (!heroVideos.length) return;
    heroVideos.forEach((video, videoIndex) => {
      video.classList.toggle('is-active', videoIndex === index);
      if (videoIndex !== index) video.pause();
    });
    const current = heroVideos[index];
    current.currentTime = 0;
    current.play().catch(() => {});
  }

  heroVideos.forEach((video, index) => {
    video.addEventListener('ended', () => playHero((index + 1) % heroVideos.length));
  });
  if (!reducedMotion) playHero(0);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const videos = [...entry.target.querySelectorAll('video[data-autoplay]')];
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        if (!reducedMotion && videos.length) {
          videos.forEach((video) => { video.currentTime = 0; });
          requestAnimationFrame(() => {
            videos.forEach((video) => video.play().catch(() => {}));
          });
        }
      } else {
        videos.forEach((video) => video.pause());
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -4% 0px' });

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

  const copyButton = document.querySelector('[data-copy-bib]');
  copyButton?.addEventListener('click', async () => {
    const citation = document.querySelector('#bibtex-code')?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(citation);
      copyButton.textContent = 'Copied';
      setTimeout(() => { copyButton.textContent = 'Copy'; }, 1600);
    } catch {
      copyButton.textContent = 'Select text';
    }
  });
})();
