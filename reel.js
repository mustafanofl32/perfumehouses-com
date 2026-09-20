/* Cinematic scenes. Three generated clips, each cut into frames with ffmpeg straight from the
   1080p source, each given its own full-screen pinned scene where nothing covers the picture.
   Scrolling through a scene scrubs its frames; ordinary content lives in solid blocks between
   scenes, so the film is never hidden behind a table and never dimmed to make text readable.

   Desktop: 48 WebP frames per scene at 1600x900 (about 2 MB a scene), loaded only when the
   scene is near. Phones: the video sits in a crisp 4:5 stage with the copy below it, fed by
   30 frames at 800x1000 cropped from the centre of the source, so it is not a stretched
   landscape image. Data saver, 2g and reduced motion get the poster frame and no scrubbing. */

const SCENES = {
  bench: { d: 96, m: 72, name: "The bench", alt: "A camera descending from a rack of unlabelled amber bottles to rose petals and vanilla pods on a perfumer's bench" },
  drop:  { d: 96, m: 72, name: "The drop",  alt: "A drop of amber perfume oil falling into a small unlabelled crystal vial" },
  raw:   { d: 96, m: 72, name: "The materials", alt: "A camera rising past dried rose petals and vanilla pods to a shelf of unlabelled amber bottles" }
};

const sceneMarkup = ({ key, index, tall, steps, hero }) => {
  const s = SCENES[key];
  return `
<section class="scene${tall ? " scene--tall" : ""}" id="scene-${key}" data-scene="${key}" data-d="${s.d}" data-m="${s.m}"${hero ? " data-hero" : ""}>
  <div class="scene__pin">
    <div class="scene__stage">
      <img class="scene__still" src="/assets/scenes/${key}-poster2.webp" alt="${s.alt}"${hero ? ' fetchpriority="high"' : ' loading="lazy"'}>
      <canvas class="scene__canvas" aria-hidden="true"></canvas>
      <div class="scene__shade" aria-hidden="true"></div>
    </div>
    <div class="scene__copy">
      ${steps.map((st, i) => `<div class="scene__step"${i === 0 ? " data-active" : ""}>${st}</div>`).join("\n      ")}
    </div>
  </div>
</section>`;
};

