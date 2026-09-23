const { regions, projects, officialCountryCodes, countryNotes, travelData } = window.siteContent;

const escapeHTML = (value = '') => String(value).replace(/[&<>'\"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
const statusLabel = (status) => status === 'private' ? 'PRIVATE <span class="lock-icon" aria-hidden="true"></span>' : status.toUpperCase();
const iconMarkup = (app) => app.icon ? `<img src="${app.icon}" alt="${escapeHTML(app.iconAlt)}">` : `<span aria-hidden="true">${escapeHTML(app.fallback)}</span>`;

const regionList = document.querySelector('#region-list');
regions.forEach((region) => {
  const article = document.createElement('article');
  article.className = `region-card region-${region.id} reveal`;
  const appContents = region.app ? `<span class="app-icon">${iconMarkup(region.app)}</span><span class="app-copy"><strong>${escapeHTML(region.app.name)}</strong><span>${escapeHTML(region.app.description)}</span></span>` : '';
  const app = region.app
    ? region.app.url
      ? `<a class="region-app" href="${region.app.url}" aria-label="Open ${escapeHTML(region.app.name)}">${appContents}<b aria-hidden="true">↗</b></a>`
      : `<div class="region-app">${appContents}</div>`
    : `<div class="future-note"><span class="mono">FUTURE</span><p>No system yet. Just a place in the structure when it is useful.</p></div>`;
  article.innerHTML = `<div class="region-card-top"><h3>${escapeHTML(region.name)}</h3></div>${app}<span class="status status-${region.visibility} mono">${statusLabel(region.visibility)}</span>`;
  regionList.append(article);
});

const projectStack = document.querySelector('#project-stack');
projects.forEach((project, index) => {
  const article = document.createElement('article');
  article.className = 'project-row reveal';
  const action = project.url ? `<a href="${project.url}" target="_blank" rel="noreferrer" aria-label="Open ${escapeHTML(project.name)}"><span>Open</span><b aria-hidden="true">↗</b></a>` : '<span class="no-link mono">IN PROGRESS</span>';
  article.innerHTML = `<span class="project-index mono">${String(index + 1).padStart(2, '0')}</span><span class="project-mark mono" aria-hidden="true">${escapeHTML(project.mark)}</span><div><h3>${escapeHTML(project.name)}</h3><p>${escapeHTML(project.description)}</p></div><div class="project-meta"><span class="status mono">${escapeHTML(project.status.toUpperCase())}${project.year ? ` / ${escapeHTML(project.year)}` : ''}</span>${action}</div>`;
  projectStack.append(article);
});

const navToggle = document.querySelector('.nav-toggle');
const navLinks = [...document.querySelectorAll('.site-nav a')];
navToggle?.addEventListener('click', () => { const open = document.body.classList.toggle('nav-open'); navToggle.setAttribute('aria-expanded', String(open)); });
navLinks.forEach((link) => link.addEventListener('click', () => { document.body.classList.remove('nav-open'); navToggle?.setAttribute('aria-expanded', 'false'); }));
const sectionObserver = new IntersectionObserver((entries) => { const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0]; if (!visible) return; navLinks.forEach((link) => link.classList.toggle('active', link.dataset.section === visible.target.id)); }, { rootMargin: '-25% 0px -60%', threshold: [0, .3] });
document.querySelectorAll('main > section[id]:not(#top)').forEach((section) => sectionObserver.observe(section));

const countryDisplayNames = new Intl.DisplayNames(['en'], { type: 'region' });
const countryByCode = new Map(travelData.map((country) => [country.code, country]));
// The published total is authoritative while individual map statuses remain provisional.
const visitedCount = travelData.filter((country) => country.visited).length;
const remainingCount = travelData.length - visitedCount;
document.querySelectorAll('[data-country-count]').forEach((element) => { element.textContent = visitedCount; });
document.querySelectorAll('[data-country-remaining]').forEach((element) => { element.textContent = remainingCount; });
const mapContainer = document.querySelector('#world-map');
const mapStatus = document.querySelector('#map-status');
const countryCard = document.querySelector('#country-card');
const countryName = (path, code) => path?.dataset.countryName || path?.getAttribute('aria-label') || countryDisplayNames.of(code.toUpperCase()) || code.toUpperCase();
const showCountry = (path, code) => { const record = countryByCode.get(code) || countryNotes[code]; const name = countryName(path, code); const status = record?.visited ? 'Visited' : record ? 'Not yet' : 'Map context'; mapStatus.textContent = `${name.toUpperCase()} / ${status.toUpperCase()}`; countryCard.hidden = false; countryCard.innerHTML = `<span class="mono">${escapeHTML(code.toUpperCase())} / ${escapeHTML(status)}</span><strong>${escapeHTML(name)}</strong><p>${escapeHTML(record?.note || (record?.provisional ? `Travel status follows the provisional ${visitedCount}-country record.` : 'Included for geographic context.'))}</p>${record?.year ? `<small class="mono">FIELD NOTE / ${escapeHTML(record.year)}</small>` : ''}`; };
const initializeMap = async () => {
  const showStaticMap = () => {
    mapContainer.classList.add('map-failed');
    mapContainer.innerHTML = '<img src="assets/img/been-map.jpg" alt="Map highlighting countries Jon has visited"><p class="mono">INTERACTIVE MAP AVAILABLE ON THE LIVE SITE</p>';
  };
  if (window.location.protocol === 'file:') { showStaticMap(); return; }
  try {
    const response = await fetch('assets/data/world.svg'); if (!response.ok) throw new Error('Map unavailable');
    const parsed = new DOMParser().parseFromString(await response.text(), 'image/svg+xml'); const svg = parsed.documentElement;
    svg.classList.add('atlas-map'); svg.setAttribute('role', 'group'); svg.setAttribute('aria-label', 'World map with visited countries highlighted'); mapContainer.replaceChildren(document.importNode(svg, true));
    mapContainer.querySelectorAll('path[id]').forEach((path) => { const code = path.id.toLowerCase(); const record = countryByCode.get(code) || countryNotes[code]; path.classList.add(record?.visited ? 'visited' : record ? 'unvisited' : 'context'); if (!record) return; const name = countryName(path, code); path.dataset.countryName = name; path.setAttribute('tabindex', '0'); path.setAttribute('role', 'button'); path.setAttribute('aria-label', `${name}: ${record.visited ? 'visited' : 'not yet visited'}`); ['pointerenter','focus','click'].forEach((eventName) => path.addEventListener(eventName, () => showCountry(path, code))); path.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); showCountry(path, code); } }); });
  } catch {
    showStaticMap();
  }
};
const list = document.createElement('ul');
travelData.map((record) => ({ ...record, name: countryDisplayNames.of(record.code.toUpperCase()) || record.code.toUpperCase() })).sort((a,b) => a.name.localeCompare(b.name)).forEach((country) => { const item = document.createElement('li'); item.innerHTML = `<span>${escapeHTML(country.name)}</span><b class="mono ${country.visited ? 'is-visited' : ''}">${country.visited ? 'VISITED' : 'NOT YET'}</b>`; list.append(item); });
document.querySelector('#country-list').append(list); initializeMap();

const revealObserver = new IntersectionObserver((entries, observer) => entries.forEach((entry) => { if (!entry.isIntersecting) return; entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }), { threshold: .1 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
document.querySelector('#updated-year').textContent = new Date().getFullYear();
const githubChart = document.querySelector('#github-chart');
githubChart?.addEventListener('error', () => githubChart.closest('.github-chart-link')?.classList.add('failed'));
if (officialCountryCodes.length !== 197) console.warn('Country convention invariant failed', { total: officialCountryCodes.length });
