document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for generic scroll animations
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));

  const inquiryWidget = document.querySelector('[data-inquiry-widget]');
  const inquiryPanel = inquiryWidget?.querySelector('.floating-inquiry-panel');
  const inquiryOpenButtons = document.querySelectorAll('[data-inquiry-open]');
  const inquiryCloseButton = inquiryWidget?.querySelector('[data-inquiry-close]');
  const inquiryForm = inquiryWidget?.querySelector('[data-inquiry-form]');

  const setInquiryOpen = (isOpen) => {
    if (!inquiryWidget || !inquiryPanel) return;

    inquiryPanel.hidden = !isOpen;
    inquiryOpenButtons.forEach((button) => {
      button.setAttribute('aria-expanded', String(isOpen));
      button.setAttribute('aria-controls', inquiryPanel.id);
    });

    if (isOpen) {
      inquiryPanel.querySelector('.inquiry-form input, .inquiry-form select, .inquiry-form button')?.focus();
    }
  };

  inquiryOpenButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const isOpen = inquiryPanel && !inquiryPanel.hidden;
      setInquiryOpen(!isOpen);
    });
  });

  inquiryCloseButton?.addEventListener('click', () => setInquiryOpen(false));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setInquiryOpen(false);
    }
  });

  inquiryForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!inquiryForm.reportValidity()) return;

    const formData = new FormData(inquiryForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const procedure = formData.get('procedure');
    const subject = encodeURIComponent(`Global Joints inquiry: ${procedure}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nJoint procedure area: ${procedure}`);

    window.location.href = `mailto:hello@asanamedbridge.com?subject=${subject}&body=${body}`;
  });

  // Animated Number Counters
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.getAttribute('data-target');
        const prefix = entry.target.getAttribute('data-prefix') || '';
        const suffix = entry.target.getAttribute('data-suffix') || '';
        let current = 0;
        const duration = 2000; // ms
        const increment = target / (duration / 16); // ~60fps

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            entry.target.innerText = `${prefix}${Math.ceil(current)}${suffix}`;
            requestAnimationFrame(updateCounter);
          } else {
            entry.target.innerText = `${prefix}${target}${suffix}`;
          }
        };
        
        updateCounter();
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));
});