const REEL_CSS = `
/* Settling is scripted (see the settle() block): CSS scroll-snap could not be made to fire
   reliably at the spacing these scenes need, and "mandatory" would have trapped the long
   index table between the scenes. */

/* ---------- cinematic scenes ---------- */
.scene{position:relative;height:300vh;background:#08080A;margin-top:0}
.scene--tall{height:360vh}
.scene__pin{position:sticky;top:0;height:100vh;height:100dvh;overflow:hidden;color:#F7F4EE;isolation:isolate}
.scene__stage{position:absolute;inset:0;z-index:0;background:#08080A}
.scene__still,.scene__canvas{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.scene__canvas{opacity:0;transition:opacity .5s ease}
.scene__canvas[data-live]{opacity:1}
/* no full-screen dimming: only a soft corner behind the words and a thin top fade for the nav */
.scene__shade{position:absolute;inset:0;pointer-events:none;
  background:
    radial-gradient(100% 85% at 0% 100%,rgba(8,8,10,.86) 0%,rgba(8,8,10,.5) 42%,transparent 74%),
    linear-gradient(180deg,rgba(8,8,10,.55) 0%,transparent 22%)}
.scene__copy{position:absolute;z-index:2;left:var(--gutter, clamp(18px,4.5vw,64px));
  top:calc(var(--nav-h,124px) + 10px);bottom:clamp(40px,9vh,150px);max-width:min(760px,88vw);
  display:flex;flex-direction:column;justify-content:flex-end}
.scene__step{display:none}
.scene__step[data-active]{display:block}
.scene__copy h1{font-size:clamp(2.4rem,min(7.6vw,12.5vh),7rem);line-height:.97;color:#FBF8F2}
.scene__copy h2{font-size:clamp(2rem,min(5.4vw,10vh),4.8rem);line-height:1;color:#FBF8F2}
.scene__copy .kicker{font-family:"IBM Plex Mono",ui-monospace,SFMono-Regular,monospace;font-size:11.5px;font-weight:400;
  text-transform:uppercase;letter-spacing:.18em;line-height:1.4;margin:0 0 14px;color:#E8B06A}
.scene__copy .lede{font-size:clamp(1rem,min(1.62vw,2.3vh),1.44rem);line-height:1.5;color:rgba(247,244,238,.86);
  margin-top:22px;max-width:40ch;text-shadow:0 1px 18px rgba(0,0,0,.35)}
.scene__copy .cta-row{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}
.scene__copy .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:52px;
  padding:0 26px;border:0;border-radius:999px;font:600 17px/1 inherit;font-family:inherit;text-decoration:none;
  cursor:pointer;background:transparent;transition:background .25s,box-shadow .25s,filter .25s}
.scene__copy .btn--accent:hover{filter:brightness(1.07)}
.scene__copy .btn--ghost{background:transparent;color:#F7F4EE;box-shadow:inset 0 0 0 1px rgba(247,244,238,.45)}
.scene__copy .btn--ghost:hover{background:rgba(247,244,238,.14)}
.scene__copy .btn--accent{background:#E8B06A;color:#17120A}

/* content blocks ride up over the scene with rounded shoulders */
.block{position:relative;z-index:5;background:var(--bg);border-radius:clamp(26px,3.4vw,52px) clamp(26px,3.4vw,52px) 0 0;
  margin-top:calc(-1 * clamp(26px,3.4vw,52px));padding-block:clamp(60px,8vw,130px);
  box-shadow:0 -30px 60px -30px rgba(0,0,0,.45)}
.block section:first-child{margin-top:0}
.block--last{padding-bottom:clamp(30px,4vw,60px)}

/* phones: the film gets a crisp framed stage, the words sit under it, nothing overlaps */
@media (max-width:820px){
  .scene{height:250vh}
  .scene--tall{height:290vh}
  /* the film runs to the edges of the phone: no padding, no rounded box, nothing
     boxing it in. The nav floats over its top, which is what the shade is for. */
  .scene__pin{display:flex;flex-direction:column;padding:0;gap:0;background:#08080A}
  .scene__stage{position:relative;inset:auto;flex:none;width:100%;height:52dvh;border-radius:0;overflow:hidden}
  .scene__shade{display:block;background:linear-gradient(180deg,rgba(8,8,10,.74) 0%,rgba(8,8,10,.18) 24%,transparent 44%)}
  .scene__copy{position:relative;left:auto;top:auto;bottom:auto;max-width:none;flex:1;min-height:0;
    padding:18px var(--gutter,18px) 20px;display:flex;flex-direction:column;justify-content:center}
  .scene__copy h1{font-size:clamp(2.1rem,9.2vw,2.9rem)}
  .scene__copy h2{font-size:clamp(1.8rem,7.6vw,2.4rem)}
  .scene__copy .lede{font-size:1rem;margin-top:12px;text-shadow:none}
  .scene__copy .cta-row{margin-top:16px}
  .scene__copy .btn{min-height:46px;padding:0 20px}
  .scene__copy .btn--ghost{display:none}
}
@media (max-width:820px) and (max-height:720px){
  .scene__stage{height:46dvh}
  .scene__copy .lede{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
  .scene__copy .kicker{margin-bottom:6px}
}
@media (prefers-reduced-motion:reduce){
  .scene,.scene--tall{height:auto}
  .scene__pin{position:relative;height:auto;min-height:88vh}
  .scene__canvas{display:none}
  .scene__step{display:block!important;margin-bottom:34px}
}
`;

