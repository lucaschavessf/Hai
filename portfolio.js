// Presentation settings never change which personal information is shared.
const portfolioLayouts = { editorial: 'Editorial', studio: 'Estúdio', classic: 'Essencial' };
const portfolioColors = [ ['Petróleo', '#087f8c'], ['Floresta', '#37634d'], ['Terracota', '#ad563e'], ['Índigo', '#57549a'], ['Grafite', '#424b53'] ];
const defaultAppearance = { layout: 'editorial', color: '#087f8c', font: 'sans', cover: 'soft' };
let portfolioDevice = 'desktop';

function appearance() {
  const a = { ...defaultAppearance, ...state.appearance };
  return {
    layout: portfolioLayouts[a.layout] ? a.layout : 'editorial',
    color: /^#[0-9a-f]{6}$/i.test(a.color) ? a.color : defaultAppearance.color,
    font: a.font === 'serif' ? 'serif' : 'sans',
    cover: ['soft', 'lines', 'plain'].includes(a.cover) ? a.cover : 'soft'
  };
}
function portfolioTheme() {
  const a = appearance();
  const rgb = a.color.slice(1).match(/../g).map(c => parseInt(c, 16));
  const mix = (target, ratio) => `rgb(${rgb.map(v => Math.round(v * (1-ratio) + target * ratio)).join(',')})`;
  const luminance = rgb.map(v => {v /= 255; return v <= .04045 ? v / 12.92 : ((v+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
  return `--pf-color:${a.color};--pf-tint:${mix(255,.92)};--pf-dark:${mix(0,.62)};--pf-on-color:${luminance>.179?'#152124':'#ffffff'}`;
}
function portfolioControls() {
  const a = appearance();
  return `<section class="portfolio-designer" aria-label="Personalizar portfólio">
    <details class="design-controls"><summary class="design-intro"><h2>Personalize o portfólio</h2><p>Escolha a apresentação que combina com você.</p></summary>
      <fieldset><legend>Design</legend><div class="layout-options">${Object.entries(portfolioLayouts).map(([id,label])=>`<button type="button" class="layout-option" data-appearance="layout" data-value="${id}" aria-pressed="${a.layout===id}"><span class="layout-mini mini-${id}" aria-hidden="true"><i></i><i></i><i></i></span><span>${label}</span></button>`).join('')}</div></fieldset>
      <fieldset><legend>Cor de destaque</legend><div class="color-options">${portfolioColors.map(([label,color])=>`<button type="button" class="color-option" style="--swatch:${color}" data-appearance="color" data-value="${color}" aria-label="${label}" aria-pressed="${a.color===color}"><span></span></button>`).join('')}</div><label class="custom-color" for="portfolio-color"><span>Outra cor</span><input id="portfolio-color" type="color" value="${a.color}"><output id="portfolio-hex">${a.color.toUpperCase()}</output></label></fieldset>
      <fieldset><legend>Tipografia</legend><div class="design-segment">${[['sans','Contemporânea'],['serif','Clássica']].map(([id,label])=>`<button type="button" data-appearance="font" data-value="${id}" aria-pressed="${a.font===id}"><span class="type-sample ${id}">Aa</span>${label}</button>`).join('')}</div></fieldset>
      <fieldset><legend>Capa</legend><div class="cover-options">${[['soft','Suave'],['lines','Linhas'],['plain','Lisa']].map(([id,label])=>`<button type="button" data-appearance="cover" data-value="${id}" aria-pressed="${a.cover===id}"><span class="cover-mini cover-${id}" aria-hidden="true"></span>${label}</button>`).join('')}</div></fieldset>
      <div class="design-bottom"><span role="status" id="design-save-status">Suas escolhas são salvas automaticamente.</span><button type="button" class="text-button" data-design-reset>Restaurar aparência</button></div>
    </details>
    <div class="design-preview"><div class="preview-bar"><span>Prévia pública</span><div class="device-options" aria-label="Tamanho da prévia"><button type="button" data-portfolio-device="desktop" aria-pressed="${portfolioDevice==='desktop'}">Desktop</button><button type="button" data-portfolio-device="mobile" aria-pressed="${portfolioDevice==='mobile'}">Celular</button></div><button type="button" class="text-button" data-action="preview">Ampliar</button></div><div class="preview-canvas"><div id="portfolio-live" class="portfolio-viewport ${portfolioDevice}">${publicPortfolio()}</div></div><p class="preview-explanation">A prévia mostra apenas as informações que você escolheu compartilhar.</p></div>
  </section>`;
}
function publicPortfolio() {
  const a = appearance(), p = state.profile, v = state.visibility;
  const completed = experiences.filter(x=>delivery(x.id).submitted);
  const initials = p.name.trim().split(/\s+/).map(w=>w[0]).slice(0,2).join('');
  const works = v.experiences && completed.length ? `<section class="pf-section pf-work"><div class="pf-section-heading"><h3>Experiências na prática</h3><span>${String(completed.length).padStart(2,'0')}</span></div><div class="pf-work-grid">${completed.map(x=>`<article class="pf-work-card"><img src="${x.image}" alt="${x.alt}" loading="lazy"><div class="pf-work-copy"><span>${x.brand}<span class="pf-area">${x.area}</span></span><h4>${x.title}</h4><p>${x.short}</p>${delivery(x.id).public && delivery(x.id).response ? `<details><summary>Ler minha solução</summary><div class="pf-answer rich-text">${markdownHtml(delivery(x.id).response)}</div></details>`:''}</div></article>`).join('')}</div></section>` : '';
  return `<article class="public-portfolio pf-${a.layout} pf-font-${a.font} pf-cover-${a.cover}" style="${portfolioTheme()}" aria-label="Portfólio de ${esc(p.name)}">
    <div class="pf-topline"><span>${esc(p.name)}</span><span>Portfólio pessoal</span></div>
    <header class="pf-hero"><div class="pf-hero-copy"><h2>${esc(p.name)}<span class="pf-period">.</span></h2><p class="pf-headline">${esc(p.headline)}</p>${v.city?`<p class="pf-location">${esc(p.city)}</p>`:''}</div><div class="pf-monogram" aria-hidden="true">${esc(initials)}</div></header>
    <div class="pf-content"><section class="pf-section pf-about"><h3>Sobre mim</h3><p>${esc(p.bio)}</p></section>${works}
    ${v.projects && state.project ? `<section class="pf-section pf-project"><p class="pf-kicker">Projeto complementar</p>${projectDetails(state.project)}</section>`:''}
    ${(v.formation||v.institution||v.skills)?`<div class="pf-foundations">${v.formation||v.institution?`<section class="pf-section"><h3>${v.formation?'Formação':'Instituição de ensino'}</h3>${v.formation?`<p>${esc(p.education)}</p>`:''}${v.institution?`<p>${esc(p.institution)}</p>`:''}</section>`:''}${v.skills?`<section class="pf-section"><h3>Competências</h3><ul class="pf-skills">${p.skills.split(',').map(s=>s.trim()).filter(Boolean).map(s=>`<li><span>${esc(s)}</span><span class="pf-skill-level" aria-label="Nível ${Math.max(1,Math.min(5,Number(p.skillLevels?.[s] || 1)))} de 5"><i style="width:${Math.max(1,Math.min(5,Number(p.skillLevels?.[s] || 1)))*20}%"></i></span><small>${Math.max(1,Math.min(5,Number(p.skillLevels?.[s] || 1)))}/5</small></li>`).join('')}</ul></section>`:''}</div>`:''}</div>
    <div class="pf-footer"><span>${esc(p.name)}</span><span>Feito com <b>Hai</b></span></div>
  </article>`;
}
function refreshPortfolioPreview() {
  const live = $('#portfolio-live');
  if (live) live.innerHTML = publicPortfolio();
}
function saveAppearance(key, value) {
  state.appearance = {...appearance(),[key]:value};
  state.appearance = appearance();
  persist();
  document.querySelectorAll('[data-appearance]').forEach(b=>b.setAttribute('aria-pressed',state.appearance[b.dataset.appearance]===b.dataset.value));
  if ($('#portfolio-color')) $('#portfolio-color').value=state.appearance.color;
  if ($('#portfolio-hex')) $('#portfolio-hex').textContent=state.appearance.color.toUpperCase();
  if ($('#design-save-status')) $('#design-save-status').textContent='Aparência salva.';
  refreshPortfolioPreview();
}
document.addEventListener('click',event=>{
  const option=event.target.closest('[data-appearance]');
  if(option) saveAppearance(option.dataset.appearance,option.dataset.value);
  const device=event.target.closest('[data-portfolio-device]');
  if(device){portfolioDevice=device.dataset.portfolioDevice;$('#portfolio-live').className='portfolio-viewport '+portfolioDevice;document.querySelectorAll('[data-portfolio-device]').forEach(b=>b.setAttribute('aria-pressed',b===device));}
  if(event.target.closest('[data-design-reset]')){state.appearance={...defaultAppearance};saveAppearance('layout','editorial');}
});
document.addEventListener('input',event=>{if(event.target.id==='portfolio-color')saveAppearance('color',event.target.value);});
