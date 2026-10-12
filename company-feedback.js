// Company pages and criterion-based feedback for this local prototype.
const companyProfiles = {
  Nexa: {
    tagline: 'Operações que conectam pessoas e negócios.',
    culture: 'Trabalhamos com organização, colaboração entre áreas e comunicação clara com clientes. Cada decisão precisa considerar o que já foi confirmado e quem deve ser envolvido.',
    work: 'Distribuímos materiais de escritório para pequenas empresas. A equipe acompanha pedidos do estoque até a entrega, resolvendo imprevistos com responsabilidade.',
    values: 'Colaboração, clareza, responsabilidade'
  },
  Lumina: {
    tagline: 'Ideias locais com atenção ao que importa.',
    culture: 'Uma equipe próxima da comunidade, que testa ideias, usa dados para decidir e comunica produtos com transparência.',
    work: 'A papelaria prepara campanhas e experiências para pessoas que estudam e trabalham no centro do Recife.',
    values: 'Criatividade, escuta, clareza'
  },
  'Vértice': {
    tagline: 'Tecnologia útil começa com boas perguntas.',
    culture: 'Investigamos problemas com cuidado, documentamos decisões e colaboramos para tornar o atendimento mais simples.',
    work: 'A equipe de tecnologia analisa chamados e organiza informações para melhorar o suporte.',
    values: 'Curiosidade, precisão, colaboração'
  },
  Ponto: {
    tagline: 'Atendimento que resolve com respeito.',
    culture: 'Escutamos cada situação, respeitamos as regras da operação e combinamos próximos passos possíveis com o cliente.',
    work: 'A equipe acompanha pedidos e encontra soluções para imprevistos de entrega.',
    values: 'Empatia, responsabilidade, comunicação'
  }
};

function companyProfile(name) {
  return name === 'Nexa' ? { ...companyProfiles.Nexa, ...state.companyProfile } : companyProfiles[name];
}

function companyProfileScreen() {
  const name = state.companyName;
  const profile = companyProfile(name);
  const list = experiences.filter(x => x.brand === name);
  const image = list[0]?.image || 'assets/hero.jpg';
  return `<a class="back" href="#${rh() ? 'empresa' : 'explorar'}">← ${rh() ? 'Visão geral' : 'Explorar experiências'}</a>
    <section class="company-profile-hero"><div><p class="eyebrow">PERFIL DA EMPRESA</p><h1>${esc(name)}</h1><p class="lead">${esc(profile.tagline)}</p><div class="company-profile-actions">${name === 'Nexa' && rh() ? '<button type="button" class="btn light" data-action="edit-company-profile">Editar perfil</button>' : `<a class="btn light" href="#desafio/${list[0].id}">Começar desafio</a>`}</div></div><img src="${image}" alt=""></section>
    <div class="company-profile-grid"><section class="paper"><p class="eyebrow">NOSSO TRABALHO</p><h2>O que fazemos</h2><p>${esc(profile.work)}</p></section><section class="paper mint"><p class="eyebrow">NOSSA EQUIPE</p><h2>Como trabalhamos</h2><p>${esc(profile.culture)}</p><div class="company-values">${profile.values.split(',').map(v => `<span>${esc(v.trim())}</span>`).join('')}</div></section></div>
    <section class="section company-open-challenges"><div class="section-title"><div><p class="eyebrow">EXPERIÊNCIAS DISPONÍVEIS</p><h2>Desafios abertos</h2></div><span class="small">${list.length} ${list.length === 1 ? 'desafio' : 'desafios'}</span></div><div class="card-grid">${list.map(card).join('')}</div></section>`;
}

function companyProfileForm() {
  const p = companyProfile('Nexa');
  const fields = [['tagline', 'Frase de apresentação', 140], ['work', 'O que a empresa faz', 700], ['culture', 'Como a equipe trabalha', 700], ['values', 'Valores (separados por vírgula)', 180]];
  return `<form id="company-profile-form" class="company-profile-form">${fields.map(([key, label, max]) => `<label for="company-${key}">${label}</label>${max > 200 ? `<textarea id="company-${key}" name="${key}" maxlength="${max}" rows="4" required>${esc(p[key])}</textarea>` : `<input id="company-${key}" name="${key}" maxlength="${max}" value="${esc(p[key])}" required>`}`).join('')}<p class="small">O perfil aparece na área pública da Nexa nesta sessão do navegador.</p><div class="form-actions"><button type="submit" class="btn primary">Salvar perfil da empresa</button></div></form>`;
}

