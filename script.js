/* ============================================
   OSTERIA PUNTO E A CAPO — Main Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Page Loader ----
  const loader = document.getElementById('pageLoader');
  window.addEventListener('load', () => {
    loader.classList.add('hidden');
  });

  // Fallback: hide loader if a resource is slow
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1800);


  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // initial check


  // ---- Mobile Nav ----
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  const toggleMobileNav = () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  };

  menuToggle.addEventListener('click', toggleMobileNav);
  navOverlay.addEventListener('click', toggleMobileNav);

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        toggleMobileNav();
      }
    });
  });


  // ---- Smooth Scroll for anchors ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 20;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  // ---- Scroll Reveal Animation ----
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ---- Highlight Today's Schedule ----
  const today = new Date().getDay(); // 0 = Sunday
  const scheduleRows = document.querySelectorAll('.schedule-row');
  scheduleRows.forEach(row => {
    const dayNum = parseInt(row.getAttribute('data-day'));
    if (dayNum === today) {
      row.classList.add('today');
    }
  });


  // ---- Parallax Effect on Hero ----
  const heroImg = document.querySelector('.hero-bg img');
  if (heroImg && window.matchMedia('(min-width: 769px)').matches) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      if (scrolled < window.innerHeight) {
        const parallaxVal = scrolled * 0.3;
        heroImg.style.transform = `scale(1.05) translateY(${parallaxVal}px)`;
      }
    }, { passive: true });
  }


  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinkElements = document.querySelectorAll('.navbar-links a[href^="#"]');

  const highlightNav = () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinkElements.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.style.color = 'var(--color-accent)';
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });


  // ---- Share the restaurant ----
  const shareButton = document.getElementById('shareButton');
  const shareWhatsApp = document.getElementById('shareWhatsApp');
  const shareFeedback = document.getElementById('shareFeedback');
  const shareUrl = window.location.href.split('#')[0];
  const shareText = 'Ho trovato un ristorante da provare insieme: Osteria Punto E A Capo a Cernusco Lombardone.';

  if (shareWhatsApp) {
    shareWhatsApp.href = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
  }

  if (shareButton) {
    shareButton.addEventListener('click', async () => {
      try {
        if (navigator.share) {
          await navigator.share({
            title: 'Osteria Punto E A Capo',
            text: shareText,
            url: shareUrl
          });
          shareFeedback.textContent = 'Grazie per il passaparola.';
          return;
        }

        await navigator.clipboard.writeText(shareUrl);
        shareFeedback.textContent = 'Link copiato: ora puoi inviarlo a chi vuoi.';
      } catch (error) {
        if (error.name !== 'AbortError') {
          shareFeedback.textContent = 'Copia il link dalla barra del browser per condividerlo.';
        }
      }
    });
  }

});
