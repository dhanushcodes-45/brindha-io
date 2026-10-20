/* ====== EDIT THESE ====== */
const CONFIG = {
  name: "Brindha",          // birthday person
  from: "Your Senior",         // who is sending
  day: 19, month: 10,        // birthday date used as the secret password
  hint: "Hint: it's the day we celebrate you 💕",
  dateText: "19 · 10 · 2026"
};
/* Photos in /images: hero.jpg g1-g4 dad daughter s1-s5 w1-w10 r1-r6 (jpg) */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
$('#name').textContent = CONFIG.name; $('#nm2').textContent = CONFIG.name; $('#from').textContent = CONFIG.from; $('#from2').textContent = CONFIG.from; $('#datetxt').textContent = CONFIG.dateText;

// ---- build dynamic sections
// Love Gallery slides  [caption, image]
const SLIDES = [['Every moment is a gift', 's1'], ['You are my sunshine ☀️', 's2'], ['Loved beyond words', 's3'], ['Always smiling', 's4'], ['Forever special', 's5'], ['My favourite person', 's6'], ['Happy Birthday 💖', 's7']];
// Memory Wall: 3 rows of photos that scroll on their own (w1..w18)
const wl = ['Smile', 'Joy', 'Us', 'Sweet', 'Fun', 'Love', 'Happy', 'Cute', 'Together', 'Forever'], WN = 18;
const tile = n => `<div class="wcard"><div class="ph" data-img="images/w${n}.jpg"><i>♥</i></div><span>${wl[(n - 1) % wl.length]}</span></div>`;
$('#stage').innerHTML = [0, 6, 12].map((off, r) => {
  const set = Array.from({ length: WN }, (_, i) => tile((i + off) % WN + 1)).join('');
  return `<div class="wrow ${r % 2 ? 'rev' : ''}" style="--dur:${[95, 120, 105][r]}s"><div class="wset">${set}</div><div class="wset" aria-hidden="true">${set}</div></div>`;
}).join('');
const rs = [['Your smile', 'It lights up every room'], ['Your hugs', 'My safest place'], ['Your patience', 'Always calm, always kind'], ['Your kindness', 'You care without asking'], ['Your laugh', 'The way you make me laugh'], ['Everything', 'Everything about you']];
$('#tl').innerHTML = rs.map((r, i) => `<div class="tl-item" data-anim="${i % 2 ? 'slide-right' : 'slide-left'}"><div class="ph hphoto" data-img="images/r${i + 1}.jpg"><i>♥</i></div><div class="tlcard"><b>${r[0]}</b><small>${r[1]}</small></div></div>`).join('');

// photos: use if the file exists, else keep the heart placeholder.
// Every photo is positioned so the FACE stays inside the frame, whatever the card shape.
const FOCUS = {"hero":[55,36],"g1":[50,40],"g2":[50,52],"g3":[50,40],"g4":[45,42],"s1":[50,38],"s2":[44,38],"s3":[50,48],"s4":[61,25],"s5":[50,20],"s6":[50,58],"s7":[55,36],"w1":[56,26],"w2":[59,28],"w3":[50,38],"w4":[50,40],"w5":[50,40],"w6":[45,45],"w7":[50,38],"w8":[50,45],"w9":[50,38],"w10":[50,35],"w11":[56,65],"w12":[50,38],"w13":[42,42],"w14":[45,42],"w15":[50,40],"w16":[50,20],"w17":[61,25],"w18":[50,58],"r1":[56,65],"r2":[50,48],"r3":[50,38],"r4":[61,25],"r5":[50,58],"r6":[56,26]};
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
function refocus(el) {
  if (!el._iw || !el.clientWidth || !el.clientHeight) return;
  const [fx, fy] = (FOCUS[el._key] || [50, 50]).map(v => v / 100);
  const ir = el._iw / el._ih, br = el.clientWidth / el.clientHeight;
  let px = .5, py = .5;
  if (ir < br) { const vis = ir / br; py = clamp((fy - vis / 2) / (1 - vis)); }   // image taller than frame
  else if (ir > br) { const vis = br / ir; px = clamp((fx - vis / 2) / (1 - vis)); } // image wider than frame
  el.style.backgroundPosition = `${px * 100}% ${py * 100}%`;
}
const ro = new ResizeObserver(es => es.forEach(e => refocus(e.target)));
function loadPhotos(root = document) {
  [...root.querySelectorAll('.ph[data-img]')].forEach(el => {
    if (el._seen) return; el._seen = 1;
    const i = new Image();
    i.onload = () => {
      el._iw = i.naturalWidth; el._ih = i.naturalHeight; el._key = el.dataset.img.split('/').pop().replace(/\.\w+$/, '');
      el.style.backgroundImage = `url("${i.src}")`; el.style.setProperty('--img', `url("${i.src}")`);
      el.classList.add('loaded'); refocus(el); ro.observe(el);
    };
    i.src = el.dataset.img;
  });
}

