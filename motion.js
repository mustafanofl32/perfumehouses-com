/* Motion layer. anime.js v4 as an ES module from jsDelivr.
   Rule followed throughout: the page is complete and readable before this runs. The script sets
   the "from" state itself and animates to the natural state, so if the module fails to load or
   the visitor asked for reduced motion, nothing is hidden. */

const { REEL_SCRIPT } = require("./reel.js");
const MOTION = `<script type="module">
import { animate, createTimeline, stagger, utils, onScroll } from 'https://cdn.jsdelivr.net/npm/animejs@4/+esm';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const qa = (s, r = document) => Array.from(r.querySelectorAll(s));

/* ---------- nav: measure height, slide the pill under the current link ---------- */
const navbar = document.querySelector('.nav-shell') || document.querySelector('.navbar');
function setNav(){ if (navbar) document.documentElement.style.setProperty('--nav-h', Math.round(navbar.getBoundingClientRect().height + 14) + 'px'); }
setNav(); addEventListener('resize', setNav);
if (window.ResizeObserver && navbar) new ResizeObserver(setNav).observe(navbar);

const pill = document.querySelector('.nav__pill');
function movePill(el){
  if (!pill || !el || innerWidth < 821) return;
  const p = el.parentElement.getBoundingClientRect(), r = el.getBoundingClientRect();
  animate(pill, { left: r.left - p.left, width: r.width, opacity: 1, duration: reduce ? 0 : 420, ease: 'out(3)' });
}
const currentLink = document.querySelector('.nav a[aria-current]');
if (currentLink) requestAnimationFrame(() => movePill(currentLink));
qa('.nav a').forEach(a => a.addEventListener('mouseenter', () => movePill(a)));
const nav = document.querySelector('.nav');
if (nav) nav.addEventListener('mouseleave', () => movePill(currentLink));

if (reduce) { /* everything below is decoration only */ } else {

/* ---------- split a heading into words for staggered entrances ---------- */
function splitWords(el){
  if (el.dataset.split) return qa('.w > i', el);
  const words = el.textContent.trim().split(/\\s+/);
  el.textContent = '';
  words.forEach((w, i) => {
    const span = document.createElement('span');
    span.className = 'w';
    span.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top';
    const inner = document.createElement('i');
    inner.style.cssText = 'display:inline-block;font-style:inherit';
    inner.textContent = w;
    span.appendChild(inner);
    el.appendChild(span);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
  });
  el.dataset.split = '1';
  return qa('.w > i', el);
}

/* ---------- entrance timeline for whatever is above the fold ---------- */
const heroHeading = document.querySelector('[data-hero] h1');
const tl = createTimeline({ defaults: { ease: 'out(3)' } });
if (heroHeading){
  const parts = splitWords(heroHeading);
  utils.set(parts, { y: '110%' });
  tl.add(parts, { y: ['110%', '0%'], duration: 900, delay: stagger(60) }, 0);
}
qa('[data-hero] .kicker, [data-hero] .lede, [data-hero] .cta-row, [data-hero] form, [data-hero] .crumbs').forEach((el, i) => {
  utils.set(el, { opacity: 0, y: 18 });
  tl.add(el, { opacity: [0, 1], y: [18, 0], duration: 700 }, 220 + i * 90);
});

/* ---------- reveal on scroll ---------- */
const revealables = qa('[data-reveal]');
revealables.forEach(el => {
  const kids = el.dataset.reveal === 'children' ? Array.from(el.children) : [el];
  utils.set(kids, { opacity: 0, y: 26 });
  el._kids = kids;
});
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    animate(e.target._kids, { opacity: [0, 1], y: [26, 0], duration: 760, delay: stagger(70), ease: 'out(3)' });
    io.unobserve(e.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
revealables.forEach(el => io.observe(el));

/* ---------- counters ---------- */
qa('[data-count]').forEach(el => {
  const target = Number(el.dataset.count);
  const o = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const obj = { n: 0 };
      animate(obj, { n: target, duration: 1500, ease: 'out(4)', onUpdate: () => { el.textContent = Math.round(obj.n).toLocaleString(); } });
      o.unobserve(el);
    });
  }, { threshold: 0.4 });
  o.observe(el);
});

/* ---------- marquee ---------- */
qa('.marquee__row').forEach(row => {
  row.innerHTML += row.innerHTML;
  animate(row, { x: ['0%', '-50%'], duration: 42000, ease: 'linear', loop: true });
});

/* ---------- second clip: only load it when its section is close ---------- */
const spot = document.querySelector('[data-clip]');
if (spot){
  const saveData = (navigator.connection && navigator.connection.saveData) || false;
  const o = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      o.unobserve(spot);
      if (saveData) return;
      const v = document.createElement('video');
      v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
      v.setAttribute('playsinline',''); v.setAttribute('aria-hidden','true');
      v.poster = spot.dataset.poster;
      v.addEventListener('loadeddata', () => {
        const img = spot.querySelector('img'); if (img) img.remove();
        spot.prepend(v); const p = v.play(); if (p && p.catch) p.catch(() => {});
        animate(v, { opacity: [0, 1], duration: 800 });
      });
      v.src = spot.dataset.clip;
    });
  }, { rootMargin: '300px' });
  o.observe(spot);
}

/* ---------- table rows fade in as you scroll the index ---------- */
const rows = qa('table.idx tbody tr').slice(0, 40);
if (rows.length){
  utils.set(rows, { opacity: 0 });
  const o = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      animate(e.target, { opacity: [0, 1], duration: 420, ease: 'out(2)' });
      o.unobserve(e.target);
    });
  }, { threshold: 0.05 });
  rows.forEach(r => o.observe(r));
  setTimeout(() => utils.set(qa('table.idx tbody tr').slice(40), { opacity: 1 }), 0);
}

} /* end !reduce */
${REEL_SCRIPT}
</script>`;

module.exports = { MOTION };
