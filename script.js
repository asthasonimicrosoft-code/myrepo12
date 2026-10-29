(() => {
  const grid = document.getElementById('challengeGrid');
  const cards = [...grid.querySelectorAll('.challenge-card')];
  const buttons = [...document.querySelectorAll('[data-complete]')];
  const filters = [...document.querySelectorAll('.filter')];
  const completionText = document.getElementById('completionText');
  const progressFill = document.getElementById('progressFill');
  const progressCount = document.getElementById('progressCount');
  const progressTitle = document.getElementById('progressTitle');
  const progressSubtitle = document.getElementById('progressSubtitle');
  const toast = document.getElementById('toast');
  const storageKey = 'ecosphere-completed-v1';
  let completed = new Set();
  let toastTimeout;

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) completed = new Set(saved.map(String).filter(id => cards.some(card => card.dataset.id === id)));
  } catch (_) { completed = new Set(); }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
  }
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify([...completed])); } catch (_) { /* Browser storage may be disabled. */ }
  }
  function render() {
    cards.forEach(card => {
      const id = card.dataset.id;
      const done = completed.has(id);
      card.classList.toggle('completed', done);
      const button = card.querySelector('.complete-btn');
      button.setAttribute('aria-pressed', String(done));
      button.innerHTML = done ? 'Completed <span>✓</span>' : 'I did this <span>＋</span>';
    });
    const count = completed.size;
    const percent = (count / cards.length) * 100;
    completionText.textContent = `${count} of ${cards.length} completed`;
    progressFill.style.width = `${percent}%`;
    progressCount.textContent = `${count} / ${cards.length}`;
    if (count === 0) {
      progressTitle.textContent = 'Your impact starts with one.';
      progressSubtitle.textContent = 'Complete a challenge to start your green streak.';
    } else if (count < cards.length) {
      progressTitle.textContent = count === 1 ? 'Your first good action is in!' : 'Look at you, growing change.';
      progressSubtitle.textContent = `${cards.length - count} more ${cards.length - count === 1 ? 'challenge' : 'challenges'} to complete today's set.`;
    } else {
      progressTitle.textContent = 'You did the whole set. Amazing work!';
      progressSubtitle.textContent = 'Small actions, real momentum. Come back and do it again.';
    }
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    const id = String(button.dataset.complete);
    if (completed.has(id)) {
      completed.delete(id);
      showToast('Challenge unchecked. Every step counts.');
    } else {
      completed.add(id);
      const card = cards.find(item => item.dataset.id === id);
      showToast(`Nice work! “${card.querySelector('h3').textContent}” is complete. 🌱`);
    }
    save(); render();
  }));
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(filter => filter.classList.toggle('active', filter === button));
    const selected = button.dataset.filter;
    cards.forEach(card => { card.hidden = selected !== 'all' && card.dataset.category !== selected; });
  }));
  document.getElementById('resetChallenges').addEventListener('click', () => {
    if (completed.size === 0) { showToast('No progress to reset yet. Pick a challenge!'); return; }
    completed.clear(); save(); render(); showToast("Progress reset. A fresh start awaits! 🌿");
  });
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.textContent = isOpen ? '✕' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.textContent = '☰';
  }));
  document.getElementById('year').textContent = new Date().getFullYear();
  render();
})();
