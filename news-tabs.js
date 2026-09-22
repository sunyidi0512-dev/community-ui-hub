(() => {
  const body = document.body;
  const art = document.querySelector('.art-clip');
  const topTabs = document.querySelector('.top-tabs');
  const scrollContent = document.querySelector('.scroll-content');
  const slider = document.querySelector('.tab-slider');
  const skinKey = 'community-ui-hub-skin';
  const pageForPath = () => window.location.pathname.endsWith('News-Top.html') ? 'top' : 'watchlist';
  let skin = sessionStorage.getItem(skinKey) || 'light';
  let page = body.dataset.newsPage || pageForPath();
  let sliderPosition;

  const sliderTarget = (nextPage) => {
    const tab = document.querySelector(`[data-tab-target="${nextPage}"]`);
    return tab.offsetLeft + (tab.offsetWidth - slider.offsetWidth) / 2;
  };
  const moveSlider = (nextPage, animate = false) => {
    const nextPosition = sliderTarget(nextPage);
    if (animate && sliderPosition !== undefined && sliderPosition !== nextPosition) {
      const distance = nextPosition - sliderPosition;
      const stretch = 1 + Math.min(Math.abs(distance) / slider.offsetWidth, 2.4);
      slider.style.transformOrigin = distance > 0 ? 'left center' : 'right center';
      slider.animate([
        { transform: `translateX(${sliderPosition}px) scaleX(1)` },
        { transform: `translateX(${sliderPosition}px) scaleX(${stretch})`, offset: 0.42 },
        { transform: `translateX(${nextPosition}px) scaleX(.92)`, offset: 0.82 },
        { transform: `translateX(${nextPosition}px) scaleX(1)` }
      ], { duration: 460, easing: 'cubic-bezier(.16, 1, .3, 1)' });
    }
    sliderPosition = nextPosition;
    slider.style.transform = `translateX(${nextPosition}px)`;
  };
  const apply = () => {
    body.dataset.newsPage = page;
    art.dataset.page = page;
    art.dataset.skin = skin;
    topTabs.dataset.page = page;
    topTabs.dataset.skin = skin;
    document.querySelectorAll('.top-tabs-art[data-page]').forEach((node) => node.classList.toggle('is-active', node.dataset.page === page && node.dataset.skin === skin));
    document.querySelectorAll('.art-clip img[data-page]').forEach((image) => image.classList.toggle('is-active', image.dataset.page === page && image.dataset.skin === skin));
    document.querySelectorAll('.tb-nav-bar [data-page]').forEach((node) => node.classList.toggle('is-active', node.dataset.page === page && node.dataset.skin === skin));
    moveSlider(page);
  };
  const setSkin = (nextSkin) => {
    skin = nextSkin;
    sessionStorage.setItem(skinKey, skin);
    apply();
    scrollContent.scrollTop = 0;
  };
  const setPage = (nextPage, updateUrl) => {
    page = nextPage;
    art.dataset.target = nextPage;
    moveSlider(nextPage, true);
    window.setTimeout(() => {
      if (updateUrl) {
        const isLocalPreview = window.location.protocol === 'file:' || window.location.hostname === '127.0.0.1';
        const targetUrl = isLocalPreview
          ? `http://127.0.0.1:4173/${nextPage === 'top' ? 'News-Top.html' : 'News-Watchlist.html'}`
          : (nextPage === 'top' ? 'News-Top.html' : 'News-Watchlist.html');
        window.location.assign(targetUrl);
        return;
      }
      apply();
      delete art.dataset.target;
      scrollContent.scrollTop = 0;
    }, 460);
  };

  document.querySelectorAll('[data-tab-target]').forEach((button) => button.addEventListener('click', () => {
    const target = button.dataset.tabTarget;
    if (target !== page) setPage(target, true);
  }));
  document.querySelectorAll('[data-skin-choice]').forEach((button) => button.addEventListener('click', () => setSkin(button.dataset.skinChoice)));
  window.addEventListener('popstate', () => { page = pageForPath(); apply(); scrollContent.scrollTop = 0; });
  apply();
})();
