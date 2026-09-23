/* Shared design system for PerfumeHouses.com — palette, type scale, layout, motion.
   Motion is anime.js v4, loaded as an ES module from a CDN. Every animated element is visible
   without JavaScript: the script sets the "before" state itself, so a failed CDN or a blocked
   module leaves a plain, readable page. */

const CSS = `:root{
  color-scheme:light;
  --bg:#F7F4ED; --bg-2:#FFFFFF; --bg-3:#EFEAE0;
  --ink:#14130F; --ink-2:#5B564D; --ink-3:#847D72;
  --line:rgba(20,19,15,.12); --line-2:rgba(20,19,15,.06);
  --accent:#A3521A; --accent-2:#2F6F63; --on-accent:#FFF8EF;
  --glass:rgba(255,255,255,.62); --glass-2:rgba(255,255,255,.80);
  --glass-line:rgba(20,19,15,.09); --glass-edge:rgba(255,255,255,.8);
  --shadow:0 1px 1px rgba(20,19,15,.04),0 18px 48px -18px rgba(20,19,15,.28);
  --amb-1:rgba(226,178,120,.42); --amb-2:rgba(150,180,170,.30); --amb-3:rgba(190,160,200,.24);
  --wrap:1560px; --gutter:clamp(18px,4vw,56px);
  --r-sm:10px; --r-md:18px; --r-lg:28px; --r-xl:40px; --r-pill:999px;
  --ease:cubic-bezier(.22,.8,.2,1);
}
:root[data-theme="dark"]{
  color-scheme:dark;
  --bg:#0A0A0B; --bg-2:#121214; --bg-3:#1A1A1D;
  --ink:#F4F1EA; --ink-2:#ABA69C; --ink-3:#7E7A72;
  --line:rgba(244,241,234,.12); --line-2:rgba(244,241,234,.06);
  --accent:#E3A65C; --accent-2:#7FB8AA; --on-accent:#17120A;
  --glass:rgba(22,22,25,.55); --glass-2:rgba(22,22,25,.74);
  --glass-line:rgba(255,255,255,.09); --glass-edge:rgba(255,255,255,.14);
  --shadow:0 1px 1px rgba(0,0,0,.4),0 22px 60px -22px rgba(0,0,0,.8);
  --amb-1:rgba(180,110,40,.26); --amb-2:rgba(40,110,100,.22); --amb-3:rgba(90,60,140,.20);
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-padding-top:calc(var(--nav-h,84px) + 24px)}
body{margin:0;background:var(--bg);color:var(--ink);
  font-family:"Instrument Sans",system-ui,-apple-system,"Segoe UI",sans-serif;
  font-size:17px;line-height:1.6;overflow-x:hidden;
  transition:background-color .35s var(--ease),color .35s var(--ease)}
body::before{content:"";position:fixed;inset:-25vmax;z-index:-2;pointer-events:none;
  background:radial-gradient(45vmax 34vmax at 8% 4%,var(--amb-1),transparent 70%),
             radial-gradient(42vmax 32vmax at 94% 18%,var(--amb-2),transparent 70%),
             radial-gradient(46vmax 36vmax at 52% 102%,var(--amb-3),transparent 70%)}
img{max-width:100%;display:block}
a{color:var(--accent);text-decoration:none}
a:not(.plain):hover{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:4px}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:8px}
.wrap{max-width:var(--wrap);margin-inline:auto;padding-inline:var(--gutter)}
.wrap--narrow{max-width:1180px}
.mono{font-family:"IBM Plex Mono",ui-monospace,Menlo,Consolas,monospace;font-size:12px;letter-spacing:.06em;line-height:1.5}
.kicker{font-family:"IBM Plex Mono",monospace;font-size:11.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);margin:0 0 14px}
h1,h2,h3,h4{font-family:"Newsreader",Georgia,serif;font-weight:500;line-height:1.05;margin:0;letter-spacing:-.02em;text-wrap:balance}
h1{font-size:clamp(2.7rem,6.4vw,6rem)}
h2{font-size:clamp(2rem,4.4vw,3.6rem)}
h3{font-size:clamp(1.3rem,2vw,1.7rem)}
p{margin:0 0 1.1em}
.lede{font-size:clamp(1.1rem,1.5vw,1.45rem);line-height:1.5;color:var(--ink-2);max-width:44ch;margin:0}
.muted{color:var(--ink-2)}
.skip{position:absolute;left:-9999px}
.skip:focus{left:14px;top:14px;background:var(--ink);color:var(--bg);padding:10px 16px;border-radius:10px;z-index:200}
hr.rule{border:0;border-top:1px solid var(--line);margin:0}

/* glass */
.glass{position:relative;background:var(--glass);border:1px solid var(--glass-line);
  box-shadow:var(--shadow),inset 0 1px 0 var(--glass-edge);
  -webkit-backdrop-filter:blur(26px) saturate(180%);backdrop-filter:blur(26px) saturate(180%)}
.glass::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;
  background:linear-gradient(155deg,rgba(255,255,255,.20),rgba(255,255,255,0) 40%)}
:root[data-theme="dark"] .glass::after{background:linear-gradient(155deg,rgba(255,255,255,.08),rgba(255,255,255,0) 40%)}
.glass--solid{background:var(--glass-2)}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){.glass{background:var(--glass-2)}}
@media (prefers-reduced-transparency:reduce){.glass{background:var(--bg-2);-webkit-backdrop-filter:none;backdrop-filter:none}}

/* nav */

/* A quiet, permanent line at the top of every page. The highest-intent visitor this domain
   will ever get is someone who typed it in, and until now nothing told them it was available.
   Deliberately not a parking banner: the site itself is the argument for the price. */
.sale-bar{display:flex;align-items:center;gap:12px;max-width:1180px;margin:0 auto 8px;
  padding:7px 8px 7px 18px;border-radius:999px;font-size:.84rem;line-height:1.3;
  background:color-mix(in srgb,var(--accent) 16%,var(--bg));
  box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--accent) 34%,transparent);color:var(--ink)}
.sale-bar__msg{flex:1;min-width:0;color:inherit;text-decoration:none}
.sale-bar__msg b{font-weight:600}
.sale-bar__go{flex:none;padding:5px 14px;border-radius:999px;font-weight:600;white-space:nowrap;
  background:var(--accent);color:var(--on-accent,#1a1509);text-decoration:none}
.sale-bar__go:hover{filter:brightness(1.07);text-decoration:none}
.sale-bar__x{flex:none;width:28px;height:28px;border:0;border-radius:50%;cursor:pointer;
  background:transparent;color:inherit;opacity:.5;font-size:19px;line-height:1}
.sale-bar__x:hover{opacity:1;background:color-mix(in srgb,var(--ink) 10%,transparent)}
[data-sale="off"] .sale-bar{display:none}
@media (max-width:560px){.sale-bar__more{display:none}}
@media (max-width:680px){
  .sale-bar{gap:8px;padding:6px 6px 6px 14px;font-size:.78rem;border-radius:18px}
  .sale-bar__go{display:none}
}
.nav-shell{position:sticky;top:14px;z-index:60;padding-inline:clamp(10px,3vw,28px);margin-top:14px}
.navbar{max-width:var(--wrap);margin-inline:auto;border-radius:var(--r-pill);display:flex;align-items:center;gap:10px;padding:7px 7px 7px 24px}

/* the long "Buy this domain" label does not fit a phone nav, and the bar above already
   carries the message, so it is a desktop affordance only */
@media (max-width:760px){ .nav .nav--wide{display:none} }
.logo{display:inline-flex;align-items:center;gap:10px;min-width:0;font-family:"Newsreader",Georgia,serif;font-weight:600;font-size:1.45rem;color:var(--ink);margin-right:auto;white-space:nowrap;letter-spacing:-.02em}
.logo .mark{width:28px;height:28px;flex:none;border-radius:7px;display:block;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
.logo:hover .mark{transform:translateY(-1px) rotate(-3deg)}
@media (max-width:520px){.logo{font-size:1.25rem;gap:8px}.logo .mark{width:24px;height:24px;border-radius:6px}}
.logo:hover{text-decoration:none}
.logo b{font-weight:600;color:var(--accent)}
.nav{display:flex;gap:2px;position:relative}
.nav a{display:inline-flex;align-items:center;min-height:46px;padding:0 18px;border-radius:var(--r-pill);
  color:var(--ink-2);font-size:1rem;font-weight:500;transition:color .2s}
.nav a:hover{color:var(--ink);text-decoration:none}
.nav a[aria-current]{color:var(--ink)}
.nav__pill{position:absolute;inset:0 auto 0 0;border-radius:var(--r-pill);background:var(--glass-2);
  box-shadow:inset 0 0 0 1px var(--glass-line);z-index:-1;opacity:0;transition:opacity .3s}
.theme-btn{display:grid;place-items:center;width:46px;height:46px;border-radius:50%;border:0;background:transparent;color:var(--ink);cursor:pointer;transition:background-color .2s}
.theme-btn:hover{background:var(--line-2)}
.theme-btn svg{width:21px;height:21px}
.theme-btn .i-sun{display:none}
:root[data-theme="dark"] .theme-btn .i-sun{display:block}
:root[data-theme="dark"] .theme-btn .i-moon{display:none}
@media (max-width:820px){
  .navbar{flex-wrap:wrap;border-radius:var(--r-lg);padding:8px 8px 8px 18px}
  .nav{order:3;width:100%;justify-content:space-between;margin-top:2px}
  .nav a{padding:0 12px;font-size:.95rem}
  .nav__pill{display:none}
}

main{padding-block:26px 90px}
main.home{padding-block:0}
.is-home .nav-shell{position:fixed;top:14px;left:0;right:0;margin-top:0}
main.home + .foot{margin-top:0;background:var(--bg);padding-top:10px}
section{margin-top:clamp(70px,10vw,160px)}
.sec-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap;margin-bottom:clamp(26px,3vw,44px)}
.sec-head .lede{max-width:52ch}

/* buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:52px;padding:0 26px;
  border-radius:var(--r-pill);border:0;background:var(--ink);color:var(--bg);font:inherit;font-weight:600;
  cursor:pointer;transition:transform .18s var(--ease),opacity .18s}
.btn:hover{opacity:.9;text-decoration:none}
.btn:active{transform:scale(.97)}
.btn--ghost{background:transparent;color:var(--ink);box-shadow:inset 0 0 0 1px var(--line)}
.btn--ghost:hover{background:var(--line-2)}
.btn--accent{background:var(--accent);color:var(--on-accent)}
.cta-row{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}

/* film stage */
.film{position:relative;height:calc(3 * 92dvh)}
.film__pin{position:sticky;top:calc(var(--nav-h,84px) + 12px);height:calc(100dvh - var(--nav-h,84px) - 26px);
  border-radius:var(--r-xl);overflow:hidden;background:#0d0c0b;display:flex;align-items:flex-end;isolation:isolate}
.film__media{position:absolute;inset:0;z-index:-1}
.film__media img,.film__media video{width:100%;height:100%;object-fit:cover}
.film__pin::before{content:"";position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(180deg,rgba(10,9,8,.5) 0%,rgba(10,9,8,.08) 38%,rgba(10,9,8,.8) 100%)}
.film__panel{position:relative;margin:clamp(14px,2.2vw,34px);padding:clamp(22px,3vw,44px);border-radius:var(--r-lg);max-width:min(760px,92%)}
.film__step{display:none}
.film__step[data-active]{display:block}
.film__dots{position:absolute;right:22px;top:50%;transform:translateY(-50%);display:grid;gap:10px;z-index:2}
.film__dots i{display:block;width:8px;height:8px;border-radius:50%;background:rgba(246,241,232,.32);transition:background .3s,transform .3s}
.film__dots i[data-on]{background:#F6F1E8;transform:scale(1.4)}
.film__cap{position:absolute;left:22px;top:22px;z-index:2;border-radius:var(--r-pill);padding:7px 14px;color:var(--ink-2)}
.film__bar{position:absolute;left:0;bottom:0;height:3px;width:0;background:var(--accent);z-index:3}
@media (max-width:820px){
  .film__cap{display:none}
  .film__panel{margin:12px;padding:20px}
  .film__dots{right:12px}
}

/* marquee */
.marquee{overflow:hidden;border-block:1px solid var(--line);padding-block:20px;margin-top:clamp(40px,6vw,80px)}
.marquee__row{display:flex;gap:44px;width:max-content;will-change:transform}
.marquee span{font-family:"Newsreader",Georgia,serif;font-size:clamp(1.3rem,2.4vw,2rem);color:var(--ink-3);white-space:nowrap}
.marquee span::after{content:"·";margin-left:44px;color:var(--accent)}

/* stats */
.stats{display:grid;gap:1px;background:var(--line);border:1px solid var(--line);border-radius:var(--r-lg);overflow:hidden}
@media (min-width:700px){.stats{grid-template-columns:repeat(4,1fr)}}
.stat{background:var(--bg);padding:clamp(22px,3vw,38px)}
.stat b{display:block;font-family:"Newsreader",Georgia,serif;font-weight:500;font-size:clamp(2.6rem,5vw,4.4rem);line-height:1;letter-spacing:-.03em}
.stat span{display:block;margin-top:10px;font-family:"IBM Plex Mono",monospace;font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-3)}

/* split feature with pinned media */
.feature{display:grid;gap:clamp(28px,4vw,72px);align-items:start}
@media (min-width:980px){.feature{grid-template-columns:1.05fr .95fr}}
.feature__media{border-radius:var(--r-lg);overflow:hidden;aspect-ratio:4/5;background:#0d0c0b;position:relative}
@media (min-width:980px){.feature__media{position:sticky;top:calc(var(--nav-h,84px) + 24px)}}
.feature__media video,.feature__media img{width:100%;height:100%;object-fit:cover}
.feature__media figcaption{position:absolute;left:14px;bottom:14px;border-radius:var(--r-pill);padding:6px 12px;color:var(--ink-2)}
.feature p{max-width:46ch;font-size:1.06rem;color:var(--ink-2)}
.feature h3{margin-top:34px}

.duo{display:grid;gap:clamp(20px,4vw,72px);align-items:start}
@media (min-width:900px){.duo{grid-template-columns:.9fr 1.1fr}}

/* cards */
.grid{display:grid;gap:clamp(14px,1.6vw,22px);grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}
.tile{position:relative;display:block;aspect-ratio:4/5;border-radius:var(--r-lg);overflow:hidden;background:#0d0c0b;isolation:isolate}
.tile img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-1;transition:transform .8s var(--ease)}
.tile:hover{text-decoration:none}
.tile:hover img{transform:scale(1.05)}
.tile::before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,9,8,.1) 30%,rgba(10,9,8,.85) 100%)}
.tile__b{position:absolute;left:0;right:0;bottom:0;padding:22px 24px;color:#F6F1E8}
.tile__b b{display:block;font-family:"Newsreader",Georgia,serif;font-weight:500;font-size:clamp(1.4rem,1.8vw,1.8rem)}
.tile__b span{display:block;margin-top:6px;font-family:"IBM Plex Mono",monospace;font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:rgba(246,241,232,.72)}
.tile__b p{margin:10px 0 0;font-size:.95rem;color:rgba(246,241,232,.82);max-width:36ch}

/* index table */
.panel{border-radius:var(--r-lg);padding:clamp(10px,1.4vw,18px)}
.tools{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;padding:8px 10px 14px}
.search{display:flex;align-items:center;gap:12px;border-radius:var(--r-pill);padding:4px 6px 4px 18px;background:var(--glass-2);box-shadow:inset 0 0 0 1px var(--glass-line);flex:1;max-width:480px}
.search svg{width:19px;height:19px;color:var(--ink-3);flex:none}
.search input{flex:1;min-width:0;min-height:48px;border:0;background:transparent;color:var(--ink);font:inherit;font-size:1.02rem}
.search input:focus{outline:none}
.search:focus-within{box-shadow:inset 0 0 0 2px var(--accent)}
.count{color:var(--ink-3)}
.table-scroll{overflow:auto;border-radius:var(--r-md);background:var(--bg-2);box-shadow:inset 0 0 0 1px var(--line)}
table.idx{width:100%;border-collapse:collapse;font-size:1rem}
.idx th{position:sticky;top:0;text-align:left;font-weight:600;font-size:.8rem;letter-spacing:.06em;text-transform:uppercase;
  color:var(--ink-2);background:var(--bg-3);padding:0 18px;height:52px;white-space:nowrap;border-bottom:1px solid var(--line);z-index:1}
.idx th button{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:52px}
.idx th button:focus-visible{outline:2px solid var(--accent);outline-offset:-4px}
.idx th button::after{content:"";width:8px;height:8px;opacity:.35;background:currentColor;clip-path:polygon(50% 0,100% 40%,0 40%,0 60%,100% 60%,50% 100%)}
.idx th[aria-sort="ascending"] button::after{opacity:1;clip-path:polygon(50% 10%,100% 70%,0 70%)}
.idx th[aria-sort="descending"] button::after{opacity:1;clip-path:polygon(0 30%,100% 30%,50% 90%)}
.idx td{padding:15px 18px;border-bottom:1px solid var(--line-2);vertical-align:top}
.idx tbody tr{transition:background-color .18s}
.idx tbody tr:hover{background:var(--line-2)}
.idx td.name a{color:var(--ink);font-weight:600;font-size:1.06rem}
.idx td.name a:hover{color:var(--accent)}
.idx td.num{font-variant-numeric:tabular-nums;color:var(--ink-2)}
.idx td.known{color:var(--ink-2)}
.tag{display:inline-block;padding:5px 12px;border-radius:var(--r-pill);background:var(--line-2);color:var(--ink);font-size:.85rem;white-space:nowrap}
.tag:hover{background:var(--line);text-decoration:none}
.empty{padding:34px;text-align:center;color:var(--ink-2)}
@media (max-width:820px){
  .idx thead{display:none}
  .idx,.idx tbody,.idx tr,.idx td{display:block;width:100%}
  .idx tr{padding:14px 16px;border-bottom:1px solid var(--line)}
  .idx td{border:0;padding:2px 0}
  .idx td.num,.idx td.country{display:inline;color:var(--ink-3);font-size:.9rem}
  .idx td.num::after{content:" · "}
  .idx td.cat{margin:8px 0 2px}
}

/* timeline */
.tl{position:relative;display:grid;gap:clamp(40px,6vw,90px)}
.tl__era{display:grid;gap:22px}
@media (min-width:900px){.tl__era{grid-template-columns:260px 1fr;gap:48px}}
.tl__era h3{position:sticky;top:calc(var(--nav-h,84px) + 24px);font-size:clamp(1.8rem,3vw,2.6rem);color:var(--accent)}
.tl__list{display:grid;gap:0;border-top:1px solid var(--line)}
.tl__row{display:grid;grid-template-columns:96px 1fr;gap:20px;padding:20px 0;border-bottom:1px solid var(--line-2);align-items:baseline}
.tl__row b{font-family:"IBM Plex Mono",monospace;font-size:1rem;color:var(--ink-3);font-weight:400}
.tl__row a{color:var(--ink);font-family:"Newsreader",Georgia,serif;font-size:clamp(1.2rem,1.7vw,1.6rem)}
.tl__row a:hover{color:var(--accent)}
.tl__row span{display:block;color:var(--ink-3);font-size:.92rem;margin-top:4px}

/* entry pages */
.entry{display:grid;gap:clamp(28px,4vw,64px);margin-top:36px;align-items:start}
@media (min-width:1000px){.entry{grid-template-columns:minmax(0,1fr) 380px}}
.prose{font-family:"Newsreader",Georgia,serif;font-size:clamp(1.15rem,1.35vw,1.35rem);line-height:1.62}
.prose p{max-width:36em}
.prose h2{margin-top:52px;font-size:clamp(1.6rem,2.4vw,2.2rem)}
.prose ul{margin:0 0 1em;padding-left:1.2em}
.infobox{border-radius:var(--r-lg);padding:10px;font-size:.98rem}
@media (min-width:1000px){.infobox{position:sticky;top:calc(var(--nav-h,84px) + 24px)}}
.infobox dl{margin:0;padding:6px 14px}
.infobox dl>div{display:grid;grid-template-columns:110px 1fr;gap:12px;padding:13px 0;border-top:1px solid var(--line-2)}
.infobox dl>div:first-child{border-top:0}
.infobox dt{color:var(--ink-3);margin:0;font-size:.9rem}
.infobox dd{margin:0;font-weight:500}
.infobox .cap{padding:12px 14px 6px;border-top:1px solid var(--line-2);margin:0;color:var(--ink-3)}
.chips{display:flex;flex-wrap:wrap;gap:10px;list-style:none;padding:0;margin:0}
.chips li{padding:10px 18px;border-radius:var(--r-pill);font-family:"Instrument Sans",sans-serif;font-size:1rem}
.see{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));list-style:none;padding:0;margin:0}
.see a{display:flex;align-items:center;gap:14px;padding:10px;border-radius:var(--r-md);color:var(--ink);font-family:"Instrument Sans",sans-serif;font-size:1rem;transition:background-color .2s}
.see a:hover{background:var(--line-2);text-decoration:none}
.see img{width:58px;height:58px;border-radius:14px;object-fit:cover;flex:none}
.see small{display:block;color:var(--ink-3);font-size:.82rem}
.revised{margin-top:48px;padding-top:16px;border-top:1px solid var(--line);color:var(--ink-3);font-family:"IBM Plex Mono",monospace;font-size:12px}
.pn{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:26px;font-family:"Instrument Sans",sans-serif}
.pn a{display:block;border-radius:var(--r-md);padding:18px 20px;color:var(--ink);min-height:48px}
.pn a small{display:block;color:var(--ink-3);font-size:.82rem;margin-bottom:2px}
.pn a:last-child{text-align:right}
.pn a:hover{text-decoration:none;box-shadow:var(--shadow),inset 0 0 0 1px var(--accent)}
.notice{border-radius:var(--r-lg);padding:28px 30px;margin-top:34px;max-width:46em;font-family:"Instrument Sans",sans-serif;font-size:1.02rem}
.notice h2{font-size:clamp(1.4rem,2vw,1.8rem);margin-bottom:12px}
.credits{list-style:none;padding:0;margin:0;columns:2 280px;column-gap:32px;font-family:"Instrument Sans",sans-serif;font-size:.92rem;color:var(--ink-2)}
.credits li{break-inside:avoid;padding:4px 0}

/* stage banner for inner pages */
/* A domain name is one unbreakable word. At the normal hero size "PerfumeHouses.com" is wider
   than the panel it sits in, so the sale page gets a heading sized to fit it. */
.stage--tight .stage__panel{max-width:min(880px,94%)}
.stage--tight h1{font-size:clamp(1.9rem,5vw,4.2rem);line-height:1.04;text-wrap:balance}
.stage{position:relative;border-radius:var(--r-xl);overflow:hidden;min-height:clamp(320px,46vh,520px);display:flex;align-items:flex-end;background:#0d0c0b;isolation:isolate}
.stage>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-1}
.stage::before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,9,8,.35) 0%,rgba(10,9,8,.1) 40%,rgba(10,9,8,.82) 100%)}
.stage__panel{position:relative;margin:clamp(14px,2vw,30px);padding:clamp(20px,2.6vw,38px);border-radius:var(--r-lg);max-width:min(760px,94%)}
.stage__cap{position:absolute;right:18px;top:18px;border-radius:var(--r-pill);padding:6px 13px;color:var(--ink-2)}
.crumbs{margin:0 0 14px;color:var(--ink-3)}
.crumbs a{color:var(--ink-2)}

/* footer */
.foot{margin-top:40px;padding:0 clamp(10px,3vw,28px) 30px}
.foot__in{max-width:var(--wrap);margin-inline:auto;border-radius:var(--r-xl);padding:clamp(26px,3vw,44px);display:grid;gap:26px;color:var(--ink-2)}
.foot__top{display:grid;gap:26px}
@media (min-width:860px){.foot__top{grid-template-columns:1.4fr 1fr 1fr}}
.foot h4{margin:0 0 14px;font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink)}
.foot ul{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.foot a{color:var(--ink-2)}
.foot a:hover{color:var(--ink)}
.foot .dis{margin:0;padding-top:22px;border-top:1px solid var(--line);font-size:.86rem;color:var(--ink-3);max-width:80em}

@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{transition:none!important;animation:none!important}
  .film{height:auto}
  .film__pin{position:relative;height:auto;min-height:70vh}
  .film__step{display:block!important}
  .film__dots,.film__bar{display:none}
}
`;

const { REEL_CSS } = require("./reel.js");
module.exports = { CSS: CSS + REEL_CSS };
