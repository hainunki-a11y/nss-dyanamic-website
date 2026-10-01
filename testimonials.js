/* 
  NSS TSEC Mumbai - Testimonials Logic
  Powered by GSAP & ScrollTrigger
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. --- GSAP ANIMATIONS ---
    gsap.registerPlugin(ScrollTrigger);

    // Hero Text Animation
    const heroTl = gsap.timeline();
    heroTl.from('.testimonials-title', {
        opacity: 0,
        y: -20,
        duration: 1.2,
        ease: 'power3.out'
    }).from('.testimonials-subtitle', {
        opacity: 0,
        y: 10,
        duration: 1,
        ease: 'power2.out'
    }, '-=0.8');

    // Staggered Card Animation
    gsap.to('.testimonial-card', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.testimonials-grid',
            start: 'top 85%'
        }
    });

    // 2. --- MODAL POPUP LOGIC ---
    const modal = document.getElementById('testimonial-modal');
    const closeBtn = document.querySelector('.close-modal');
    const readMoreBtns = document.querySelectorAll('.read-more-btn');

    // Modal elements to update
    const modalImg = document.getElementById('modal-img');
    const modalName = document.getElementById('modal-name');
    const modalRoleYear = document.getElementById('modal-role-year');
    const modalThought = document.getElementById('modal-thought');

    // Open Modal
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.testimonial-card');
            
            // Get data from current card
            const img = card.querySelector('.card-image img').src;
            const name = card.querySelector('.volunteer-name').innerText;
            const role = card.querySelector('.volunteer-role').innerText;
            const year = card.querySelector('.volunteer-year').innerText;
            const thought = card.querySelector('.volunteer-thought').innerText;

            // Populate modal
            modalImg.src = img;
            modalName.innerText = name;
            modalRoleYear.innerText = `${role} | ${year}`;
            modalThought.innerText = thought;

            // Activate modal
            modal.classList.remove('closing');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop scrolling
        });
    });

    // Close Modal with smooth transition
    function closeModal() {
        modal.classList.add('closing');
        // Wait for the CSS transition (250ms) to complete before removing the active class
        setTimeout(() => {
            modal.classList.remove('active');
            modal.classList.remove('closing');
            document.body.style.overflow = ''; // Enable scrolling
        }, 250);
    }

    closeBtn.addEventListener('click', closeModal);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // ESC key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
