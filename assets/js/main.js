import { projects, photos, officialCountryCodes, countryNotes, travelData } from './content.js';

const escapeHTML = (value = '') => value.replace(/[&<>'\"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
const navToggle = document.querySelector('.nav-toggle');
const navLinks = [...document.querySelectorAll('.expedition-index a')];
const sections = [...document.querySelectorAll('main > section[id]')];

navToggle?.addEventListener('click', () => {
  const open = document.body.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', String(open));
});
navLinks.forEach((link) => link.addEventListener('click', () => {
  document.body.classList.remove('nav-open');
  navToggle?.setAttribute('aria-expanded', 'false');
}));

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach((link) => link.classList.toggle('active', link.dataset.section === visible.target.id));
}, { rootMargin: '-25% 0px -60%', threshold: [0, .25, .6] });
sections.forEach((section) => sectionObserver.observe(section));

const updateScrollProgress = () => {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  const progress = available > 0 ? Math.min(100, (window.scrollY / available) * 100) : 0;
  document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
};
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

const projectGrid = document.querySelector('#project-grid');
projects.filter((project) => !project.draft).forEach((project, index) => {
  const article = document.createElement('article');
  article.className = 'project-card reveal';
  const metadata = [project.status, project.year].filter(Boolean).join(' / ');
  const tags = project.technologies.length
    ? `<ul class="tag-list" aria-label="Technologies">${project.technologies.map((technology) => `<li>${escapeHTML(technology)}</li>`).join('')}</ul>`
    : '';
  const projectAction = project.primaryLink
    ? `<a class="project-link mono" href="${project.primaryLink}" target="_blank" rel="noreferrer">${escapeHTML(project.linkLabel || 'VIEW PROJECT')} <span aria-hidden="true">↗</span></a>`
    : '';
  article.innerHTML = `
    <div class="project-top mono"><span>BUILD ${String(index + 1).padStart(2, '0')}</span><span>${escapeHTML(metadata)}</span></div>
    <div class="project-mark" aria-hidden="true"><span>${escapeHTML(project.mark)}</span><i></i><i></i><i></i></div>
    <h3>${escapeHTML(project.title)}</h3>
    <p>${escapeHTML(project.summary)}</p>
    ${tags}
    ${projectAction}`;
  projectGrid.append(article);
});

const lightbox = document.querySelector('#lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxCaption = lightbox?.querySelector('figcaption');
const photoGrid = document.querySelector('#photo-grid');
photos.filter((photo) => !photo.draft && photo.src).forEach((photo, index) => {
  const figure = document.createElement('figure');
  figure.className = `photo-item photo-${photo.orientation} reveal`;
  figure.innerHTML = `
    <button type="button" aria-label="Open photograph from ${escapeHTML(photo.country)}">
      <img src="${photo.src}" alt="${escapeHTML(photo.alt)}" loading="lazy">
      <span class="photo-number mono">FRAME ${String(index + 1).padStart(3, '0')}</span>
    </button>
    <figcaption><strong>${escapeHTML(photo.country)}</strong><span>${escapeHTML(photo.date)} / ${escapeHTML(photo.caption)}</span></figcaption>`;
  figure.querySelector('button').addEventListener('click', () => {
    lightboxImage.src = photo.src; lightboxImage.alt = photo.alt;
    lightboxCaption.textContent = `${photo.country} · ${photo.date} — ${photo.caption}`;
    lightbox.showModal();
  });
  photoGrid.append(figure);
});
lightbox?.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });

const countryDisplayNames = new Intl.DisplayNames(['en'], { type: 'region' });
const countryByCode = new Map(travelData.map((country) => [country.code, country]));
const visitedCount = travelData.filter((country) => country.visited).length;
document.querySelectorAll('[data-country-count]').forEach((element) => { element.textContent = visitedCount; });

const mapContainer = document.querySelector('#world-map');
const mapStatus = document.querySelector('#map-status');
const countryCard = document.querySelector('#country-card');
const countryName = (path, code) => path?.dataset.countryName || path?.getAttribute('aria-label') || countryDisplayNames.of(code.toUpperCase()) || code.toUpperCase();
const showCountry = (path, code) => {
  const record = countryByCode.get(code) || countryNotes[code];
  const name = countryName(path, code);
  const status = record?.visited ? 'Visited' : record ? 'Not yet' : 'Map context';
  mapStatus.textContent = `${name.toUpperCase()} / ${status.toUpperCase()}`;
  countryCard.hidden = false;
  countryCard.innerHTML = `<span class="mono">${escapeHTML(code.toUpperCase())} / ${escapeHTML(status)}</span><strong>${escapeHTML(name)}</strong><p>${escapeHTML(record?.note || (record?.provisional ? 'Travel status follows the provisional 175-country record.' : 'Included for geographic context.'))}</p>${record?.year ? `<small class="mono">FIELD NOTE / ${escapeHTML(record.year)}</small>` : ''}`;
};

const initializeMap = async () => {
  try {
    const response = await fetch('assets/data/world.svg');
    if (!response.ok) throw new Error('Map unavailable');
    const svgText = await response.text();
    const parsed = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    const svg = parsed.documentElement;
    svg.classList.add('atlas-map'); svg.setAttribute('role', 'group'); svg.setAttribute('aria-label', 'World map with visited countries highlighted');
    mapContainer.replaceChildren(document.importNode(svg, true));
    mapContainer.querySelectorAll('path[id]').forEach((path) => {
      const code = path.id.toLowerCase();
      const record = countryByCode.get(code) || countryNotes[code];
      path.classList.add(record?.visited ? 'visited' : record ? 'unvisited' : 'context');
      if (!record) return;
      const name = countryName(path, code);
      path.dataset.countryName = name;
      path.setAttribute('tabindex', '0'); path.setAttribute('role', 'button');
      path.setAttribute('aria-label', `${name}: ${record.visited ? 'visited' : 'not yet visited'}`);
      path.addEventListener('pointerenter', () => showCountry(path, code));
      path.addEventListener('focus', () => showCountry(path, code));
      path.addEventListener('click', () => showCountry(path, code));
      path.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); showCountry(path, code); } });
    });
  } catch (error) {
    mapContainer.classList.add('map-failed');
    mapContainer.textContent = 'The interactive map could not be loaded. The country index remains available below.';
  }
};

const countryList = document.querySelector('#country-list');
const list = document.createElement('ul');
travelData.map((record) => ({ ...record, name: countryDisplayNames.of(record.code.toUpperCase()) || record.code.toUpperCase() })).sort((a,b) => a.name.localeCompare(b.name)).forEach((country) => {
  const item = document.createElement('li');
  item.innerHTML = `<span>${escapeHTML(country.name)}</span><b class="mono ${country.visited ? 'is-visited' : ''}">${country.visited ? 'VISITED' : 'NOT YET'}</b>`;
  list.append(item);
});
countryList.append(list);
initializeMap();

const revealObserver = new IntersectionObserver((entries, observer) => entries.forEach((entry) => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add('is-visible'); observer.unobserve(entry.target);
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.querySelector('#updated-year').textContent = new Date().getFullYear();
const githubChart = document.querySelector('#github-chart');
githubChart?.addEventListener('error', () => githubChart.closest('.github-chart-link')?.classList.add('failed'));
if (officialCountryCodes.length !== 197 || visitedCount !== 175) console.warn('Travel data invariant failed', { total: officialCountryCodes.length, visited: visitedCount });
