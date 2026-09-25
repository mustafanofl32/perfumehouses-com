const fs = require("fs");
const path = require("path");
const houses = require("./data.js");
const credits = require("./assets/img/credits.json");
const houseCredits = require("./assets/img/house-credits.json");
const { CSS } = require("./theme.js");
const { MOTION } = require("./motion.js");
const { sceneMarkup } = require("./reel.js");

const ORIGIN = "https://perfumehouses.com";
const OUT = __dirname;
const CSS_V = require("crypto").createHash("sha1").update(CSS).digest("hex").slice(0, 8);
const today = "2026-09-18";
const todayLong = "18 September 2026";

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slugify = s => s.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");

/* ---------------------------------------------------------------- photos */
const CAPTION = {
  "historic-french": "Street in Paris", "historic-british": "Street in London", "heritage": "Apothecary jars",
  "niche-french": "Lavender field", "middle-east": "Incense smoke", "italian": "Lemons on the tree",
  "american": "Brownstone houses", "fashion-house": "Ivory silk", "british": "Garden roses",
  "emerging": "Glass bottle", "scandinavian": "Conifer forest", "about": "Laboratory flask", "acquire": "Dried flower",
  "houbigant": "Hill village in Provence", "caron": "Tobacco leaves", "lancome": "Garden rose",
  "jean-patou": "Jasmine", "dior": "White roses", "xerjoff": "Sea", "diptyque": "Cedar forest",
  "lartisan-parfumeur": "Sand dunes", "serge-lutens": "Resin on bark", "frederic-malle": "Rose petals",
  "etat-libre-dorange": "Jasmine flower", "memo-paris": "Leather", "parfums-de-marly": "Glass bottle on wood",
  "maison-francis-kurkdjian": "Saffron threads", "atelier-cologne": "Oranges on the tree", "initio": "Peppercorns",
  "swiss-arabian": "Aromatic wood in a dish", "ajmal": "Sand dunes at dusk", "rasasi": "Rose",
  "lattafa": "Vanilla pods", "jo-malone-london": "Mint", "le-labo": "Sandalwood", "zoologist": "Forest in fog"
};
const catKey = c => slugify(c);
const catCredit = c => Object.values(credits).find(v => v.file === catKey(c));
const photo = {
  forCat: c => ({ src: `/assets/img/${catKey(c)}.jpg`, sm: `/assets/img/${catKey(c)}-sm.jpg`, cap: CAPTION[catKey(c)], by: catCredit(c) }),
  forHouse: h => houseCredits[h.slug]
    ? { src: `/assets/img/h-${h.slug}.jpg`, sm: `/assets/img/h-${h.slug}-sm.jpg`, cap: CAPTION[h.slug], by: houseCredits[h.slug] }
    : photo.forCat(h.cat),
  page: key => { const by = Object.values(credits).find(v => v.file === key); return { src: `/assets/img/${key}.jpg`, sm: `/assets/img/${key}-sm.jpg`, cap: CAPTION[key], by }; }
};
const credit = by => `Photo: <a href="${by.photo}" rel="noopener">${esc(by.user)} / Unsplash</a>`;

/* two generated clips, each with a light webm and a poster */
const CLIP = {
  bench: { mp4: "/assets/video/bench.mp4", webm: "/assets/video/bench-540.webm", poster: "/assets/video/bench-poster.jpg" },
  drop:  { mp4: "/assets/video/drop.mp4",  webm: "/assets/video/drop-540.webm",  poster: "/assets/video/drop-poster.jpg" }
};
const hasDrop = fs.existsSync(path.join(OUT, "assets", "video", "drop-540.webm"));

/* ------------------------------------------------------------- wording */
const NATIONALITY = { "France": "French", "United Kingdom": "British", "Italy": "Italian", "Oman": "Omani", "Sweden": "Swedish",
  "Turkey": "Turkish", "United Arab Emirates": "Emirati", "United Kingdom / France": "Anglo-French", "United States": "American", "Canada": "Canadian" };
const byline = h => {
  const person = !/^(Established|Lattafa|Initio)/.test(h.founder);
  const nat = NATIONALITY[h.country] || h.country;
  return `${nat} perfume house, founded in ${h.founded}${person ? ` by ${h.founder}` : ""}.`;
};
const TRADITIONS = {
  "Historic French": "Paris houses from the eighteenth and nineteenth centuries, and the early twentieth-century firms that followed them.",
  "Historic British": "London perfumers with long retail histories.",
  "Heritage": "Houses whose founding story reaches back several centuries, whether or not the record fully supports it.",
  "Niche French": "Independent French houses, most founded after 1970, selling a small range at a high price.",
  "Middle East": "Gulf and Omani houses working with oud, rose, amber and frankincense.",
  "Italian": "Italian houses, from Parma cologne to Turin luxury.",
  "American": "Houses founded in the United States.",
  "Fashion house": "Couture labels with their own fragrance lines.",
  "British": "Modern British houses founded since the 1990s.",
  "Emerging": "Houses founded after 2010.",
  "Scandinavian": "Houses founded in the Nordic countries."
};

