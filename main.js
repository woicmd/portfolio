(function () {

  /* ── HAMBURGER MENU ──────────────────────────────────── */
  const hamburger = document.getElementById('navHamburger');
  const overlay   = document.getElementById('navOverlay');
  const closeBtn  = document.getElementById('navClose');

  function openMenu()  { overlay.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
  function closeMenu() { overlay.classList.remove('is-open'); document.body.style.overflow = ''; }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (closeBtn)  closeBtn.addEventListener('click', closeMenu);

  if (overlay) {
    overlay.querySelectorAll('.nav-overlay-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ── ABSTRACT TOGGLE ─────────────────────────────────── */
  const abstractWrap   = document.querySelector('.abstract-wrap');
  const abstractToggle = document.getElementById('abstractToggle');

  if (abstractToggle && abstractWrap) {
    abstractToggle.addEventListener('click', () => {
      const isOpen = abstractWrap.classList.toggle('is-open');
      abstractToggle.textContent = isOpen ? 'show less ↑' : 'show more ↓';
    });
  }

  /* ── PROJECT DOTS ────────────────────────────────────── */
  const grid      = document.getElementById('projectsGrid');
  const dotsWrap  = document.getElementById('projectsDots');
  const leftBtn   = document.getElementById('projLeft');
  const rightBtn  = document.getElementById('projRight');

  if (grid && dotsWrap) {
    const cards = grid.querySelectorAll('.project-card');
    const count = cards.length;

    /* build dots */
    const dots = Array.from({ length: count }, (_, i) => {
      const d = document.createElement('div');
      d.className = 'projects-dot' + (i === 0 ? ' active' : '');
      dotsWrap.appendChild(d);
      return d;
    });

    function getActiveIndex() {
      const mid = grid.scrollLeft + grid.offsetWidth / 2;
      let best = 0;
      cards.forEach((card, i) => {
        const cardMid = card.offsetLeft + card.offsetWidth / 2;
        if (Math.abs(cardMid - mid) < Math.abs(cards[best].offsetLeft + cards[best].offsetWidth / 2 - mid)) {
          best = i;
        }
      });
      return best;
    }

    function updateDots() {
      const idx = getActiveIndex();
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    function updateArrows() {
      if (!leftBtn || !rightBtn) return;
      const atStart = grid.scrollLeft <= 5;
      const atEnd   = grid.scrollLeft + grid.offsetWidth >= grid.scrollWidth - 5;
      leftBtn.style.opacity       = atStart ? '0.25' : '1';
      leftBtn.style.pointerEvents = atStart ? 'none'  : 'auto';
      rightBtn.style.opacity      = atEnd   ? '0.25' : '1';
      rightBtn.style.pointerEvents= atEnd   ? 'none'  : 'auto';
    }

    function getCardWidth() {
      const card = grid.querySelector('.project-card');
      return card ? card.offsetWidth + 10 : 300;
    }

    grid.addEventListener('scroll', () => { updateDots(); updateArrows(); });

    if (leftBtn)  leftBtn.addEventListener('click',  () => grid.scrollBy({ left: -getCardWidth(), behavior: 'smooth' }));
    if (rightBtn) rightBtn.addEventListener('click', () => grid.scrollBy({ left:  getCardWidth(), behavior: 'smooth' }));

    updateDots();
    updateArrows();
  }

})();
