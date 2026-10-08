const openStoryButton = document.getElementById('openStory');
const storyViewer = document.getElementById('storyViewer');
const storyClose = document.getElementById('storyClose');
const storyPrev = document.getElementById('storyPrev');
const storyNext = document.getElementById('storyNext');
const storySlides = [...document.querySelectorAll('.story-slide')];
const storyProgress = [...document.querySelectorAll('.story-progress-fill')];
const themeMetas = [...document.querySelectorAll('meta[name="theme-color"]')];

const STORY_DURATION = 7000;
let currentStory = 0;
let storyTimer = null;
let touchStartX = null;

function setThemeColor(color){
  themeMetas.forEach(meta => meta.setAttribute('content', color));
}

function resetProgressAnimations(){
  storyProgress.forEach(fill => {
    fill.classList.remove('running');
    fill.style.animation = 'none';
    void fill.offsetWidth;
    fill.style.animation = '';
  });
}

function renderStory(index){
  currentStory = Math.max(0, Math.min(index, storySlides.length - 1));

  storySlides.forEach((slide, i) => {
    slide.classList.toggle('active', i === currentStory);
  });

  storyViewer.classList.toggle('story-two', currentStory === 1);

  resetProgressAnimations();

  storyProgress.forEach((fill, i) => {
    fill.classList.toggle('done', i < currentStory);
    if (i === currentStory) {
      requestAnimationFrame(() => fill.classList.add('running'));
    }
  });

  clearTimeout(storyTimer);
  storyTimer = setTimeout(() => {
    if (currentStory < storySlides.length - 1) {
      renderStory(currentStory + 1);
    } else {
      closeStories();
    }
  }, STORY_DURATION);
}

function openStories(){
  currentStory = 0;
  storyViewer.classList.add('open');
  storyViewer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('story-open');
  renderStory(0);
}

function closeStories(){
  clearTimeout(storyTimer);
  storyViewer.classList.remove('open', 'story-two');
  storyViewer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('story-open');
  resetProgressAnimations();
  storyProgress.forEach(fill => fill.classList.remove('done'));
  setThemeColor('#ffffff');
}

function nextStory(){
  if (currentStory < storySlides.length - 1) {
    renderStory(currentStory + 1);
  } else {
    closeStories();
  }
}

function previousStory(){
  if (currentStory > 0) {
    renderStory(currentStory - 1);
  } else {
    renderStory(0);
  }
}

openStoryButton?.addEventListener('click', openStories);
storyClose?.addEventListener('click', closeStories);
storyNext?.addEventListener('click', nextStory);
storyPrev?.addEventListener('click', previousStory);

storyViewer?.addEventListener('touchstart', event => {
  touchStartX = event.changedTouches[0]?.clientX ?? null;
}, {passive:true});

storyViewer?.addEventListener('touchend', event => {
  if (touchStartX === null) return;
  const endX = event.changedTouches[0]?.clientX ?? touchStartX;
  const delta = endX - touchStartX;
  touchStartX = null;

  if (Math.abs(delta) < 46) return;
  if (delta < 0) nextStory();
  else previousStory();
}, {passive:true});

document.querySelectorAll('[data-story-action]').forEach(button => {
  button.addEventListener('click', event => {
    event.stopPropagation();
    clearTimeout(storyTimer);
  });
});

document.addEventListener('keydown', event => {
  if (!storyViewer?.classList.contains('open')) return;

  if (event.key === 'Escape') closeStories();
  if (event.key === 'ArrowRight') nextStory();
  if (event.key === 'ArrowLeft') previousStory();
});