/* ------------------------------------------------------------ templates */
const cats = [...new Set(houses.map(h => h.cat))].sort((a, b) => countIn(b) - countIn(a) || a.localeCompare(b));
function countIn(c) { return houses.filter(h => h.cat === c).length; }
/* a description Google can actually use: how many, when, who, and the blurb when that runs short */
const crumbs = trail => ({ "@type": "BreadcrumbList", itemListElement: trail.map(([name, url], i) =>
  ({ "@type": "ListItem", position: i + 1, name, item: ORIGIN + url })) });

const catDesc = (c, list) => {
  const yrs = list.map(h => h.founded);
  const one = list.length === 1;
  const head = `${list.length} ${c} perfume house${one ? "" : "s"} in the index, founded ${one ? yrs[0] : "between " + Math.min(...yrs) + " and " + Math.max(...yrs)}`;
  let d = `${head}: ${list.map(h => h.name).join(", ")}.`;
  if (d.length < 115 && TRADITIONS[c]) d += " " + TRADITIONS[c];
  return d.length > 158 ? d.slice(0, 155).replace(/[s,;:]+$/, "") + "…" : d;
};

const catUrl = c => `/traditions/${slugify(c)}`;
const houseUrl = h => `/houses/${h.slug}`;
const sortKey = h => h.sortAs || h.name.replace(/^(L'|The |Editions de Parfums )/, "");
const sorted = [...houses].sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
const years = houses.map(h => h.founded);
const countries = new Set(houses.flatMap(h => h.country.split(" / "))).size;

const ICON = {
  sun: `<svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>`,
  moon: `<svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.4 14.6A8.5 8.5 0 0 1 9.4 3.6a8.5 8.5 0 1 0 11 11Z"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:18px;height:18px"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`
};

const THEME_HEAD = `<script>(function(){try{if(localStorage.getItem('ph-sale')==='off')document.documentElement.setAttribute('data-sale','off');var t=localStorage.getItem('ph-theme-v2');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}})()</script>`;
const THEME_BODY = `<script>
(function(){
  var b=document.getElementById('theme'); if(!b) return;
  var root=document.documentElement, meta=document.querySelector('meta[name="theme-color"]');
  function current(){ return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }   // light unless the visitor chose dark
  function label(){ var d=current()==='dark'; b.setAttribute('aria-label', d ? 'Switch to light theme' : 'Switch to dark theme'); b.setAttribute('aria-pressed', d?'true':'false'); }
  b.addEventListener('click', function(){
    var next=current()==='dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try{ localStorage.setItem('ph-theme-v2', next); }catch(e){}
    if(meta) meta.setAttribute('content', next==='dark' ? '#0A0A0B' : '#F7F4ED');
    label();
  });
  label();
})();
</script>`;

const NAV = [
  ["houses", "/", "Houses"],
  ["traditions", "/traditions", "Traditions"],
  ["timeline", "/timeline", "Timeline"],
  ["about", "/about", "About"],
  ["acquire", "/acquire", "Buy this domain"]
];

function shell({title, desc, canonical, body, jsonld, current, ogImage, script, home, noindex}) {
  const og = ORIGIN + (ogImage || "/assets/video/bench-poster.jpg");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">${noindex ? '<meta name="robots" content="noindex, follow">' : ""}
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#F7F4ED">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Perfume Houses">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${og}">
<meta name="twitter:card" content="summary_large_image">
${THEME_HEAD}
<link rel="icon" type="image/png" sizes="32x32" href="/assets/brand/mark-32.png">
<link rel="icon" type="image/png" sizes="64x64" href="/assets/brand/mark-64.png">
<link rel="apple-touch-icon" href="/assets/brand/mark-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=Instrument+Sans:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap">
<link rel="stylesheet" href="/assets/site.css?v=${CSS_V}">
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ""}
</head>
<body${home ? ' class="is-home"' : ""}>
<a class="skip" href="#main">Skip to content</a>
<div class="nav-shell">
  <div class="sale-bar" id="sale-bar">
  <a class="plain sale-bar__msg" href="/acquire"><b>PerfumeHouses.com</b> is for sale &mdash; $1,295<span class="sale-bar__more">, or in monthly instalments</span></a>
  <a class="plain sale-bar__go" href="/acquire">See the details</a>
  <button class="sale-bar__x" type="button" aria-label="Dismiss">&times;</button>
</div>
  <header class="navbar glass">
    <a class="logo plain" href="/"><img class="mark" src="/assets/brand/mark-512.png" alt="" width="28" height="28" decoding="async"><span>Perfume<b>Houses</b></span></a>
    <nav class="nav" aria-label="Primary"><span class="nav__pill" aria-hidden="true"></span>${NAV.map(([k, href, label]) => `<a class="plain${k === "acquire" ? " nav--wide" : ""}" href="${href}"${current === k ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</nav>
    <button class="theme-btn" id="theme" type="button" aria-label="Switch theme">${ICON.moon}${ICON.sun}</button>
  </header>
</div>
<main id="main"${home ? ' class="home"' : ""}>
${body}
</main>
<footer class="foot"><div class="foot__in glass">
  <div class="foot__top">
    <div>
      <a class="logo plain" href="/"><img class="mark" src="/assets/brand/mark-512.png" alt="" width="28" height="28" decoding="async"><span>Perfume<b>Houses</b></span></a>
      <p style="margin:14px 0 0;max-width:40ch">An independent index of the firms that make fragrance: when each started, who started it, where, and what it is known for.</p>
    </div>
    <div><h4>Browse</h4><ul>
      <li><a href="/">All houses</a></li>
      <li><a href="/traditions">Traditions</a></li>
      <li><a href="/timeline">Timeline</a></li>
    </ul></div>
    <div><h4>Site</h4><ul>
      <li><a href="/about">About</a></li>
      <li><a href="/about#photographs">Photographs and clips</a></li>
      <li><a href="/acquire">Buy this domain</a></li>
    </ul></div>
  </div>
  <p class="dis"><strong style="color:var(--ink)">Independent and unaffiliated.</strong> Not affiliated with, endorsed by or selling for any house listed. House and fragrance names are trade marks of their owners, used here to identify them. Photographs show places and raw materials; the moving clips are AI-generated and show no real product. ${houses.length} entries, revised ${todayLong}.</p>
</div></footer>
${THEME_BODY}
<script>(function(){var b=document.getElementById('sale-bar');if(!b)return;
b.querySelector('.sale-bar__x').addEventListener('click',function(){
try{localStorage.setItem('ph-sale','off')}catch(e){}document.documentElement.setAttribute('data-sale','off')})})()</script>
${MOTION}
${script || ""}
</body>
</html>
`;
}

/* ------------------------------------------------------------- pieces */
const stage = (p, inner, o = {}) => `<div class="stage${o.tight ? " stage--tight" : ""}" data-hero>
  <img src="${p.src}" alt="${esc(p.cap)}" fetchpriority="high">
  <p class="stage__cap glass mono">${esc(p.cap)} &middot; <a href="${p.by.photo}" rel="noopener">${esc(p.by.user)}</a></p>
  <div class="stage__panel glass glass--solid">${inner}</div>
</div>`;

const tile = (href, title, kicker, text, p) => `<a class="tile plain" href="${href}">
  <img src="${p.sm}" alt="${esc(p.cap)}" loading="lazy">
  <div class="tile__b"><span>${esc(kicker)}</span><b>${esc(title)}</b>${text ? `<p>${esc(text)}</p>` : ""}</div>
</a>`;

const searchBox = (id, label, placeholder) => `<label class="search" for="${id}">
  ${ICON.search}<span class="skip">${label}</span>
  <input id="${id}" type="search" data-filter placeholder="${placeholder}" autocomplete="off">
</label>`;

const tableRow = (h, withCat = true) => `<tr>
  <td class="name" data-v="${esc(sortKey(h))}"><a href="${houseUrl(h)}">${esc(h.name)}</a></td>
  <td class="num" data-v="${h.founded}">${h.founded}</td>
  <td class="country" data-v="${esc(h.country)}">${esc(h.country)}</td>
  ${withCat ? `<td class="cat" data-v="${esc(h.cat)}"><a class="tag plain" href="${catUrl(h.cat)}">${esc(h.cat)}</a></td>` : ""}
  <td class="known">${esc(h.sig.slice(0, 2).join(", "))}</td>
</tr>`;

const indexTable = (list, withCat = true) => `<div class="panel glass">
  ${withCat ? `<div class="tools">
    ${searchBox("q", "Filter the index", "Filter by house, country, year or fragrance")}
    <span class="count mono" id="n" aria-live="polite">${list.length} houses</span>
  </div>` : ""}
  <div class="table-scroll">
    <table class="idx">
      <thead><tr>
        <th aria-sort="ascending" scope="col"><button type="button">House</button></th>
        <th aria-sort="none" scope="col"><button type="button">Founded</button></th>
        <th aria-sort="none" scope="col"><button type="button">Country</button></th>
        ${withCat ? `<th aria-sort="none" scope="col"><button type="button">Tradition</button></th>` : ""}
        <th scope="col">Known for</th>
      </tr></thead>
      <tbody>
${list.map(h => tableRow(h, withCat)).join("\n")}
      </tbody>
    </table>
    ${withCat ? `<p class="empty" id="empty" hidden>No house matches that search. Try a country or a founding year.</p>` : ""}
  </div>
</div>`;

const tableScript = `<script>
(function(){
  var t=document.querySelector('table.idx'); if(!t||!t.tHead) return;
  var body=t.tBodies[0], rows=[].slice.call(body.rows), n=document.getElementById('n'), empty=document.getElementById('empty');
  var inputs=[].slice.call(document.querySelectorAll('[data-filter]'));
  function apply(s){
    s=(s||'').trim().toLowerCase(); var shown=0;
    rows.forEach(function(r){var hit=!s||r.textContent.toLowerCase().indexOf(s)>-1; r.hidden=!hit; if(hit) shown++;});
    if(n) n.textContent = shown===rows.length ? rows.length+' houses' : shown+' of '+rows.length+' houses';
    if(empty) empty.hidden = shown!==0;
  }
  inputs.forEach(function(inp){ inp.addEventListener('input',function(){ inputs.forEach(function(o){ if(o!==inp) o.value=inp.value; }); apply(inp.value); }); });
  var hero=document.getElementById('hero-search');
  if(hero) hero.addEventListener('submit',function(e){ e.preventDefault(); var i=document.getElementById('index'); if(i) i.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}); });
  [].forEach.call(t.tHead.rows[0].cells,function(th,i){
    var b=th.querySelector('button'); if(!b) return;
    b.addEventListener('click',function(){
      var dir=th.getAttribute('aria-sort')==='ascending'?'descending':'ascending';
      [].forEach.call(t.tHead.rows[0].cells,function(o){ if(o.querySelector('button')) o.setAttribute('aria-sort','none'); });
      th.setAttribute('aria-sort',dir);
      rows.sort(function(a,c){
        var x=a.cells[i].getAttribute('data-v'), y=c.cells[i].getAttribute('data-v');
        var r=isNaN(x)?String(x).localeCompare(String(y)):x-y; return dir==='ascending'?r:-r;
      }).forEach(function(r){body.appendChild(r);});
    });
  });
})();
</script>`;

/* ------------------------------------------------------------ home page */
const marqueeNames = sorted.map(h => `<span>${esc(h.name)}</span>`).join("");

const homeBody = `
${sceneMarkup({ key: "bench", index: 1, tall: true, hero: true, steps: [
  `<p class="kicker">An independent index</p>
   <h1>The houses behind the bottles</h1>
   <p class="lede">${houses.length} perfume houses, founded between ${Math.min(...years)} and ${Math.max(...years)}. Who started each one, where, and what it is known for.</p>
   <div class="cta-row">
     <a class="btn btn--accent plain" href="#index">Open the index ${ICON.arrow}</a>
     <a class="btn btn--ghost plain" href="/traditions">Browse traditions</a>
   </div>`,
  `<p class="kicker">Definition</p>
   <h2>A house owns the decision</h2>
   <p class="lede">It briefs or employs the perfumer, chooses the materials and carries the name on the label. The shop that sells the bottle does none of that.</p>`
] })}

<div class="block">
  <div class="marquee" aria-hidden="true" style="margin-top:0"><div class="marquee__row">${marqueeNames}</div></div>
  <div class="wrap">
    <section style="margin-top:clamp(50px,7vw,110px)">
      <div class="stats" data-reveal="children">
        <div class="stat"><b data-count="${houses.length}">${houses.length}</b><span>Houses indexed</span></div>
        <div class="stat"><b data-count="${Math.max(...years) - Math.min(...years)}">${Math.max(...years) - Math.min(...years)}</b><span>Years covered</span></div>
        <div class="stat"><b data-count="${countries}">${countries}</b><span>Countries</span></div>
        <div class="stat"><b data-count="${cats.length}">${cats.length}</b><span>Traditions</span></div>
      </div>
    </section>
    <section>
      <div class="duo" data-reveal="children">
        <div>
          <p class="kicker">What this is</p>
          <h2>A reference, not a shop</h2>
        </div>
        <div>
          <p class="lede" style="max-width:52ch">Most writing about perfume is either a shop selling it or a review of how it smells. Neither usually tells you who made it, when the house started, or where. This index answers those questions in a few lines.</p>
          <p class="muted" style="margin-top:20px;max-width:56ch">It does not sell fragrance, take commission or carry advertising, and no house has reviewed its own entry.</p>
          <div class="cta-row"><a class="btn btn--ghost plain" href="/about">More about the index ${ICON.arrow}</a></div>
        </div>
      </div>
    </section>
  </div>
</div>

${sceneMarkup({ key: "drop", index: 2, steps: [
  `<p class="kicker">Every entry</p>
   <h2>Five facts, no adjectives</h2>
   <p class="lede">Founding year, founder, country, tradition, and the fragrances the house is actually known for.</p>`,
  `<p class="kicker">The record</p>
   <h2>Disputed dates are marked</h2>
   <p class="lede">Some founding stories are marketing as much as history. Where a claim is contested, the entry says so instead of repeating it.</p>`
] })}

<div class="block">
  <div class="wrap">
    <section id="index" style="scroll-margin-top:calc(var(--nav-h,84px) + 24px)">
      <div class="sec-head" data-reveal="children">
        <div><p class="kicker">The index</p><h2>All ${houses.length} houses</h2></div>
        <p class="lede">Sort by any column, or filter by name, country, year or fragrance.</p>
      </div>
      ${indexTable(sorted)}
    </section>
  </div>
</div>

${sceneMarkup({ key: "raw", index: 3, steps: [
  `<p class="kicker">Browse</p>
   <h2>${cats.length} traditions</h2>
   <p class="lede">Regional grammars, from historic Paris to the Gulf houses and the Nordic minimalists.</p>
   <div class="cta-row"><a class="btn btn--accent plain" href="/traditions">See the traditions ${ICON.arrow}</a></div>`,
  `<p class="kicker">Browse</p>
   <h2>Three centuries, in order</h2>
   <p class="lede">Every house by founding year, from ${Math.min(...years)} to ${Math.max(...years)}.</p>
   <div class="cta-row"><a class="btn btn--accent plain" href="/timeline">Open the timeline ${ICON.arrow}</a></div>`
] })}

<div class="block block--last">
  <div class="wrap">
    <section>
      <div class="sec-head" data-reveal="children">
        <div><p class="kicker">Start somewhere</p><h2>Traditions</h2></div>
        <a class="btn btn--ghost plain" href="/traditions">All ${cats.length} ${ICON.arrow}</a>
      </div>
      <div class="grid" data-reveal="children">
        ${cats.slice(0, 4).map(c => tile(catUrl(c), c, `${countIn(c)} ${countIn(c) === 1 ? "house" : "houses"}`, TRADITIONS[c], photo.forCat(c))).join("\n        ")}
      </div>
    </section>
  </div>
</div>
`;

/* ------------------------------------------------------ traditions page */
const traditionsBody = `
<div class="wrap">
  <div data-hero style="padding-block:clamp(30px,6vw,80px)">
    <p class="kicker">Browse</p>
    <h1>Traditions</h1>
    <p class="lede" style="margin-top:22px">Perfumery has regional grammars. These ${cats.length} groupings are for browsing, not a formal classification: a house sits where its work and its address put it.</p>
  </div>
  <div class="grid" data-reveal="children">
    ${cats.map(c => tile(catUrl(c), c, `${countIn(c)} ${countIn(c) === 1 ? "house" : "houses"}`, TRADITIONS[c], photo.forCat(c))).join("\n    ")}
  </div>
  <section>
    <div class="sec-head" data-reveal="children"><div><p class="kicker">Or</p><h2>Take the whole index</h2></div>
      <a class="btn btn--ghost plain" href="/">All ${houses.length} houses ${ICON.arrow}</a></div>
  </section>
</div>
`;

/* -------------------------------------------------------- timeline page */
const centuryOf = y => Math.floor((y - 1) / 100) + 1;
const ordinal = n => n + (n === 21 ? "st" : "th");
const centuries = [...new Set(sorted.map(h => centuryOf(h.founded)))].sort();
const timelineBody = `
<div class="wrap">
  <div data-hero style="padding-block:clamp(30px,6vw,80px)">
    <p class="kicker">Browse</p>
    <h1>Timeline</h1>
    <p class="lede" style="margin-top:22px">All ${houses.length} houses in order of founding, from ${Math.min(...years)} to ${Math.max(...years)}. Dates are the ones the houses claim; where the record is contested, the entry says so.</p>
  </div>
  <div class="tl" style="margin-top:clamp(40px,6vw,80px)">
    ${centuries.map(c => {
      const list = houses.filter(h => centuryOf(h.founded) === c).sort((a, b) => a.founded - b.founded);
      return `<div class="tl__era">
      <h3>${ordinal(c)} century</h3>
      <div class="tl__list" data-reveal="children">
        ${list.map(h => `<div class="tl__row"><b>${h.founded}</b><div><a href="${houseUrl(h)}">${esc(h.name)}</a><span>${esc(h.country)} &middot; ${esc(h.cat)} &middot; ${esc(h.sig.slice(0, 2).join(", "))}</span></div></div>`).join("\n        ")}
      </div>
    </div>`;
    }).join("\n    ")}
  </div>
</div>
`;

/* ----------------------------------------------------------- house page */
function housePage(h, prev, next) {
  const related = sorted.filter(x => x.cat === h.cat && x.slug !== h.slug);
  const canonical = `${ORIGIN}${houseUrl(h)}`;
  const p = photo.forHouse(h);
  const desc = `${h.name}: ${byline(h)} Known for ${h.sig.slice(0, 2).join(" and ")}.`;
  const body = `
<div class="wrap">
${stage(p, `
  <p class="crumbs mono"><a href="/">Houses</a> / <a href="${catUrl(h.cat)}">${esc(h.cat)}</a></p>
  <h1>${esc(h.name)}</h1>
  <p class="lede" style="margin-top:18px">${esc(byline(h))}</p>
`)}

<div class="entry">
  <article class="prose">
    <div data-reveal="children">
      ${h.body.map(t => `<p>${esc(t)}</p>`).join("\n      ")}
    </div>

    <h2>Known for</h2>
    <ul class="chips" data-reveal="children">${h.sig.map(s => `<li class="glass">${esc(s)}</li>`).join("")}</ul>

    ${related.length ? `<h2>See also</h2>
    <ul class="see" data-reveal="children">${related.map(r => `<li><a class="plain" href="${houseUrl(r)}"><img src="${photo.forHouse(r).sm}" alt="" loading="lazy"><span>${esc(r.name)}<small>${esc(r.country)}, ${r.founded}</small></span></a></li>`).join("")}</ul>` : ""}

    <p class="revised">Entry revised ${todayLong}. Something wrong? <a href="/acquire">Send a correction</a>.</p>
    <nav class="pn" aria-label="Previous and next entry">
      ${prev ? `<a class="glass plain" href="${houseUrl(prev)}"><small>Previous</small>${esc(prev.name)}</a>` : "<span></span>"}
      ${next ? `<a class="glass plain" href="${houseUrl(next)}"><small>Next</small>${esc(next.name)}</a>` : "<span></span>"}
    </nav>
  </article>

  <aside class="infobox glass" aria-label="Summary">
    <dl>
      <div><dt>Founded</dt><dd>${h.founded}</dd></div>
      <div><dt>Founder</dt><dd>${esc(h.founder)}</dd></div>
      <div><dt>Country</dt><dd>${esc(h.country)}</dd></div>
      <div><dt>Tradition</dt><dd><a href="${catUrl(h.cat)}">${esc(h.cat)}</a></dd></div>
      <div><dt>Known for</dt><dd>${h.sig.map(esc).join("<br>")}</dd></div>
    </dl>
    <p class="cap mono">Photo above: ${esc(p.cap.toLowerCase())}. ${credit(p.by)}</p>
  </aside>
</div>
</div>
`;
  const jsonld = {
    "@context": "https://schema.org", "@type": "Article",
    headline: h.name, description: desc, image: ORIGIN + p.src, dateModified: today, mainEntityOfPage: canonical,
    about: { "@type": "Organization", name: h.name, foundingDate: String(h.founded), founder: h.founder, address: { "@type": "PostalAddress", addressCountry: h.country } },
    isPartOf: { "@type": "WebSite", name: "Perfume Houses", url: ORIGIN + "/" }
  };
  const graph = { "@context": "https://schema.org", "@graph": [
    crumbs([["Perfume Houses", "/"], ["Traditions", "/traditions"], [h.cat, catUrl(h.cat)], [h.name, houseUrl(h)]]),
    jsonld
  ] };
  /* longest search title that fits in 60 characters; names that already say "Perfumes" or
     "Parfums" do not get "perfume house" added on top */
  const lead = /perfum|parfum/i.test(h.name) ? `${h.name}:` : `${h.name} perfume house:`;
  const title = [`${lead} history and fragrances | Perfume Houses`, `${lead} history and fragrances`,
    `${h.name}: history and fragrances`, `${h.name} (perfume house)`].find(t => t.length <= 60) || h.name;

  return shell({ title, desc, canonical, body, jsonld: graph, current: "houses", ogImage: p.src });
}

/* ------------------------------------------------------- tradition page */
function traditionPage(c) {
  const list = sorted.filter(h => h.cat === c);
  const canonical = `${ORIGIN}${catUrl(c)}`;
  const p = photo.forCat(c);
  const body = `
<div class="wrap">
${stage(p, `
  <p class="crumbs mono"><a href="/">Houses</a> / <a href="/traditions">Traditions</a></p>
  <h1>${esc(c)}</h1>
  <p class="lede" style="margin-top:18px">${esc(TRADITIONS[c] || "")} ${list.length} ${list.length === 1 ? "house" : "houses"} in the index.</p>
`)}
<section style="margin-top:clamp(36px,4vw,60px)">
  ${indexTable(list, false)}
</section>
<section>
  <div class="sec-head" data-reveal="children"><div><p class="kicker">Keep going</p><h2>Other traditions</h2></div>
    <a class="btn btn--ghost plain" href="/traditions">All ${cats.length} ${ICON.arrow}</a></div>
  <div class="grid" data-reveal="children">
    ${cats.filter(x => x !== c).slice(0, 4).map(x => tile(catUrl(x), x, `${countIn(x)} ${countIn(x) === 1 ? "house" : "houses"}`, "", photo.forCat(x))).join("\n    ")}
  </div>
</section>
</div>
`;
  return shell({
    title: `${/house$/i.test(c) ? `${c} perfume brands` : `${c} perfume houses and brands`} | Perfume Houses`, canonical, body, current: "traditions", ogImage: p.src,
    desc: catDesc(c, list),
    jsonld: { "@context": "https://schema.org", "@graph": [crumbs([["Perfume Houses", "/"], ["Traditions", "/traditions"], [c, catUrl(c)]]),
      { "@type": "CollectionPage", name: `${c} perfume houses`, url: canonical,
      mainEntity: { "@type": "ItemList", numberOfItems: list.length,
        itemListElement: list.map((h, i) => ({ "@type": "ListItem", position: i + 1, name: h.name, url: ORIGIN + houseUrl(h) })) } }] }
  });
}

/* ------------------------------------------------------------ about page */
const creditItems = [
  ...cats.map(c => [`${c} (tradition)`, photo.forCat(c)]),
  ["About page", photo.page("about")], ["Contact page", photo.page("acquire")],
  ...sorted.filter(h => houseCredits[h.slug]).map(h => [h.name, photo.forHouse(h)])
].map(([where, p]) => `<li>${esc(where)}: ${esc(p.cap.toLowerCase())}, by <a href="${p.by.link}" rel="noopener">${esc(p.by.user)}</a></li>`).join("\n    ");

const aboutBody = `
<div class="wrap">
${stage(photo.page("about"), `
  <p class="kicker">About</p>
  <h1>What this site is</h1>
  <p class="lede" style="margin-top:18px">A reference list of the firms that make fragrance, and nothing else.</p>
`)}
<div class="entry">
  <article class="prose">
    <div data-reveal="children">
      <p>Most writing about perfume is either a shop selling it or a review of how it smells. Neither usually tells you who made it, when the house started, or where. This index is meant to answer those questions quickly.</p>
      <p>Every entry gives a founding year, a founder, a country, the fragrances the house is best known for, and a few paragraphs of background, written from public sources. Some founding stories in this industry are marketing as much as history, and where a claim is disputed the entry says so rather than repeating it.</p>
    </div>
    <h2>What it is not</h2>
    <p>The site does not sell fragrance, take commission or carry advertising. It is not affiliated with any house listed, and no house has reviewed its entry. House and fragrance names are trade marks of their owners.</p>
    <h2>Corrections</h2>
    <p>Dates and attributions in perfumery get copied from one source to the next, mistakes included. If an entry is wrong, please <a href="/acquire">send a correction</a> with a source.</p>
    <h2 id="photographs">Photographs and clips</h2>
    <p>The photographs show places and raw materials. None shows a product of any house in the index. All are from Unsplash, used under the Unsplash licence.</p>
    <p>The three moving scenes on the front page are <strong>generated</strong>, not filmed: they were made with Google's video model and cut into still frames. They are atmosphere, nothing more. No scene shows a real workshop, a real person or any product of a house in the index, and nothing in them should be read as a photograph of anything that exists.</p>
    <p>The moving clips were generated with Google Vids from written descriptions. They are not footage of a real perfumery, they carry Google's corner mark for AI-generated video, and they are decoration rather than evidence.</p>
    <ul class="credits">
    ${creditItems}
    </ul>
    <p class="revised">Page revised ${todayLong}.</p>
  </article>
</div>
</div>
`;

const acquireBody = `
<div class="wrap">
${stage(photo.page("acquire"), `
  <p class="kicker">The domain</p>
  <h1>PerfumeHouses.com is for sale</h1>
  <p class="lede" style="margin-top:18px">An exact-match two-word .com for the fragrance trade, with a built index already on it.</p>
`, { tight: true })}
<div class="entry">
  <article class="prose">
    <div class="notice glass" data-reveal="children" style="margin-top:0">
      <p class="kicker">Price</p>
      <h2 style="margin-top:6px">$1,295 to buy outright</h2>
      <p>Or in monthly instalments through Afternic’s lease-to-own, which transfers the name at the end of the term. Both run through GoDaddy/Afternic: they hold the payment, move the domain, and take the risk out of it for the buyer and for me.</p>
      <div class="cta-row" style="margin-bottom:0">
        <a class="btn btn--accent plain" href="https://www.afternic.com/domain/perfumehouses.com" rel="noopener">Buy or make an offer ${ICON.arrow}</a>
        <a class="btn btn--ghost plain" href="mailto:mustafanofl32@gmail.com?subject=PerfumeHouses.com">Email me directly</a>
      </div>
    </div>

    <div data-reveal="children">
      <h2>What comes with it</h2>
      <ul>
        <li><strong>The name.</strong> perfumehouses.com, registered and clean — no trade mark dispute, no penalty history, nothing to unwind.</li>
        <li><strong>The site on it.</strong> ${houses.length} researched entries, ${cats.length} tradition pages, a timeline, and the code that builds them &mdash; all of it public at <a href="https://github.com/mustafanofl32/perfumehouses-com" rel="noopener">github.com/mustafanofl32/perfumehouses-com</a>, so you can read it before you buy. Yours if you want it, deleted if you do not.</li>
        <li><strong>A head start with Google.</strong> Indexed, a submitted sitemap, clean URLs and structured data already in place. A new domain starts from nothing; this one does not.</li>
      </ul>

      <h2>Who it fits</h2>
      <p>A fragrance retailer or marketplace, a distributor, a review or discovery site — anyone who would rather own the plain English words for the thing they sell than a coined name they have to teach people. The index is proof the name reads as a brand; it is not a condition of the sale.</p>

      <h2>How it goes</h2>
      <p>Buy it outright and Afternic moves it, usually within a day or two of payment clearing. On lease-to-own you pay monthly and it transfers when the last payment lands. Offers are welcome; I answer every one, including the low ones, and I answer within a day.</p>
    </div>

    <div data-reveal="children">
      <h2>Corrections to the index</h2>
      <p>Separate from any of the above: if a date, founder or attribution here is wrong, email <a href="mailto:mustafanofl32@gmail.com">mustafanofl32@gmail.com</a> with the correction and where it comes from. Entries are updated when a correction checks out.</p>
    </div>
  </article>
</div>
</div>
`;

/* --------------------------------------------------------------- writing */
fs.mkdirSync(path.join(OUT, "assets"), { recursive: true });
fs.mkdirSync(path.join(OUT, "houses"), { recursive: true });
fs.mkdirSync(path.join(OUT, "traditions"), { recursive: true });
fs.writeFileSync(path.join(OUT, "assets", "site.css"), CSS);

fs.writeFileSync(path.join(OUT, "index.html"), shell({
  title: "Perfume Houses: an index of fragrance houses",
  desc: `An index of ${houses.length} perfume houses with founding year, founder, country and best-known fragrances, from Floris (1730) to BDK Parfums (2016).`,
  canonical: ORIGIN + "/", current: "houses", body: homeBody, script: tableScript, home: true, ogImage: "/assets/scenes/bench-poster.webp",
  jsonld: {
    "@context": "https://schema.org", "@type": "CollectionPage", name: "Perfume Houses", url: ORIGIN + "/", dateModified: today,
    mainEntity: { "@type": "ItemList", numberOfItems: houses.length,
      itemListElement: sorted.map((h, i) => ({ "@type": "ListItem", position: i + 1, name: h.name, url: ORIGIN + houseUrl(h) })) }
  }
}));

fs.writeFileSync(path.join(OUT, "traditions.html"), shell({
  title: "Traditions | Perfume Houses", current: "traditions", body: traditionsBody,
  desc: `The ${cats.length} traditions the index groups perfume houses into, from historic French and British houses to Gulf, Italian, American and Nordic ones.`,
  canonical: ORIGIN + "/traditions", ogImage: photo.forCat("Niche French").src,
  jsonld: { "@context": "https://schema.org", "@type": "CollectionPage", name: "Traditions", url: ORIGIN + "/traditions",
    mainEntity: { "@type": "ItemList", numberOfItems: cats.length,
      itemListElement: cats.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c + " perfume houses", url: ORIGIN + catUrl(c) })) } }
}));

