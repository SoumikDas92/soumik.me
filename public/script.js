import { research, learning, projects, experience, contact } from './content.js';
const $ = selector => document.querySelector(selector);
const node = (tag, text, cls) => Object.assign(document.createElement(tag), { textContent: text, className: cls || '' });
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

function renderNotes(target, entries, symbols = false) {
  entries.forEach(([title, text], index) => {
    const item = node('details', '');
    const summary = node('summary', title);
    if (symbols) {
      const icon = node('span', `◇ / 0${index + 1}`, 'research-icon');
      icon.setAttribute('aria-hidden', 'true');
      summary.prepend(icon);
    }
    item.append(summary, node('p', text));
    $(target).append(item);
  });
}
renderNotes('#research-list', research, true);
renderNotes('#learning-list', learning);
function link(text, url) {
  const anchor = node('a', text, 'button');
  anchor.href = url;
  return anchor;
}
if (projects.length) {
  const list = $('#project-list');
  list.className = 'grid';
  list.replaceChildren(...projects.map(project => {
    const card = node('article', '');
    card.append(node('h3', project.name), node('p', project.description));
    for (const image of project.images || []) card.append(Object.assign(node('img', ''), { ...image, loading: 'lazy', decoding: 'async' }));
    for (const [label, value] of Object.entries({ Technologies: project.technologies, Concepts: project.concepts, Challenges: project.challenges, Process: project.process })) {
      if (value?.length) card.append(node('h4', label), node('p', Array.isArray(value) ? value.join(' · ') : value));
    }
    if (project.repository) card.append(link('Repository ↗', project.repository));
    if (project.demo) card.append(link('Live demonstration ↗', project.demo));
    return card;
  }));
}
for (const entry of experience) {
  const item = node('li', '');
  item.append(node('span', entry.label, 'eyebrow'), node('h3', entry.title), node('p', entry.description));
  $('#experience-list').append(item);
}
$('#contact-list').replaceChildren(...Object.entries(contact).map(([name, url]) => {
  const item = node('li', url ? '' : `${name} · Not listed`);
  if (url) item.append(link(`${name} ↗`, url));
  return item;
}));
if (Object.values(contact).some(Boolean)) $('.contact > p:not(.eyebrow)').textContent = 'Find me through the channels below.';

const menu = $('.menu');
const navigation = $('#navigation');
const narrow = matchMedia('(max-width:800px)');
function setMenu(open) {
  menu.hidden = !narrow.matches;
  menu.setAttribute('aria-expanded', String(open && narrow.matches));
  navigation.hidden = narrow.matches && !open;
}
setMenu(false);
narrow.addEventListener('change', () => setMenu(false));
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') === 'false'));
navigation.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { setMenu(false); menu.focus(); } });
const navLinks = [...navigation.querySelectorAll('a')];
let scheduled = false;
function track() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    const atEnd = scrollY + innerHeight >= document.documentElement.scrollHeight - 3;
    const current = atEnd ? navLinks.at(-1) : navLinks.findLast(link => $(link.hash).getBoundingClientRect().top <= innerHeight * .42) || navLinks[0];
    navLinks.forEach(link => link === current ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current'));
  });
}
addEventListener('scroll', track, {passive:true}); addEventListener('resize', track); track();
if ('IntersectionObserver' in window && !reduced.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(({target,isIntersecting}) => {
    if (isIntersecting) { target.classList.add('enter'); observer.unobserve(target); }
  }), {threshold:.12});
  document.querySelectorAll('.chapter').forEach(section => observer.observe(section));
}
if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
  const pointer = node('div', '', 'pointer'); pointer.setAttribute('aria-hidden','true'); document.body.append(pointer);
  document.addEventListener('pointermove', event => {
    if (reduced.matches || event.pointerType !== 'mouse') return;
    pointer.style.opacity = '1'; pointer.style.left = `${event.clientX}px`; pointer.style.top = `${event.clientY}px`;
    pointer.classList.toggle('hot', !!event.target.closest('a,button,summary'));
  }, {passive:true});
  document.documentElement.addEventListener('pointerleave', () => { pointer.style.opacity = '0'; });
  document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('pointermove', event => {
      if (reduced.matches || event.pointerType !== 'mouse') return;
      const box = button.getBoundingClientRect();
      button.style.setProperty('--mx', `${(event.clientX - box.left - box.width / 2) * .08}px`);
      button.style.setProperty('--my', `${(event.clientY - box.top - box.height / 2) * .16}px`);
    });
    button.addEventListener('pointerleave', () => { button.style.removeProperty('--mx'); button.style.removeProperty('--my'); });
  });
}
const diagram = $('#diagram'); diagram.hidden = false;
diagram.addEventListener('click', () => diagram.setAttribute('aria-pressed', String($('.blueprint').classList.toggle('active'))));
const dialog = $('#lab');
const trigger = $('#open-lab'); trigger.hidden = typeof dialog.showModal !== 'function';
let scene;
trigger.addEventListener('click', async () => {
  dialog.showModal();
  if (scene) { scene.start(); return; }
  try {
    const { createLab } = await import('./lab.js');
    if (!dialog.open || scene) return;
    scene = createLab($('#viewport'), $('#angle'), $('#elbow'), $('#reset'));
    $('.lab-controls').hidden = false;
    $('#lab-status').hidden = true;
    scene.start();
  } catch {
    $('#lab-status').textContent = 'Interactive 3D is unavailable on this device. You can still view the concept illustration.';
  }
});
dialog.addEventListener('close', () => { scene?.stop(); trigger.focus(); });
if (!reduced.matches) {
  const intro = $('.intro-controls');
  intro.hidden = false;
  const finish = () => { intro.hidden = true; };
  const timer = setTimeout(() => {
    if (!intro.contains(document.activeElement)) finish();
    else intro.addEventListener('focusout', finish, {once:true});
  }, 1200);
  $('#skip-intro').addEventListener('click', () => {
    clearTimeout(timer);
    $('.hero').classList.add('skip-intro');
    $('.primary').focus({preventScroll:true});
    finish();
  });
}
