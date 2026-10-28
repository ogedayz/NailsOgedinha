document.addEventListener('DOMContentLoaded', () => {
  // 1. BARRA DE PROGRESSO DE ROLAGEM
  const scrollProgress = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (scrollProgress) scrollProgress.style.width = `${progress}%`;
  });

  // 2. HERO SLIDER / CARROSSEL
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.getElementById('slider-dots');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  const progressBar = document.getElementById('slider-progress');
  let currentSlide = 0;
  let slideTimer = null;
  const SLIDE_TIME = 6000;

  function initSlider() {
    if (!slides.length) return;
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
    startAutoSlide();
  }

  function goToSlide(index) {
    slides[currentSlide].classList.remove('is-active');
    document.querySelectorAll('.slider-dot')[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('is-active');
    document.querySelectorAll('.slider-dot')[currentSlide].classList.add('active');
    resetProgressBar();
  }

  function resetProgressBar() {
    if (!progressBar) return;
    progressBar.style.width = '0%';
    setTimeout(() => { progressBar.style.width = '100%'; }, 50);
  }

  function startAutoSlide() {
    stopAutoSlide();
    resetProgressBar();
    slideTimer = setInterval(() => goToSlide(currentSlide + 1), SLIDE_TIME);
  }

  function stopAutoSlide() {
    if (slideTimer) clearInterval(slideTimer);
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); startAutoSlide(); });
    nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); startAutoSlide(); });
  }

  initSlider();

  // 3. FLIP CARDS 3D DE SERVIÇOS
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      card.classList.toggle('is-flipped');
    });
  });

  // 4. GALERIA COM FILTROS E LIGHTBOX
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let currentGalleryIndex = 0;

  const galleryData = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    alt: item.querySelector('img').alt,
    caption: item.querySelector('span').textContent
  }));

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        const cat = item.dataset.category;
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  function openLightbox(index) {
    currentGalleryIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
  }

  function updateLightbox() {
    const data = galleryData[currentGalleryIndex];
    lightboxImg.src = data.src;
    lightboxImg.alt = data.alt;
    lightboxCaption.textContent = data.caption;
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
    updateLightbox();
  });
  if (lightboxNext) lightboxNext.addEventListener('click', () => {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
    updateLightbox();
  });

  // 5. FORMULÁRIO DE AGENDAMENTO VIA WHATSAPP
  const formAgendamento = document.getElementById('form-agendamento');
  if (formAgendamento) {
    formAgendamento.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('nome').value;
      const telefone = document.getElementById('telefone').value;
      const servico = document.getElementById('servico').value;
      const data = document.getElementById('data').value;

      const msg = `Olá Juliana! Gostaria de agendar:%0A• *Nome:* ${encodeURIComponent(nome)}%0A• *WhatsApp:* ${encodeURIComponent(telefone)}%0A• *Serviço:* ${encodeURIComponent(servico)}%0A• *Data Pretendida:* ${encodeURIComponent(data)}`;
      window.open(`https://wa.me/5511999998888?text=${msg}`, '_blank');
    });
  }

  // 6. COOKIES BANNER
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies');
  if (banner && acceptBtn) {
    if (localStorage.getItem('julianaOgedaCookies') === 'sim') {
      banner.classList.add('oculto');
    }
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('julianaOgedaCookies', 'sim');
      banner.classList.add('oculto');
    });
  }
});