// floating hearts
setInterval(() => { const s = document.createElement('span'); s.textContent = '♥'; s.style.left = Math.random() * 100 + '%'; s.style.fontSize = 12 + Math.random() * 22 + 'px'; s.style.animationDuration = 6 + Math.random() * 6 + 's'; $('#hearts').appendChild(s); setTimeout(() => s.remove(), 12000); }, 700);

// confetti
const cv = $('#fx'), cx = cv.getContext('2d'); let bits = [];
const fit = () => { cv.width = innerWidth; cv.height = innerHeight; }; fit(); addEventListener('resize', fit);
function burst() { for (let i = 0; i < 120; i++) bits.push({ x: innerWidth / 2, y: innerHeight / 2, vx: (Math.random() - .5) * 16, vy: Math.random() * -14 - 2, c: ['#7a1226', '#e8a0b0', '#fff', '#ff4d6d'][i % 4], h: Math.random() > .5, r: 4 + Math.random() * 8 }); }
(function loop() { cx.clearRect(0, 0, cv.width, cv.height); bits = bits.filter(b => b.y < cv.height + 20); bits.forEach(b => { b.x += b.vx; b.y += b.vy; b.vy += .35; cx.fillStyle = b.c; cx.font = b.r * 2 + 'px serif'; b.h ? cx.fillText('♥', b.x, b.y) : cx.fillRect(b.x, b.y, b.r, b.r); }); requestAnimationFrame(loop); })();

// date quiz
function unlock() {
  const d = +$('#dd').value, m = +$('#mm').value;
  if (d === CONFIG.day && m === CONFIG.month) {
    burst(); $('#lock').classList.add('gone'); $('#site').classList.remove('hidden'); scrollTo(0, 0);
    setTimeout(() => { $('#lock').remove(); startSite(); onScroll(); }, 1200);
  } else { const c = $('.lockcard'); c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); $('#hint').textContent = 'Oops, not quite! ' + CONFIG.hint; }
}
$('#open').onclick = unlock;
['#dd', '#mm'].forEach(s => $(s).addEventListener('keydown', e => e.key === 'Enter' && unlock()));

function startSite() {
  const t = 'Happy Birthday', el = $('#typed'); let n = 0;
  (function type() { el.textContent = t.slice(0, ++n); if (n < t.length) setTimeout(type, 110); })();
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .2 });
  $$('[data-anim]').forEach(e => io.observe(e));
  $$('.flip').forEach((e, i) => e.style.transitionDelay = i * .15 + 's');
  new IntersectionObserver(es => es[0].isIntersecting && burst(), { threshold: .6 }).observe($('.iloveyou'));
}
$$('.flip').forEach(f => f.onclick = () => f.classList.toggle('on'));

// scroll effect: letter tilt (the Memory Wall scrolls by itself via CSS)
const mq = matchMedia('(min-width:700px)');
function onScroll() {
  const w = $('#noteWrap');
  if (w && mq.matches) { const r = w.getBoundingClientRect(); w.style.setProperty('--p', Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)))); } else if (w) w.style.setProperty('--p', 0);
}
addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll);

// (--p is set on #noteWrap and inherited by .sticky)

// ================= LOVE GALLERY: 3D coverflow =================
const cf = $('#cf'), cfTrack = $('#cfTrack'), N = SLIDES.length, INTERVAL = 3800;
const cfCards = SLIDES.map(([t, k]) => { const d = document.createElement('div'); d.className = 'cfcard'; d.innerHTML = `<div class="ph" data-img="images/${k}.jpg"><i>♥</i></div>`; cfTrack.appendChild(d); return d; });
$('#cfDots').innerHTML = SLIDES.map((_, i) => `<i data-i="${i}"></i>`).join('');
const dots = $$('#cfDots i');
let pos = 0, target = 0, running = false, dragging = false, hover = false, inView = false, shown = -1;
const wrapD = d => ((d + N / 2) % N + N) % N - N / 2;
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

