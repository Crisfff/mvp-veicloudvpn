const themeMetas = [...document.querySelectorAll('meta[name="theme-color"]')];
const STORY_DURATION = 7000;
let activeController = null;

function setThemeColor(color){
  themeMetas.forEach(meta => meta.setAttribute('content', color));
}

function createStoryController(openerId, viewerId){
  const opener = document.getElementById(openerId);
  const viewer = document.getElementById(viewerId);
  if (!opener || !viewer) return null;

  const slides = [...viewer.querySelectorAll('.story-slide')];
  const progress = [...viewer.querySelectorAll('.story-progress-fill')];
  const closeButton = viewer.querySelector('[data-story-close]');
  const prevButton = viewer.querySelector('[data-story-prev]');
  const nextButton = viewer.querySelector('[data-story-next]');

  let current = 0;
  let timer = null;
  let touchStartX = null;

  function resetProgress(){
    progress.forEach(fill => {
      fill.classList.remove('running');
      fill.style.animation = 'none';
      void fill.offsetWidth;
      fill.style.animation = '';
    });
  }

  function render(index){
    current = Math.max(0, Math.min(index, slides.length - 1));

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === current);
    });

    viewer.classList.toggle('story-two', current === 1);
    viewer.classList.toggle('story-three', current === 2);

    resetProgress();
    progress.forEach((fill, i) => {
      fill.classList.toggle('done', i < current);
      if (i === current) {
        requestAnimationFrame(() => fill.classList.add('running'));
      }
    });

    clearTimeout(timer);
    timer = setTimeout(() => {
      if (current < slides.length - 1) {
        render(current + 1);
      } else {
        close();
      }
    }, STORY_DURATION);
  }

  function open(){
    if (activeController && activeController !== controller) {
      activeController.close();
    }

    activeController = controller;
    current = 0;
    viewer.classList.add('open');
    viewer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('story-open');
    let viewerTheme = '#111111';
    if (viewer.classList.contains('desert-story-viewer')) viewerTheme = '#9c6947';
    if (viewer.classList.contains('streaming-story-viewer')) viewerTheme = '#101820';
    setThemeColor(viewerTheme);
    render(0);
  }

  function close(){
    clearTimeout(timer);
    viewer.classList.remove('open', 'story-two', 'story-three');
    viewer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('story-open');
    resetProgress();
    progress.forEach(fill => fill.classList.remove('done'));
    setThemeColor('#ffffff');

    if (activeController === controller) {
      activeController = null;
    }
  }

  function next(){
    if (current < slides.length - 1) render(current + 1);
    else close();
  }

  function previous(){
    if (current > 0) render(current - 1);
    else render(0);
  }

  const controller = {open, close, next, previous};

  opener.addEventListener('click', open);
  closeButton?.addEventListener('click', close);
  nextButton?.addEventListener('click', next);
  prevButton?.addEventListener('click', previous);

  viewer.addEventListener('touchstart', event => {
    touchStartX = event.changedTouches[0]?.clientX ?? null;
  }, {passive:true});

  viewer.addEventListener('touchend', event => {
    if (touchStartX === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX;
    const delta = endX - touchStartX;
    touchStartX = null;

    if (Math.abs(delta) < 46) return;
    if (delta < 0) next();
    else previous();
  }, {passive:true});

  viewer.querySelectorAll('[data-story-action]').forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      clearTimeout(timer);
    });
  });

  return controller;
}

createStoryController('openStory', 'storyViewer');
createStoryController('openPublicWifiStory', 'publicWifiViewer');
createStoryController('openStreamingStory', 'streamingViewer');

document.addEventListener('keydown', event => {
  if (!activeController) return;

  if (event.key === 'Escape') activeController.close();
  if (event.key === 'ArrowRight') activeController.next();
  if (event.key === 'ArrowLeft') activeController.previous();
});