fs.writeFileSync(path.join(OUT, "timeline.html"), shell({
  title: "Timeline | Perfume Houses", current: "timeline", body: timelineBody,
  desc: `All ${houses.length} perfume houses in the index in order of founding, from ${Math.min(...years)} to ${Math.max(...years)}.`,
  canonical: ORIGIN + "/timeline", ogImage: photo.forCat("Heritage").src,
  jsonld: { "@context": "https://schema.org", "@type": "CollectionPage", name: "Timeline", url: ORIGIN + "/timeline",
    mainEntity: { "@type": "ItemList", numberOfItems: houses.length,
      itemListElement: [...houses].sort((a,b)=>a.founded-b.founded).map((h, i) => ({ "@type": "ListItem", position: i + 1, name: h.name + " (" + h.founded + ")", url: ORIGIN + houseUrl(h) })) } }
}));

sorted.forEach((h, i) => fs.writeFileSync(path.join(OUT, "houses", h.slug + ".html"), housePage(h, sorted[i - 1], sorted[i + 1])));
cats.forEach(c => fs.writeFileSync(path.join(OUT, "traditions", slugify(c) + ".html"), traditionPage(c)));

fs.writeFileSync(path.join(OUT, "about.html"), shell({
  title: "About | Perfume Houses", current: "about", body: aboutBody, ogImage: "/assets/img/about.jpg",
  desc: "What the Perfume Houses index covers, how entries are written, and credits for the photographs and clips.",
  canonical: ORIGIN + "/about",
  jsonld: { "@context": "https://schema.org", "@type": "AboutPage", name: "About Perfume Houses", url: ORIGIN + "/about",
    isPartOf: { "@type": "WebSite", name: "Perfume Houses", url: ORIGIN + "/" } }
}));
fs.writeFileSync(path.join(OUT, "acquire.html"), shell({
  title: "PerfumeHouses.com is for sale | Perfume Houses", body: acquireBody, ogImage: "/assets/img/acquire.jpg", current: "acquire",
  desc: "PerfumeHouses.com, an exact-match .com for the fragrance trade, is for sale at $1,295 or in monthly instalments through Afternic. The built index comes with it.",
  canonical: ORIGIN + "/acquire",
  jsonld: { "@context": "https://schema.org", "@type": "ContactPage", name: "Contact", url: ORIGIN + "/acquire",
    isPartOf: { "@type": "WebSite", name: "Perfume Houses", url: ORIGIN + "/" } }
}));