function renderCF() {
  const cw = cfCards[0].offsetWidth; if (!cw) return;
  cfCards.forEach((c, i) => {
    const d = wrapD(i - pos), ad = Math.abs(d), s = Math.sign(d);
    const x = s * cw * (.8 * Math.min(ad, 1) + .42 * clamp(ad - 1, 0, 2));
    const ry = -s * (Math.min(ad, 1) * 42 + clamp(ad - 1, 0, 2) * 8);
    const z = -Math.min(ad, 3) * 140, sc = 1 - Math.min(ad, 3) * .05, y = Math.min(ad, 1) * 16;
    c.style.transform = `translate3d(${x}px,${y}px,${z}px) rotateY(${ry}deg) scale(${sc})`;
    c.style.zIndex = 100 - Math.round(ad * 10);
    c.style.opacity = ad > 2.5 ? Math.max(0, 1 - (ad - 2.5) * 2) : 1;
    c.style.setProperty('--dim', Math.min(ad, 2) * .26);
    c.style.setProperty('--sh', 50 + d * 45);       // moving sheen as the card slides past
    c.classList.toggle('front', ad < .5);
  });
}
function setActive() {
  const idx = ((Math.round(target) % N) + N) % N;
  if (idx === shown) return; shown = idx;
  dots.forEach((d, i) => d.classList.toggle('a', i === idx));
  const cap = $('#cfCap'); cap.innerHTML = `<b>${SLIDES[idx][0]}</b><small>${idx + 1} / ${N}</small>`;
  cap.classList.remove('swap'); void cap.offsetWidth; cap.classList.add('swap');
  restartProg();
}
function restartProg() { const p = $('#cfProg'); p.style.animation = 'none'; void p.offsetWidth; p.style.animation = ''; }
function kick() { if (running) return; running = true; requestAnimationFrame(frame); }
function frame() {
  if (!dragging) { const diff = target - pos; pos += Math.abs(diff) < .0006 ? diff : diff * .12; }
  renderCF();
  if (dragging || Math.abs(target - pos) > .0006) requestAnimationFrame(frame); else running = false;
}
function go(to) { target = to; setActive(); kick(); }
const step = n => go(Math.round(target) + n);

// drag / swipe with momentum
let sx = 0, sp = 0, lastX = 0, lastT = 0, v = 0, moved = 0;
const unit = () => cfCards[0].offsetWidth * .8;
cf.addEventListener('pointerdown', e => { dragging = true; moved = 0; sx = lastX = e.clientX; sp = pos; lastT = performance.now(); v = 0; cf.classList.add('drag'); cf.setPointerCapture(e.pointerId); kick(); });
cf.addEventListener('pointermove', e => {
  if (!dragging) return;
  const now = performance.now(), dt = Math.max(1, now - lastT);
  pos = sp - (e.clientX - sx) / unit(); moved = Math.max(moved, Math.abs(e.clientX - sx));
  v = .8 * v + .2 * (-(e.clientX - lastX) / unit() / dt); lastX = e.clientX; lastT = now;
  target = pos; setActive();
});
const endDrag = e => {
  if (!dragging) return; dragging = false; cf.classList.remove('drag');
  if (moved < 6) {                                 // a tap: jump to the tapped side card
    const hit = document.elementFromPoint(e.clientX, e.clientY), c = hit && hit.closest('.cfcard');
    if (c) { const d = wrapD(cfCards.indexOf(c) - pos); go(Math.round(pos + d)); return; }
  }
  go(Math.round(pos + clamp(v * 260, -2.5, 2.5)));
};
cf.addEventListener('pointerup', endDrag); cf.addEventListener('pointercancel', endDrag);
cf.addEventListener('keydown', e => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });
cf.addEventListener('wheel', e => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 20) { e.preventDefault(); step(e.deltaX > 0 ? 1 : -1); } }, { passive: false });
$('#next').onclick = () => step(1); $('#prev').onclick = () => step(-1);
$('#cfDots').onclick = e => { const i = e.target.dataset.i; if (i !== undefined) go(Math.round(target) + wrapD(+i - Math.round(target))); };

// love button + double-tap: confetti and a floating heart
function love() {
  burst();
  const h = document.createElement('span'); h.className = 'floatheart'; h.textContent = '♥'; cf.appendChild(h); setTimeout(() => h.remove(), 1400);
}
$('#like').onclick = love; cf.addEventListener('dblclick', love);

// autoplay: runs while the section is on screen, pauses on hover / drag
cf.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hover = true; }); cf.addEventListener('pointerleave', () => hover = false);
new IntersectionObserver(es => inView = es[0].isIntersecting, { threshold: .35 }).observe(cf);
if (!reduce) setInterval(() => { if (inView && !hover && !dragging) step(1); }, INTERVAL);
new ResizeObserver(kick).observe(cf);
setActive(); kick();

loadPhotos();

$('#again').onclick = () => { scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(burst, 800); };



