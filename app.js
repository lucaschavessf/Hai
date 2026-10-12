const $ = (s, root = document) => root.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[c]);
const initial = {
  deliveries: {},
  evaluations: {},
  companyProfile: {},
  appearance: { ...defaultAppearance },
  project: { ...initialProject },
  profile: {
    name: 'Luiza Martins',
    headline: 'Aprendendo, criando e encontrando meu caminho.',
    skills: 'Organização, Comunicação, Análise',
    skillLevels: { 'Organização': 3, 'Comunicação': 4, 'Análise': 2 },
    bio: 'Estudante de administração. Gosto de organizar projetos e encontrar soluções que facilitem o dia a dia das pessoas.',
    city: 'Recife, PE',
    education: 'Administração em formação',
    institution: 'Escola Modelo'
  },
  visibility: {
    formation: true,
    experiences: true,
    projects: true,
    skills: true,
    institution: false,
    city: false
  },
  draft: null
};
let saved = {};
try {
  saved = JSON.parse(sessionStorage.getItem('hai-v2') || '{}');
} catch (e) {}
const state = {
  ...initial,
  ...saved,
  profile: {
    ...initial.profile,
    ...saved.profile
  },
  project: Object.prototype.hasOwnProperty.call(saved, 'project')
    ? saved.project && { title: '', where: '', role: '', process: '', result: '', ...saved.project }
    : saved.profile?.project
      ? { title: saved.profile.project, where: '', role: '', process: saved.profile.projectDescription || '', result: '' }
      : { ...initial.project },
  appearance: { ...defaultAppearance, ...saved.appearance },
  companyProfile: { ...saved.companyProfile },
  visibility: {
    ...initial.visibility,
    ...saved.visibility
  },
  page: 'inicio',
  id: 'operacoes',
  search: '',
  category: 'Todas',
  candidate: 'maria',
  queue: 'Todas',
  template: 'operacoes',
  audience: (sessionStorage.getItem('hai-audience') || saved.audience) === 'empresa' ? 'empresa' : 'jovem'
};
delete state.profile.project;
delete state.profile.projectDescription;
const files = {};
function persist() {
  try {
    sessionStorage.setItem('hai-v2', JSON.stringify({
      deliveries: state.deliveries,
      evaluations: state.evaluations,
      companyProfile: state.companyProfile,
      audience: state.audience,
      profile: state.profile,
      project: state.project,
      appearance: state.appearance,
      visibility: state.visibility,
      draft: state.draft
    }));
  } catch (e) {
    toast('Não foi possível salvar no navegador. Mantenha esta aba aberta.');
  }
}
const exp = () => state.id === 'criado' ? customExperience() || experiences[0] : experiences.find(x => x.id === state.id) || experiences[0];
const delivery = id => state.deliveries[id] || {};
const rh = () => state.audience === 'empresa';
const link = (label, route, style = 'primary') => `<a class="btn ${style}" href="#${route}">${label}</a>`;
const head = (label, title, desc = '', action = '') => `<div class="page-heading"><div><p class="eyebrow">${label}</p><h1>${title}</h1>${desc ? `<p class="lead">${desc}</p>` : ''}</div>${action}</div>`;
const status = id => delivery(id).submitted ? 'Entrega enviada' : delivery(id).started ? 'Em andamento' : 'Começar experiência';
function card(x) {
  return `<article class="experience-card"><a class="card-image" href="#experiencia/${x.id}" tabindex="-1" aria-hidden="true"><img src="${x.image}" alt="" loading="lazy"><span>${x.time} min</span></a><div class="card-copy"><p class="card-meta"><span>${x.brand}</span><span>${x.area}</span></p><h3><a href="#experiencia/${x.id}">${x.title}</a></h3><p>${x.short}</p><a class="card-link" href="#experiencia/${x.id}">${delivery(x.id).started ? status(x.id) : 'Conhecer desafio'} <span aria-hidden="true">↗</span></a></div></article>`;
}
function materials(x) {
  return `<div class="materials">${x.materials.map((m, i) => `<a class="material" href="materiais/${m.file}" download><span class="file-type">${m.type}</span><span><strong>${m.name}</strong><small>Baixar material ${i + 1}</small></span><span aria-hidden="true">↓</span></a>`).join('')}</div>`;
}
function criteria(x) {
  return x.criteria.map((c, i) => `<div class="criterion"><span>0${i + 1}</span><div><strong>${esc(c[0])}</strong><p>${esc(c[1])}</p></div></div>`).join('');
}
function header() {
  const items = rh() ? [['empresa', 'Visão geral'], ['perfil-empresa/Nexa', 'Perfil da empresa'], ['avaliacao', 'Avaliações'], ['criar', 'Criar experiência']] : [['inicio', 'Início'], ['explorar', 'Explorar'], ['portfolio', 'Meu portfólio']];
  $('#header').innerHTML = `<div class="header-inner"><a href="#${rh() ? 'empresa' : 'inicio'}" aria-label="Hai, início" class="brand"><img src="Hai_Logo_Vetorizada.svg" alt="Hai"></a>${state.page === 'acesso' ? '' : `<nav aria-label="Navegação ${rh() ? 'da empresa' : 'do jovem'}">${items.map(([p, l]) => `<a href="#${p}" ${state.page === p.split('/')[0] && (!p.includes('/') || state.companyName === 'Nexa') || p === 'explorar' && ['experiencia', 'desafio'].includes(state.page) ? 'aria-current="page"' : ''}>${l}</a>`).join('')}</nav><div class="account"><a class="environment" href="#acesso">${rh() ? 'Ambiente da empresa' : 'Para empresas'} <span aria-hidden="true">↗</span></a><a class="avatar" href="#${rh() ? 'perfil-empresa/Nexa' : 'portfolio'}" aria-label="${rh() ? 'Nexa, empresa' : esc(state.profile.name)}">${rh() ? 'N' : esc(state.profile.name.split(' ').map(x => x[0]).slice(0, 2).join(''))}</a></div>`}</div>`;
}
const screens = {
  acesso() {
    return `<section class="access"><p class="eyebrow">BEM-VINDO À HAI</p><h1>Seu próximo começo<br>tem lugar aqui.</h1><p class="lead">Escolha por onde você quer entrar.</p><div class="access-grid"><a href="#inicio" class="access-card"><span>Para quem está começando</span><h2>Quero experimentar<br>o mundo do trabalho.</h2><p>Explore áreas, resolva desafios e construa seu portfólio.</p><strong>Entrar como jovem <span aria-hidden="true">↗</span></strong></a><a href="#empresa" class="access-card business"><span>Para profissionais de RH</span><h2>Quero conhecer<br>novos talentos.</h2><p>Crie experiências e conheça o potencial de cada entrega.</p><strong>Entrar como empresa <span aria-hidden="true">↗</span></strong></a></div></section>`;
  },
  inicio() {
    const active = experiences.filter(x => delivery(x.id).started);
    return `<div class="home-intro"></div><section class="hero"><div class="hero-copy"><p class="eyebrow">APRENDA FAZENDO</p><h1>Seu futuro começa<br>com uma<br><em>experiência.</em></h1><p>Entre na rotina de uma profissão. Resolva desafios de trabalho e descubra o que você pode fazer.</p>${link('Encontre seu primeiro desafio <span aria-hidden="true">↗</span>', 'explorar', 'light')}</div><div class="hero-photo"><img src="assets/hero.jpg" alt="Jovens trabalhando juntos em um projeto"></div></section><div class="journey-strip"><div><b>01</b><span>Encontre uma área<br><strong>que desperte sua curiosidade.</strong></span></div><div><b>02</b><span>Resolva uma situação<br><strong>do dia a dia de uma empresa.</strong></span></div><div><b>03</b><span>Leve o que você fez<br><strong>para o seu portfólio.</strong></span></div></div>${active.length ? `<section class="section"><div class="section-title"><h2>Seu caminho até aqui</h2><a href="#portfolio">Ver portfólio ↗</a></div><div class="ongoing-list">${active.map(x => `<a href="#desafio/${x.id}" class="ongoing"><img src="${x.image}" alt=""><div><small>${x.brand}<span class="meta-status">${status(x.id)}</span></small><h3>${x.title}</h3></div><span aria-hidden="true">↗</span></a>`).join('')}</div></section>` : ''}<section class="section"><div class="section-title"><div><p class="eyebrow">POSSIBILIDADES PARA COMEÇAR</p><h2>Qual vai ser sua primeira experiência?</h2></div><a href="#explorar">Explorar todas <span aria-hidden="true">↗</span></a></div><div class="card-grid">${experiences.slice(0, 3).map(card).join('')}</div></section>`;
  },
  explorar() {
    return `${head('EXPERIÊNCIAS', 'Descubra na prática.', 'Escolha uma área e conheça o trabalho por dentro.')}<div class="catalog-tools"><label class="search-label">Buscar experiências<input id="search" type="search" placeholder="Área, empresa ou desafio" value="${esc(state.search)}"></label><div class="filters" aria-label="Filtrar por área">${['Todas', 'Administração', 'Marketing', 'Tecnologia', 'Atendimento'].map(c => `<button data-filter="${c}" aria-pressed="${state.category === c}">${c}</button>`).join('')}</div></div><div id="catalog-results">${catalog()}</div>`;
  },
  experiencia() {
    const x = exp();
    return `<a class="back" href="#explorar">← Explorar experiências</a><section class="detail-hero"><div><p class="eyebrow">${x.brand} / ${x.area}</p><h1>${x.title}</h1><p class="lead">${x.short}</p><div class="detail-meta"><span>${x.time} minutos</span><span>${x.role}</span></div>${link(delivery(x.id).started ? 'Continuar experiência' : 'Começar experiência', `desafio/${x.id}`)}</div><img src="${x.image}" alt="${x.alt}"></section><div class="two-column"><div><section class="paper"><h2>Você faz parte da equipe.</h2><p>${x.about}</p><a class="company-inline-link" href="#perfil-empresa/${encodeURIComponent(x.brand)}">Conhecer a ${esc(x.brand)} <span aria-hidden="true">↗</span></a><p>${x.scenario}</p></section><section class="paper"><h2>O que você vai entregar</h2><ol class="tasks">${x.tasks.map(t => `<li>${t}</li>`).join('')}</ol></section><section class="paper"><h2>Materiais para se preparar</h2><p>Leia o contexto e consulte os dados durante o desafio.</p>${materials(x)}</section></div><aside><section class="paper mint"><h2>O que será observado</h2>${criteria(x)}<p class="small">Após enviar, você recebe uma análise automática estimada. A avaliação humana é separada.</p></section><section class="paper quiet"><h3>O trabalho é seu.</h3><p>Você escolhe quais experiências e entregas aparecem no seu portfólio.</p></section></aside></div>`;
  },
  desafio: challengeScreen,
  portfolio() {
    return `${head('MEU PORTFÓLIO', 'Seu trabalho conta a sua história.', 'Reúna o que você fez e escolha o que compartilhar.', `<button class="btn secondary" data-action="preview">Ver prévia pública</button>`)}${portfolioControls()}${skillLevelEditor()}<div class="portfolio-management-heading"><h2>Conteúdo e visibilidade</h2><p>Edite o perfil e controle o que aparece na pr\u00e9via acima.</p></div><div class="two-column"><div><section class="paper profile"><div class="profile-cover"></div><div class="profile-body"><span class="avatar large">${esc(state.profile.name.split(' ').map(x => x[0]).slice(0, 2).join(''))}</span><button class="text-button edit-profile" data-action="edit-profile">Editar perfil</button><h2>${esc(state.profile.name)}</h2><p>${esc(state.profile.bio)}</p><span class="small"><span class="profile-info">${esc(state.profile.city)}</span><span class="profile-info">${esc(state.profile.education)}</span></span></div></section><section class="paper"><h2>Experiências e entregas</h2>${portfolioEntries(false)}</section>${projectManagement()}</div><aside><section class="paper"><h2>Visibilidade do portfólio</h2><p>Escolha o que aparece na sua prévia pública. Suas entregas ficam ocultas até você autorizar.</p>${Object.entries({
      formation: 'Formação',
      experiences: 'Experiências',
      projects: 'Projeto complementar',
      skills: 'Competências',
      institution: 'Instituição de ensino',
      city: 'Cidade'
    }).map(([k, l]) => `<label class="toggle"><span>${l}</span><input type="checkbox" data-visibility="${k}" ${state.visibility[k] ? 'checked' : ''}></label>`).join('')}</section><section class="paper quiet"><h3>Uma escolha por entrega</h3><p>Permitir que uma experiência apareça não torna sua resposta pública. Autorize cada entrega individualmente.</p></section></aside></div>`;
  },
  empresa() {
    const done = Object.values(state.evaluations).filter(x => x.saved).length;
    return `${head('NEXA / AMBIENTE DA EMPRESA', 'Potencial se conhece na prática.', 'Acompanhe as experiências e dedique atenção a cada entrega.', link('Criar experiência', 'criar'))}<div class="company-summary"><div><strong>184</strong><span>Participantes</span></div><div><strong>137</strong><span>Entregas recebidas</span></div><div><strong>${3 - done}</strong><span>Para avaliar</span></div><div><strong>${134 + done}</strong><span>Avaliações concluídas</span></div></div><div class="company-columns"><section class="paper"><div class="section-title"><h2>Experiência em andamento</h2><span class="status">Publicada</span></div><div class="company-experience"><img src="assets/operacoes.jpg" alt="Centro de distribuição"><div><p class="card-meta">Administração<span class="meta-duration">${experiences[0].time} min</span></p><h3>${experiences[0].title}</h3><p>Programa de entrada para assistente de operações</p></div></div><a class="company-inline-link company-dashboard-link" href="#perfil-empresa/Nexa">Ver perfil público e desafios abertos <span aria-hidden="true">↗</span></a><div class="funnel"><div><span>Iniciaram</span><meter min="0" max="184" value="184">184</meter><strong>184</strong></div><div><span>Entregaram</span><meter min="0" max="184" value="137">137</meter><strong>137</strong></div><div><span>Avaliados</span><meter min="0" max="184" value="${134 + done}">${134 + done}</meter><strong>${134 + done}</strong></div></div><p class="small">74% dos participantes concluíram a experiência.</p></section><section class="paper mint"><h2>Próximas avaliações</h2>${candidates.filter(c => !state.evaluations[c.id]?.saved).map(c => `<a class="candidate-row" href="#avaliacao/${c.id}"><span class="avatar">${c.name.split(' ').map(w => w[0]).join('')}</span><div><strong>${c.name}</strong><small>${c.city}</small></div><span>↗</span></a>`).join('') || '<p>As três entregas da fila foram avaliadas.</p>'}${link('Abrir avaliações', 'avaliacao', 'secondary')}</section></div><section class="paper"><div class="section-title"><h2>Participantes</h2><label class="inline-label">Status<select id="queue-filter">${['Todas', 'Pendentes', 'Avaliadas'].map(x => `<option ${state.queue === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label></div><div id="candidate-list">${candidateTable()}</div></section>${state.draft ? `<section class="paper"><p class="eyebrow">RASCUNHO DE EXPERIÊNCIA</p><div class="section-title"><div><h2>${esc(state.draft.title)}</h2><p>${esc(state.draft.sector)}<span class="meta-duration">${esc(state.draft.role)}</span></p></div>${link('Continuar edição', 'criar', 'secondary')}</div></section>` : ''}`;
  },
  avaliacao() {
    const c = candidates.find(x => x.id === state.candidate) || candidates[0],
      v = state.evaluations[c.id] || {
        scores: [0, 0, 0],
        feedback: ''
      };
    return `<a class="back" href="#empresa">← Visão geral</a>${head('AVALIAÇÃO HUMANA', 'Uma entrega. Um olhar atento.', 'Avalie as decisões com os mesmos critérios apresentados no desafio.')}<div class="candidate-tabs" aria-label="Selecionar participante">${candidates.map(x => `<a href="#avaliacao/${x.id}" ${c.id === x.id ? 'aria-current="page"' : ''}>${x.name}${state.evaluations[x.id]?.saved ? ' (avaliada)' : ''}</a>`).join('')}</div><div class="two-column"><div><section class="paper"><div class="section-title"><div><p class="eyebrow">${experiences[0].title}</p><h2>${c.name}</h2><p>${c.city}</p></div><span class="status">${v.saved ? 'Avaliada' : 'Aguardando avaliação'}</span></div><h3>Resposta da pessoa participante</h3><div class="answer-text rich-text">${markdownHtml(c.answer)}</div></section><section class="paper"><h2>Contexto do desafio</h2><p>${experiences[0].scenario}</p>${materials(experiences[0])}<details><summary>Referência para a avaliação</summary><p>Uma resposta consistente consulta o estoque até 14h40, informa a clínica sem prometer o que não está liberado e leva a autorização de frete à supervisora às 15h. A decisão considera o aceite da clínica e a coleta às 15h30. Outras sequências são válidas se justificadas.</p></details></section><section class="paper quiet company-project"><p class="eyebrow">TRAJETÓRIA COMPLEMENTAR</p><h3>Projeto compartilhado</h3>${projectDetails(c.project)}</section></div><aside><form class="paper" id="evaluation-form"><h2>Sua avaliação</h2><p>0: não apresentado. 1 a 2: parcial. 3: atende. 4 a 5: atende com clareza e justificativa.</p>${experiences[0].criteria.map((r, i) => `<div class="score-row"><label for="score-${i}">${r[0]} <output id="score-value-${i}">${v.scores[i]}/5</output></label><p>${r[1]}</p><input id="score-${i}" data-score="${i}" type="range" min="0" max="5" value="${v.scores[i]}"></div>`).join('')}<div class="score-total">Pontuação <strong id="score-total">${v.scores.reduce((a, b) => a + b, 0)}/15</strong></div>${markdownEditor('feedback',`Devolutiva para ${c.name.split(' ')[0]}`,v.feedback,5,true)}<p class="small">Ao menos 20 caracteres. A nota apoia a leitura da entrega; a decisão permanece com a equipe.</p><button class="btn primary full" type="submit">${v.saved ? 'Atualizar avaliação' : 'Salvar avaliação'}</button></form></aside></div>`;
  },
  criar: createScreen,
  'perfil-empresa': companyProfileScreen
};
Object.assign(screens, institutionalScreens);

function catalog() {
  const needle = state.search.toLocaleLowerCase('pt-BR');
  const list = experiences.filter(x => (state.category === 'Todas' || state.category === x.area) && `${x.title} ${x.brand} ${x.area} ${x.criteria.map(c => c[0]).join(' ')}`.toLocaleLowerCase('pt-BR').includes(needle));
  return `<p class="result-count" role="status">${list.length} ${list.length === 1 ? 'experiência' : 'experiências'} para explorar</p><div class="card-grid catalog-grid">${list.map(card).join('') || '<div class="empty"><h2>Nenhuma experiência por aqui.</h2><p>Tente outra palavra ou remova o filtro de área.</p><button class="btn secondary" data-action="clear-filters">Limpar filtros</button></div>'}</div>`;
}
function fileStatus(id) {
  const d = delivery(id);
  return d.file ? `<div class="file-attached"><span>${esc(d.file.name)}<small>${Math.ceil(d.file.size / 1024)} KB${!files[id] ? ' (selecione novamente para atualizar)' : ''}</small></span><button type="button" data-action="remove-file">Remover</button></div>` : '';
}
function portfolioEntries(publicView) {
  let list = experiences.filter(x => delivery(x.id).started && (!publicView || delivery(x.id).submitted));
  if (!list.length) return '<div class="empty compact"><h3>Seu próximo projeto começa em um desafio.</h3><p>As experiências que você fizer vão aparecer aqui.</p>' + (!publicView ? link('Explorar experiências', 'explorar', 'secondary') : '') + '</div>';
  return list.map(x => {
    const d = delivery(x.id);
    return `<article class="portfolio-entry"><div><small>${x.brand}<span class="meta-duration">${x.area}</span></small><h3>${x.title}</h3><p>${d.submitted ? 'Entrega enviada. Aguardando avaliação' : 'Em andamento'}</p></div>${publicView ? d.public ? `<div class="answer-text">${esc(d.response || 'Entrega em arquivo.')}</div>` : '' : `${link(d.submitted ? 'Ver entrega' : 'Continuar', `desafio/${x.id}`, 'secondary')}${d.submitted ? `<label class="toggle share-delivery"><span>Exibir minha resposta na prévia pública</span><input type="checkbox" data-share="${x.id}" ${d.public ? 'checked' : ''}></label>` : ''}`}</article>`;
  }).join('');
}
function candidateTable() {
  const list = candidates.filter(c => state.queue === 'Todas' || state.queue === 'Avaliadas' === !!state.evaluations[c.id]?.saved);
  return list.length ? `<div class="table-wrap"><table><thead><tr><th>Participante</th><th>Localização</th><th>Experiência</th><th>Status</th><th><span class="sr-only">Ação</span></th></tr></thead><tbody>${list.map(c => `<tr><td><strong>${c.name}</strong></td><td>${c.city}</td><td>Operações na Nexa</td><td>${state.evaluations[c.id]?.saved ? 'Avaliada' : 'Aguardando avaliação'}</td><td><a href="#avaliacao/${c.id}">${state.evaluations[c.id]?.saved ? 'Revisar' : 'Avaliar'} ↗</a></td></tr>`).join('')}</tbody></table></div>` : '<p class="empty compact">Nenhuma entrega neste status.</p>';
}
function draftFromTemplate(id) {
  const t = templates.find(x => x.id === id) || templates[0];
  return {
    ...t,
    company: 'Nexa',
    volume: 20,
    eligibility: 'Pessoas em início de carreira, sem experiência prévia exigida.',
    deadline: '',
    timeLimitMinutes: 0,
    formQuestions: [],
    format: t.format,
    reference: t.reference,
    permissions: 'Entregas acessíveis à equipe avaliadora. Exibição pública somente com autorização do jovem.'
  };
}
const fieldLabels = {
  title: 'Nome da experiência',
  company: 'Empresa',
  sector: 'Setor',
  role: 'Cargo ou função',
  volume: 'Vagas previstas no programa',
  eligibility: 'Público e elegibilidade',
  time: 'Duração estimada (minutos)',
  deadline: 'Prazo para envio (opcional)',
  scenario: 'Cenário de trabalho',
  tasks: 'Entrega esperada',
  format: 'Formato da entrega',
  constraints: 'Limites e restrições',
  materials: 'Materiais necessários',
  rubric: 'Critérios e evidências observáveis',
  reference: 'Referência de boa resposta (opcional)',
  permissions: 'Permissões de visualização'
};
function briefingFields(d) {
  return `<div class="form-grid">${Object.entries(fieldLabels).map(([k, l]) => {
    const long = ['scenario', 'tasks', 'constraints', 'materials', 'rubric', 'reference', 'eligibility', 'permissions'].includes(k);
    return `<div class="${long ? 'span-two' : ''}">${long ? markdownEditor(`draft-${k}`,l,d[k] || '',k === 'scenario' ? 5 : 3,k !== 'reference') : `<label for="draft-${k}">${l}</label><input id="draft-${k}" name="${k}" type="${['volume', 'time'].includes(k) ? 'number' : k === 'deadline' ? 'date' : 'text'}" ${['volume', 'time'].includes(k) ? 'min="1" max="10000"' : ''} value="${esc(d[k] || '')}" ${k !== 'deadline' ? 'required' : ''}>`}</div>`;
  }).join('')}<div class="span-two"><label for="brief-attachment">Anexar material complementar</label><input id="brief-attachment" type="file" accept=".pdf,.csv,.txt,.xlsx,.png,.jpg,.jpeg" multiple><p class="small" id="brief-files">${esc((d.attachments || []).join(', ') || 'Até 10 MB por arquivo. Os anexos do template já estão disponíveis ao lado.')}</p></div></div>`;
}
function templateMaterials(id) {
  const template = templates.find(t => t.id === id) || templates[0];
  return materials({materials: template.resources});
}
function readBrief() {
  const f = $('#briefing-form');
  return {
    ...(state.draft || draftFromTemplate(state.template)),
    ...Object.fromEntries(new FormData(f)),
    id: state.template,
    attachments: $('#brief-attachment').files.length ? Array.from($('#brief-attachment').files).map(f => f.name) : state.draft?.attachments || [],
    timeLimitMinutes: Number($('#draft-time-limit').value) || 0,
    formQuestions: readFormQuestions(f)
  };
}
function toast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => $('#toast').classList.remove('show'), 4000);
}
function render() {
  header();
  $('.footer-home').href = '#' + (rh() ? 'empresa' : 'inicio');
  $('#screen').className = state.page === 'acesso' ? 'access-main' : 'container';
  $('#screen').innerHTML = (screens[state.page] || screens.inicio)();
  $('#screen').dataset.page = state.page;
  $('#screen').dataset.route = location.hash.slice(1) || 'inicio';
  arrangeChallenge();
  updateChallengeTimer();
  document.title = `Hai — ${{
    inicio: 'Seu próximo começo',
    explorar: 'Experiências',
    experiencia: exp().title,
    desafio: exp().title,
    portfolio: 'Meu portfólio',
    empresa: 'Ambiente da empresa',
    'perfil-empresa': state.companyName,
    avaliacao: 'Avaliações',
    criar: 'Criar experiência',
    acesso: 'Escolha seu ambiente',
    sobre: 'Sobre',
    privacidade: 'Privacidade',
    ajuda: 'Ajuda'
  }[state.page]}`;
  window.scrollTo(0, 0);
}
// Put the reference files before the answer form on small screens.
// Moving the existing node preserves both keyboard order and download targets.
function arrangeChallenge() {
  const layout = $('.challenge-layout');
  if (!layout) return;
  const main = layout.firstElementChild;
  const aside = $('aside', layout);
  const resources = $('.challenge-resources', layout) || aside.firstElementChild;
  resources.classList.add('challenge-resources');
  if (window.matchMedia('(max-width:850px)').matches) {
    if (resources.parentElement !== main) main.insertBefore(resources, main.children[1]);
  } else if (resources.parentElement !== aside) {
    aside.prepend(resources);
  }
}
function route() {
  const [page, id] = location.hash.slice(1).split('/');
  state.page = screens[page] ? page : 'inicio';
  if (['empresa', 'avaliacao', 'criar'].includes(state.page)) state.audience = 'empresa';
  if (['inicio', 'explorar', 'experiencia', 'desafio', 'portfolio'].includes(state.page)) state.audience = 'jovem';
  if (state.page === 'perfil-empresa') state.companyName = companyProfiles[decodeURIComponent(id || '')] ? decodeURIComponent(id) : 'Nexa';
  if (['experiencia', 'desafio'].includes(state.page)) {
    state.id = (state.page === 'desafio' && id === 'criado' && state.draft) || experiences.some(x => x.id === id) ? id : 'operacoes';
    if (state.page === 'desafio') {
      state.deliveries[state.id] = {
        ...delivery(state.id),
        started: true,
        startedAt: delivery(state.id).startedAt || (exp().timeLimitMinutes ? Date.now() : null)
      };
      persist();
    }
  }
  if (state.page === 'avaliacao') state.candidate = candidates.some(c => c.id === id) ? id : 'maria';
  if (state.page === 'criar' && state.draft?.id) state.template = state.draft.id;
  try { sessionStorage.setItem('hai-audience', state.audience); } catch (e) {}
  render();
  $('#screen').focus({
    preventScroll: true
  });
}
function modal(title, body) {
  const d = $('#dialog');
  d.classList.remove('portfolio-dialog');
  d.innerHTML = `<div class="dialog-header"><h2 id="dialog-title">${title}</h2><button class="close" aria-label="Fechar" data-action="close-modal">×</button></div><div class="dialog-body">${body}</div>`;
  d.setAttribute('aria-labelledby', 'dialog-title');
  d.showModal();
}
function preview() {
  modal('Pr\u00e9via do portf\u00f3lio p\u00fablico', `<div class="portfolio-viewport">${publicPortfolio()}</div>`);
  $('#dialog').classList.add('portfolio-dialog');
}
function evaluation() {
  return state.evaluations[state.candidate] ||= {
    scores: [0, 0, 0],
    feedback: '',
    saved: false
  };
}
function saveResponse() {
  state.deliveries[state.id] = {
    ...delivery(state.id),
    response: $('#response').value,
    answers: readChallengeAnswers($('#delivery-form'))
  };
  persist();
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-action],[data-filter],[data-template]');
  if (!b) return;
  if (b.dataset.filter) {
    state.category = b.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(x => x.setAttribute('aria-pressed', x === b));
    $('#catalog-results').innerHTML = catalog();
    return;
  }
  if (b.dataset.template) {
    const id = b.dataset.template;
    modal('Usar este template?', `<p>O formulário será preenchido com o cenário de <strong>${esc(templates.find(t => t.id === id).sector)}</strong>. As alterações no formulário atual serão substituídas.</p><div class="form-actions"><button class="btn secondary" data-action="close-modal">Continuar editando</button><button class="btn primary" data-action="apply-template" data-id="${id}">Usar template</button></div>`);
    return;
  }
  switch (b.dataset.action) {
    case 'close-modal':
      $('#dialog').close();
      break;
    case 'apply-template':
      state.template = b.dataset.id;
      state.draft = draftFromTemplate(state.template);
      $('#dialog').close();
      persist();
      render();
      $('#draft-title').focus();
      break;
    case 'clear-filters':
      state.category = 'Todas';
      state.search = '';
      render();
      $('#search').focus();
      break;
    case 'save-response':
      saveResponse();
      $('#save-status').textContent = 'Rascunho salvo';
      toast('Rascunho salvo.');
      break;
    case 'refresh-feedback':
      state.deliveries[state.id].estimatedFeedback = estimateFeedback(exp(), delivery(state.id));
      persist();
      render();
      break;
    case 'edit-company-profile':
      modal('Editar perfil da Nexa', companyProfileForm());
      $('#company-tagline').focus();
      break;
    case 'add-question': {
      const snapshot = readBrief();
      snapshot.formQuestions.push({ id: `q-${Date.now()}`, label: '', type: 'short', required: false, options: [] });
      state.draft = snapshot;
      persist();
      render();
      $('[data-question]:last-child [data-q-field="label"]')?.focus();
      break;
    }
    case 'remove-question': {
      const snapshot = readBrief();
      snapshot.formQuestions = snapshot.formQuestions.filter(q => q.id !== b.dataset.id);
      state.draft = snapshot;
      persist();
      render();
      break;
    }
    case 'remove-file':
      delete files[state.id];
      delete state.deliveries[state.id].file;
      $('#attachment').value = '';
      $('#file-status').innerHTML = '';
      persist();
      break;
    case 'preview':
      preview();
      break;
    case 'edit-project':
      modal(state.project ? 'Editar projeto' : 'Adicionar projeto', projectForm());
      $('#project-title').focus();
      break;
    case 'remove-project':
      modal('Remover projeto?', '<p>O projeto deixará de aparecer no portfólio. Você poderá adicionar outro depois.</p><div class="form-actions"><button type="button" class="btn secondary" data-action="close-modal">Cancelar</button><button type="button" class="btn primary" data-action="confirm-remove-project">Remover projeto</button></div>');
      break;
    case 'confirm-remove-project':
      state.project = null;
      persist();
      $('#dialog').close();
      render();
      toast('Projeto removido.');
      break;
    case 'edit-profile':
      modal('Editar perfil', `<form id="profile-form">${Object.entries({
        name: 'Nome',
        headline: 'Frase de apresenta\u00e7\u00e3o',
        skills: 'Compet\u00eancias (separadas por v\u00edrgula)',
        bio: 'Sobre você',
        city: 'Cidade',
        education: 'Formação',
        institution: 'Instituição de ensino'
      }).map(([k, l]) => `<label for="profile-${k}">${l}</label>${k === 'bio' ? `<textarea id="profile-${k}" name="${k}" required rows="4">${esc(state.profile[k])}</textarea>` : `<input id="profile-${k}" name="${k}" required value="${esc(state.profile[k])}">`}`).join('')}<div class="form-actions"><button class="btn primary" type="submit">Salvar perfil</button></div></form>`);
      break;
    case 'preview-briefing':
      if (!$('#briefing-form').reportValidity()) return;
      const d = readBrief();
      if (!validBriefQuestions(d.formQuestions)) return;
      modal('Revisão da experiência', `<p class="eyebrow">${esc(d.company)} / ${esc(d.sector)}</p><h2>${esc(d.title)}</h2><p>${esc(d.role)}<br>${esc(d.time)} minutos${d.timeLimitMinutes ? `<br>Tempo limite: ${d.timeLimitMinutes} minutos` : ''}</p>${['eligibility', 'scenario', 'tasks', 'format', 'constraints', 'materials', 'rubric', 'reference', 'permissions'].filter(k => d[k]).map(k => `<section><h3>${fieldLabels[k]}</h3><div class="rich-text">${markdownHtml(d[k])}</div></section>`).join('')}${d.formQuestions?.length ? `<section><h3>Formulário do desafio</h3>${challengeQuestions({formQuestions:d.formQuestions})}</section>` : ''}`);
      break;
  }
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'search') {
    state.search = t.value;
    $('#catalog-results').innerHTML = catalog();
  }
  if (t.id === 'response') {
    saveResponse();
    $('#char-count').textContent = t.value.length + ' caracteres';
    $('#save-status').textContent = 'Rascunho salvo';
    $('#delivery-error').textContent = '';
  }
  if (t.dataset.score !== undefined) {
    const v = evaluation();
    v.scores[Number(t.dataset.score)] = Number(t.value);
    $('#score-value-' + t.dataset.score).textContent = t.value + '/5';
    $('#score-total').textContent = v.scores.reduce((a, b) => a + b, 0) + '/15';
    persist();
  }
  if (t.id === 'feedback') {
    evaluation().feedback = t.value;
    persist();
  }
  if (t.dataset.answer) {
    saveResponse();
    $('#save-status').textContent = 'Rascunho salvo';
  }
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.visibility) {
    state.visibility[t.dataset.visibility] = t.checked;
    persist();
    refreshPortfolioPreview();
  }
  if (t.dataset.share) {
    state.deliveries[t.dataset.share].public = t.checked;
    persist();
    refreshPortfolioPreview();
  }
  if (t.dataset.skillLevel) {
    state.profile.skillLevels = { ...state.profile.skillLevels, [t.dataset.skillLevel]: Number(t.value) };
    persist();
    refreshPortfolioPreview();
  }
  if (t.dataset.qField === 'type') {
    state.draft = readBrief();
    persist();
    render();
  }
  if (t.dataset.answer) saveResponse();
  if (t.id === 'queue-filter') {
    state.queue = t.value;
    $('#candidate-list').innerHTML = candidateTable();
  }
  if (t.id === 'attachment') {
    const f = t.files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024 || !/\.(pdf|png|jpe?g|txt|csv|xlsx)$/i.test(f.name)) {
      $('#delivery-error').textContent = 'Escolha um arquivo PDF, imagem, TXT, CSV ou XLSX de até 10 MB.';
      t.value = '';
      return;
    }
    files[state.id] = f;
    state.deliveries[state.id].file = {
      name: f.name,
      size: f.size
    };
    persist();
    $('#file-status').innerHTML = fileStatus(state.id);
    $('#delivery-error').textContent = '';
  }
  if (t.id === 'brief-attachment') {
    if (Array.from(t.files).some(f => f.size > 10 * 1024 * 1024 || !/\.(pdf|png|jpe?g|txt|csv|xlsx)$/i.test(f.name))) {
      t.value = '';
      toast('Use arquivos permitidos com até 10 MB cada.');
      return;
    }
    $('#brief-files').textContent = Array.from(t.files).map(f => f.name).join(', ');
  }
});
document.addEventListener('submit', e => {
  if (!['delivery-form', 'evaluation-form', 'profile-form', 'company-profile-form', 'project-form', 'briefing-form'].includes(e.target.id)) return;
  e.preventDefault();
  if (e.target.id === 'delivery-form') {
    saveResponse();
    const d = delivery(state.id);
    if (exp().timeLimitMinutes && Date.now() >= d.startedAt + exp().timeLimitMinutes * 60000) {
      $('#delivery-error').textContent = 'O tempo deste desafio terminou. Seu rascunho continua salvo.';
      updateChallengeTimer();
      return;
    }
    if (!e.target.reportValidity()) return;
    if ((d.response || '').trim().length < 80 && !files[state.id]) {
      $('#delivery-error').textContent = 'Escreva pelo menos 80 caracteres ou anexe um arquivo com sua solução.';
      $('#response').focus();
      return;
    }
    d.submitted = true;
    d.estimatedFeedback = estimateFeedback(exp(), d);
    persist();
    render();
    toast('Entrega enviada para avaliação.');
  }
  if (e.target.id === 'evaluation-form') {
    evaluation().feedback = $('#feedback').value.trim();
    if (evaluation().feedback.length < 20) {
      $('#feedback').focus();
      toast('Escreva uma devolutiva com pelo menos 20 caracteres.');
      return;
    }
    evaluation().saved = true;
    persist();
    render();
    toast('Avaliação salva.');
  }
  if (e.target.id === 'profile-form') {
    const p = Object.fromEntries(new FormData(e.target));
    if (Object.values(p).some(v => !v.trim())) {
      toast('Preencha os campos do perfil.');
      return;
    }
    state.profile = { ...state.profile, ...p };
    persist();
    $('#dialog').close();
    render();
    toast('Perfil atualizado.');
  }
  if (e.target.id === 'company-profile-form') {
    const values = Object.fromEntries([...new FormData(e.target)].map(([key, value]) => [key, value.trim()]));
    if (Object.values(values).some(value => !value) || !values.values.split(',').some(value => value.trim())) {
      toast('Preencha os campos do perfil da empresa.');
      return;
    }
    state.companyProfile = values;
    persist();
    $('#dialog').close();
    render();
    toast('Perfil da empresa atualizado.');
  }
  if (e.target.id === 'project-form') {
    const project = Object.fromEntries([...new FormData(e.target)].map(([key, value]) => [key, value.trim()]));
    if (['title', 'where', 'role', 'process'].some(key => !project[key])) {
      toast('Preencha os dados principais do projeto.');
      return;
    }
    state.project = project;
    persist();
    $('#dialog').close();
    render();
    toast('Projeto salvo.');
  }
  if (e.target.id === 'briefing-form') {
    const draft = readBrief();
    if (!validBriefQuestions(draft.formQuestions)) return;
    state.draft = draft;
    persist();
    $('#draft-status').textContent = 'Rascunho salvo';
    toast('Briefing salvo. Você pode continuar a revisão no painel.');
  }
});
window.addEventListener('hashchange', route);
window.matchMedia('(max-width:850px)').addEventListener('change', arrangeChallenge);
route();
