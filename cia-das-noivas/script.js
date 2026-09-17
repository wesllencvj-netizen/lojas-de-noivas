document.documentElement.classList.add('js');

window.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).has('motion-off');
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  const loader = document.querySelector('.page-loader');

  document.getElementById('year').textContent = new Date().getFullYear();

  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.setAttribute('aria-hidden', String(!open));
    if (window.gsap && !reduceMotion) {
      gsap.to(menu, { autoAlpha: open ? 1 : 0, duration: open ? .45 : .28, ease: open ? 'power3.out' : 'power2.in', onStart: () => { if(open) menu.style.visibility = 'visible'; }, onComplete: () => { if(!open) menu.style.visibility = 'hidden'; } });
      gsap.to('.mobile-menu > a', { y: open ? 0 : 18, autoAlpha: open ? 1 : 0, stagger: open ? .05 : -.03, duration: .38, ease: 'power3.out' });
    } else {
      menu.style.visibility = open ? 'visible' : 'hidden'; menu.style.opacity = open ? '1' : '0';
    }
  };
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 24), { passive: true });

  if (!window.gsap || !window.ScrollTrigger) {
    loader.remove();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.set('.reveal-text, .reveal-item, .reveal-image', { opacity: 1 });

  if (reduceMotion) {
    loader.remove();
    return;
  }

  const lenis = window.Lenis ? new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: .9 }) : null;
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.to(loader, { autoAlpha: 0, duration: .55, delay: .45, onComplete: () => loader.remove() })
    .from('.site-header > *', { y: -12, autoAlpha: 0, duration: .55, stagger: .06, clearProps: 'transform,opacity,visibility' }, '-=.1')
    .from('[data-hero]', { y: 34, autoAlpha: 0, clipPath: 'inset(0 0 100% 0)', duration: 1, stagger: .13 }, '-=.4')
    .from('.scroll-cue', { autoAlpha: 0, x: -12, duration: .6 }, '-=.35');

  gsap.to('[data-parallax]', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 } });

  gsap.utils.toArray('.reveal-text').forEach(el => gsap.from(el, { y: 34, autoAlpha: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
  gsap.utils.toArray('.reveal-item').forEach(el => gsap.from(el, { y: 40, autoAlpha: 0, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
  gsap.utils.toArray('.reveal-image').forEach(el => {
    const image = el.querySelector('img');
    gsap.fromTo(el, { clipPath: 'inset(12% 0 12% 0)' }, { clipPath: 'inset(0% 0 0% 0)', duration: 1.15, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    if(image) gsap.from(image, { scale: 1.12, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  document.querySelectorAll('.magnetic').forEach(button => {
    button.addEventListener('pointermove', e => {
      const r = button.getBoundingClientRect();
      gsap.to(button, { x: (e.clientX - r.left - r.width / 2) * .12, y: (e.clientY - r.top - r.height / 2) * .16, duration: .25, overwrite: true });
    });
    button.addEventListener('pointerleave', () => gsap.to(button, { x: 0, y: 0, duration: .55, ease: 'elastic.out(1,.45)' }));
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
});