fs.writeFileSync(path.join(OUT, "404.html"), shell({
  noindex: true,
  title: "Page not found | Perfume Houses",
  desc: "That page is not in the index.",
  canonical: ORIGIN + "/404",
  body: `<div class="wrap"><section style="margin-top:clamp(60px,12vh,140px)" data-hero>
    <p class="kicker">404</p>
    <h1>That page is not in the index</h1>
    <p class="lede" style="margin-top:20px">The link may be old, or the house may be filed under a different name.</p>
    <div class="cta-row">
      <a class="btn btn--accent plain" href="/">Open the index ${ICON.arrow}</a>
      <a class="btn btn--ghost plain" href="/traditions">Browse traditions</a>
    </div>
  </section></div>`
}));

const urls = [ORIGIN + "/", ORIGIN + "/traditions", ORIGIN + "/timeline", ORIGIN + "/about", ORIGIN + "/acquire",
  ...cats.map(c => ORIGIN + catUrl(c)), ...sorted.map(h => ORIGIN + houseUrl(h))];
fs.writeFileSync(path.join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n") + `\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);

console.log(`Built ${sorted.length} house pages + ${cats.length} tradition pages + 5 others = ${urls.length} URLs (drop clip: ${hasDrop ? "yes" : "not yet"})`);
