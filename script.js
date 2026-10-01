/* 
  NSS TSEC Mumbai - Multi-Page Cinematic Logic 
  Powered by GSAP 
*/

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP Plugins
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // --- Hero Text Reveal Animation (Condition: Only on Home) ---
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const heroTl = gsap.timeline({ delay: 0.5 });
    heroTl.from('.hero-title', {
      opacity: 0,
      scale: 0.9,
      duration: 1.5,
      ease: 'power3.out'
    })
    .from('.hero-quote', {
      opacity: 0,
      y: 10,
      duration: 1.2,
      ease: 'power2.out'
    }, '-=0.8');
  }

  // --- Navbar Scroll Effect ---
  const header = document.getElementById('navbar');
  if (header) {
    // If we're on a non-home page, we might want the navbar scrolled by default
    if (window.location.pathname.includes('teams.html')) {
      header.classList.add('scrolled');
    }

    ScrollTrigger.create({
      start: 'top -50',
      onUpdate: (self) => {
        // Toggle 'scrolled' class unless we're on teams.html where it's forced
        if (!window.location.pathname.includes('teams.html')) {
          if (self.direction === 1) {
            header.classList.add('scrolled');
          } else if (self.scroll() < 50) {
            header.classList.remove('scrolled');
          }
        }
      }
    });
  }

  // --- Premium Hero Slider Logic (Condition: Only on Home) ---
  const slides = document.querySelectorAll('.slide');
  const heroSlider = document.getElementById('hero');
  
  if (heroSlider && slides.length > 0) {
    const dotsContainer = document.querySelector('.slider-dots');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    
    let currentIndex = 0;
    let isAnimating = false;
    let slideInterval;

    // Create Dots
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        if (i !== currentIndex) goToSlide(i);
      });
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateDots(index) {
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');
    }

    function goToSlide(index) {
      if (isAnimating || index === currentIndex) return;
      isAnimating = true;

      const prevSlide = slides[currentIndex];
      const nextSlide = slides[index];

      nextSlide.classList.add('active');

      setTimeout(() => {
        prevSlide.classList.remove('active');
        isAnimating = false;
      }, 1000);

      updateDots(index);
      currentIndex = index;
    }

    function nextSlide() {
      let next = (currentIndex + 1) % slides.length;
      goToSlide(next);
    }

    function prevSlideFunc() {
      let prev = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(prev);
    }

    function startAutoPlay() {
      slideInterval = setInterval(nextSlide, 4000);
    }

    function stopAutoPlay() {
      clearInterval(slideInterval);
    }

    startAutoPlay();

    nextBtn.addEventListener('click', () => {
      stopAutoPlay();
      nextSlide();
      startAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
      stopAutoPlay();
      prevSlideFunc();
      startAutoPlay();
    });

    heroSlider.addEventListener('mouseenter', stopAutoPlay);
    heroSlider.addEventListener('mouseleave', startAutoPlay);
  }

  // --- Cross-Page Smooth Scroll Navigation ---
  const navLinks = document.querySelectorAll('.nav-links a, .footer-links a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // If it's a hash link on the CURRENT page
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          gsap.to(window, {
            duration: 1.2,
            scrollTo: {
              y: target,
              offsetY: 80
            },
            ease: "power4.inOut"
          });
        }
      } 
      // If it's a link to another page (like index.html#events or teams.html)
      // just let the browser handle the redirect.
    });
  });

  // --- Letter Splitting for Section Titles ---
  const animateTitles = document.querySelectorAll('.who-we-are-title, .objectives-title, .events-title, .team-title, .magazine-title');
  animateTitles.forEach(title => {
    const text = title.textContent.trim();
    title.innerHTML = text
      .split('')
      .map(char => `<span class="letter">${char === ' ' ? '&nbsp;' : char}</span>`)
      .join('');
  });

  // --- Section Entrance Animations ---

  // Who We Are (Home Only)
  if (document.querySelector('#who-we-are')) {
    const whoWeAreTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#who-we-are',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    whoWeAreTimeline.from('.logo-wrapper', {
      opacity: 0,
      scale: 0.8,
      duration: 1.5,
      ease: 'expo.out'
    })
    .to('.who-we-are-title .letter', {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out'
    }, '-=1')
    .to('.who-we-are-text', {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.3,
      ease: 'power3.out'
    }, '-=0.5');
  }

  // Our Objectives (Home Only)
  if (document.querySelector('#objectives')) {
    const objectivesTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#objectives',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    objectivesTimeline.to('.objectives-title .letter', {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out'
    })
    .to('.objectives-text', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.5')
    .to('.objective-card', {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    }, '-=0.3');
  }

  // Our Events (Home Only)
  if (document.querySelector('#events')) {
    const eventsTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#events',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    eventsTimeline.to('.events-title .letter', {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out'
    })
    .to('.event-card', {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out'
    }, '-=0.5');
  }

  // NSS Magazine Section (Home Only)
  if (document.querySelector('#magazine')) {
    const magazineTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#magazine',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    magazineTimeline.to('.magazine-title .letter', {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.08,
      ease: 'power3.out'
    })
    .from('.magazine-subtitle', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.5')
    .from('.magazine-card', {
      opacity: 0,
      y: 40,
      scale: 0.95,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out'
    }, '-=0.4');
  }

  // Footer Entrance Animation
  if (document.querySelector('.footer')) {
    gsap.from('.footer-main-grid', {
      scrollTrigger: {
        trigger: '.footer',
        start: 'top 90%'
      },
      opacity: 0,
      y: 30,
      duration: 1.2,
      ease: 'power3.out'
    });
  }

  // --- Upgraded Horizontal Council & Slideshow ---
  const councilUpgradedSec = document.getElementById('council-upgraded-section');
  if (councilUpgradedSec) {
    // 1. Animate all team cards on load
    gsap.to('.team-card', {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1,
      stagger: 0.05,
      ease: 'back.out(1.7)'
    });

    // 2. Continuous Marquee Slideshow
    const track = document.getElementById('council-marquee-track');
    const container = document.getElementById('council-marquee-container');

    if (track && container) {
      // Clone cards for infinite loop
      const cards = Array.from(track.children);
      cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
      });

      // Continuous loop animation using GSAP
      const marqueeTl = gsap.to(track, {
        x: () => {
          const totalWidth = track.scrollWidth;
          return -totalWidth / 2;
        },
        duration: 35, // speed in seconds
        ease: "none",
        repeat: -1
      });

      // Pause on hover
      container.addEventListener('mouseenter', () => marqueeTl.pause());
      container.addEventListener('mouseleave', () => marqueeTl.play());

      // Support mobile touch to pause/play
      container.addEventListener('touchstart', () => marqueeTl.pause());
      container.addEventListener('touchend', () => marqueeTl.play());
    }
  }

  // Section Header Divider Reveal
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header.querySelector('.divider'), {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%'
      },
      width: 0,
      duration: 1,
      delay: 0.3
    });
  });
});