const REEL_SCRIPT = `
/* ---------- cinematic scenes: scroll scrubs the frames ---------- */
(function scenes(){
  const all = qa('.scene');
  if (!all.length) return;
  const saveData = (navigator.connection && navigator.connection.saveData) || false;
  const conn = navigator.connection;
  const slow = conn && /2g/.test(conn.effectiveType || '');
  const phoneMq = matchMedia('(max-width: 820px)');

  all.forEach((scene, sceneIndex) => {
    const key = scene.dataset.scene;
    const canvas = scene.querySelector('.scene__canvas');
    const steps = qa('.scene__step', scene);
    let current = 0;

    function showStep(p){
      const i = Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999));
      if (i === current) return;
      current = i;
      steps.forEach((s, n) => { if (n === i) s.setAttribute('data-active',''); else s.removeAttribute('data-active'); });
      if (!reduce) animate(Array.from(steps[i].children), { opacity: [0, 1], y: [24, 0], duration: 640, delay: stagger(70), ease: 'out(3)' });
    }

    if (reduce) return;                       // reduced motion: poster only, all steps visible via CSS

    // captions always follow the scroll, even when frames are not loaded
    const cap = { p: 0 };
    animate(cap, { p: [0, 1], ease: 'linear',
      autoplay: onScroll({ target: scene, enter: 'top top', leave: 'bottom bottom', sync: true }),
      onUpdate: () => showStep(cap.p) });

    if (saveData || slow) return;             // poster only

    const phone = phoneMq.matches;
    const total = Number(phone ? scene.dataset.m : scene.dataset.d);
    const suffix = phone ? 'm3' : 'd2';   // bumped when the phone crop changed, so old files in a cache are never reused
    const ctx = canvas.getContext('2d', { alpha: false });
    const imgs = new Array(total);
    let drawn = -1, target = 0, shown = 0, started = false, raf = 0;

    function size(){
      let w = phone ? 800 : 1600, h = phone ? 1000 : 900;
      for (let k = 0; k < total; k++){ const i = imgs[k]; if (i && i.complete && i.naturalWidth){ w = i.naturalWidth; h = i.naturalHeight; break; } }
      if (canvas.width !== w || canvas.height !== h){ canvas.width = w; canvas.height = h; }
      drawn = -1;
    }
    function ready(k){ const i = imgs[k]; return (i && i.complete && i.naturalWidth) ? i : null; }
    function paint(img, alpha){
      if (alpha < 1) ctx.globalAlpha = alpha;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }
    function draw(f){
      const lo = Math.max(0, Math.min(total - 1, Math.floor(f)));
      const hi = Math.min(total - 1, lo + 1);
      const frac = Math.min(1, Math.max(0, f - lo));
      const a = ready(lo), b = ready(hi);
      const base = a || b;
      if (!base) return;
      const key = Math.round(f * 24);            // redraw only when the blend actually moves
      if (key === drawn) return;
      drawn = key;
      paint(base, 1);
      if (a && b && b !== a && frac > 0.03) paint(b, frac);
      if (!canvas.hasAttribute('data-live')) canvas.setAttribute('data-live', '');
    }
    function load(k, cb){
      if (imgs[k]) return;
      const im = new Image();
      im.decoding = 'async';
      im.src = '/assets/scenes/' + key + '-' + suffix + '-' + String(k + 1).padStart(3, '0') + '.webp';
      imgs[k] = im;
      im.onload = () => cb && cb();
    }
    function start(){
      if (started) return; started = true;
      size();
      addEventListener('resize', () => { draw(shown); });
      const order = [];
      for (let k = 0; k < total; k += 2) order.push(k);
      for (let k = 1; k < total; k += 2) order.push(k);
      let oi = 0;
      for (; oi < Math.min(8, order.length); oi++) load(order[oi], oi === 0 ? () => { size(); draw(0); } : null);
      (function rest(){ if (oi >= order.length) return; load(order[oi++], rest); if (oi % 4 === 0) setTimeout(rest, 0); })();

      // the scroll sets a target frame; a small lerp loop eases towards it so scrubbing feels fluid
      const st = { f: 0 };
      animate(st, { f: [0, total - 1], ease: 'linear',
        autoplay: onScroll({ target: scene, enter: 'top top', leave: 'bottom bottom', sync: true }),
        onUpdate: () => { target = st.f; if (!raf) raf = requestAnimationFrame(tick); } });
      function tick(){
        raf = 0;
        shown += (target - shown) * 0.09;
        if (Math.abs(target - shown) < 0.004) shown = target;
        draw(shown);
        if (shown !== target) raf = requestAnimationFrame(tick);
      }
    }

    if (sceneIndex === 0) start();
    else {
      const o = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting){ o.disconnect(); start(); } }), { rootMargin: '150% 0px' });
      o.observe(scene);
    }
  });
})();

let wheelBusy = false;

(function wheeling(){
  if (reduce) return;
  if (matchMedia('(pointer: coarse)').matches) return;      // phones already glide
  let target = 0, raf = 0;

  function limit(){ return Math.max(0, document.documentElement.scrollHeight - innerHeight); }
  function stop(){ wheelBusy = false; if (raf) cancelAnimationFrame(raf); raf = 0; }

  function step(){
    raf = 0;
    const d = target - scrollY;
    if (Math.abs(d) < 0.6){ scrollTo(0, Math.round(target)); wheelBusy = false; return; }
    const before = scrollY;
    scrollTo(0, Math.round(before + d * 0.18));
    if (scrollY === before){ wheelBusy = false; return; }    // hit the end of the page
    raf = requestAnimationFrame(step);
  }

  addEventListener('wheel', function(e){
    if (e.ctrlKey || e.defaultPrevented) return;             // leave pinch zoom alone
    for (let n = e.target; n && n !== document.body; n = n.parentElement){
      if (n.nodeType !== 1) continue;                        // getComputedStyle only takes elements
      const o = getComputedStyle(n).overflowY;               // let inner scrollers have it
      if ((o === 'auto' || o === 'scroll') && n.scrollHeight > n.clientHeight + 2) return;
    }
    e.preventDefault();
    if (!wheelBusy){ target = scrollY; wheelBusy = true; }
    target = Math.max(0, Math.min(limit(), target + e.deltaY * (e.deltaMode === 1 ? 16 : 1)));
    if (!raf) raf = requestAnimationFrame(step);
  }, { passive: false });

  ['keydown', 'pointerdown', 'touchstart'].forEach(function(n){ addEventListener(n, stop, { passive: true }); });
})();

/* ---------- settling ----------
   A scene is a shot that runs over three screens of scrolling, so letting the page stop wherever
   the flick happens to end leaves the film halfway between two compositions and reads as rushed.
   When a scroll ends inside a scene, ease onto the nearest beat of that shot instead. Beats are
   the caption changes and their midpoints, so about two thirds of a screen apart. Blocks of
   ordinary content are left alone: the index table has to scroll freely. */
(function settle(){
  if (reduce) return;
  const scenes = qa('.scene');
  if (!scenes.length) return;
  let busy = 0, timer = 0, raf = 0;

  // the reader always wins: any real input abandons the glide on the spot
  function release(){ if (raf) cancelAnimationFrame(raf); raf = 0; busy = 0; }
  ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(function(e){
    addEventListener(e, release, { passive: true });
  });

  function glide(to){
    const from = scrollY, d = to - from;
    if (Math.abs(d) < 4) return;
    const dur = Math.min(1100, Math.max(460, Math.abs(d) * 1.9));
    const t0 = performance.now();
    busy = 1;
    raf = requestAnimationFrame(function step(now){
      if (!busy) return;
      const p = Math.min(1, (now - t0) / dur);
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;   // easeInOutCubic
      scrollTo(0, Math.round(from + d * e));
      if (p < 1) raf = requestAnimationFrame(step); else release();
    });
  }

  function beats(scene){
    const span = scene.offsetHeight - innerHeight;
    if (span < 120) return null;                       // scene is not taller than the screen: nothing to settle on
    const n = Math.max(4, (qa('.scene__step', scene).length || 2) * 4);
    return { top: scene.offsetTop, span: span, n: n, gap: span / n };
  }
  function run(){
    if (busy || wheelBusy) return;
    const y = scrollY;
    for (let i = 0; i < scenes.length; i++){
      const b = beats(scenes[i]);
      if (!b || y < b.top - 2 || y > b.top + b.span + 2) continue;
      const k = Math.round((y - b.top) / b.gap);
      const to = Math.round(b.top + Math.min(b.n, Math.max(0, k)) * b.gap);
      if (Math.abs(to - y) < 10) return;
      glide(to);
      return;
    }
  }
  if ('onscrollend' in window) addEventListener('scrollend', run, { passive: true });
  else addEventListener('scroll', function(){ clearTimeout(timer); timer = setTimeout(run, 180); }, { passive: true });
})();
`;

module.exports = { sceneMarkup, SCENES, REEL_CSS, REEL_SCRIPT };