// Each signal is a concrete piece of evidence in the sample brief. A missing
// signal prompts review; matching a word never certifies that a decision is sound.
const feedbackSignals = {
  operacoes: [
    [['14h40', /14h40|14:40/i], ['coleta às 15h30', /15h30|15:30/i], ['demandas secundárias', /relat[oó]rio|devolu[çc][aã]o/i]],
    [['90 liberados e 30 em conferência', /90[\s\S]{0,80}30|30[\s\S]{0,80}90/i], ['autorização de frete', /frete[\s\S]{0,70}aprova|aprova[\s\S]{0,70}frete|supervisora/i], ['aceite de entrega parcial', /parcial[\s\S]{0,80}(cl[ií]nica|aceit)|cl[ií]nica[\s\S]{0,80}parcial/i]],
    [['situação confirmada', /90|estoque|confer[eê]ncia/i], ['próxima atualização', /atualiz|retorno|avis|inform/i], ['horário para retorno', /14h|15h|14:|15:/i]]
  ],
  marketing: [
    [['limite de R$ 3.000', /3[.\s]?000/i], ['reserva de R$ 300', /(?:reserva|ajuste)[\s\S]{0,35}300|300[\s\S]{0,35}(?:reserva|ajuste)/i], ['custos dos canais', /custo|verba|or[çc]amento/i]],
    [['público local', /faculdade|local|estudante/i], ['comparação de canais', /instagram|criador|panflet/i], ['dados anteriores', /anterior|visita|resultado/i]],
    [['aprovação', /aprova/i], ['produção e lançamento', /produ[çc]|lan[çc]amento/i], ['medição das visitas', /medir|registr|origem|caixa/i]]
  ],
  dados: [
    [['dados dos chamados', /chamado|base|registro/i], ['prioridade', /priori|urg[eê]n|impacto/i], ['evidência numérica', /\d+/]],
    [['tratamento dos dados', /duplic|limp|inconsist|categor/i], ['critério de decisão', /crit[eé]rio|regra|motivo/i], ['limite da análise', /confirm|valid|verific/i]],
    [['síntese', /resumo|s[ií]ntese|resultado/i], ['ação recomendada', /recomendo|sugiro|proponho|a[çc][aã]o/i], ['comunicação à equipe', /equipe|suporte|gestor/i]]
  ],
  atendimento: [
    [['escuta da cliente', /cliente|pessoa|situa[çc][aã]o/i], ['problema da entrega', /entrega|pedido|produto/i], ['próximo passo', /retorno|pr[oó]ximo|acompanho/i]],
    [['opções previstas', /troca|coleta|reembolso/i], ['prazo conforme política', /prazo|dia|hora/i], ['sem promessa indevida', /confirm|pol[ií]tica|depend/i]],
    [['tom respeitoso', /sinto|entendo|compreendo|obrigad/i], ['orientação clara', /precisa|vamos|podemos|envie/i], ['horário ou responsável', /hora|at[eé]|equipe|respons[aá]vel/i]]
  ]
};

function estimateFeedback(x, d) {
  const answer = String(d.response || '').trim();
  if (!answer) return { unscored: true, reason: d.file ? 'A entrega foi feita em arquivo. Esta análise local não lê anexos; a equipe poderá avaliar o conteúdo.' : 'Escreva uma resposta para receber uma análise estimada.' };
  const signals = feedbackSignals[x.id];
  if (!signals) return { unscored: true, reason: 'Este briefing ainda não tem regras de análise configuradas. Use os critérios apresentados para revisar sua resposta.' };
  const rows = x.criteria.map((criterion, index) => {
    const checks = signals[index] || [];
    const found = checks.filter(([, pattern]) => pattern.test(answer)).map(([label]) => label);
    const missing = checks.filter(([, pattern]) => !pattern.test(answer)).map(([label]) => label);
    const lengthCredit = answer.length >= 160 ? 1 : 0;
    // Full marks require a person to judge whether the reasoning is actually sound.
    const score = found.length ? Math.min(4, 1 + found.length + lengthCredit) : 0;
    return { name: criterion[0], score, found, missing };
  });
  return { rows, total: rows.reduce((sum, row) => sum + row.score, 0), max: rows.length * 5, response: answer, evaluatedAt: Date.now() };
}

function feedbackPanel(x, d) {
  const f = d.estimatedFeedback;
  if (!d.submitted) return '';
  if (!f) return `<section class="paper feedback-panel"><p class="eyebrow">REVISÃO DA ENTREGA</p><h2>Analise sua resposta</h2><p>Receba uma estimativa por critério e sugestões para uma nova tentativa.</p><button type="button" class="btn secondary" data-action="refresh-feedback">Analisar resposta</button></section>`;
  if (f.unscored) return `<section class="paper feedback-panel"><p class="eyebrow">ANÁLISE AUTOMÁTICA</p><h2>Sem nota estimada</h2><p>${esc(f.reason)}</p></section>`;
  return `<section class="paper feedback-panel" aria-label="Análise automática da entrega"><div class="section-title"><div><p class="eyebrow">ANÁLISE AUTOMÁTICA</p><h2>Feedback da sua entrega</h2></div><div class="feedback-total"><strong>${f.total}/${f.max}</strong><span>pontos estimados</span></div></div><p class="small">Estimativa por sinais presentes na última resposta enviada, não uma avaliação humana. A análise por texto não atribui 5/5, pois uma pessoa precisa julgar a qualidade da decisão.</p>${f.response !== String(d.response || '').trim() ? '<p class="feedback-pending">Você alterou o rascunho. Envie a atualização para recalcular a estimativa.</p>' : ''}<div class="feedback-criteria">${f.rows.map(row => `<article><div><h3>${esc(row.name)}</h3><strong>${row.score}/5</strong></div><p><b>Identificado:</b> ${esc(row.found.length ? row.found.join(', ') : 'nenhum sinal específico deste critério')}.</p><p><b>Revise:</b> ${esc(row.missing.length ? row.missing.join(', ') : 'explique melhor como os dados sustentam sua escolha')}.</p></article>`).join('')}</div><p class="feedback-next">Você pode atualizar a entrega para ver uma nova estimativa. A análise anterior será substituída.</p></section>`;
}
