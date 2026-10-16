// Small, dependency-free editors and challenge extensions for the prototype.
function markdownHtml(source) {
  const safe = String(source || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const inline = line => line
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|\W)\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
  const lines = safe.replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let list = '';
  let tableRows = [];
  const closeList = () => { if (list) { out.push(`</${list}>`); list = ''; } };
  const closeTable = () => {
    if (!tableRows.length) return;
    const rows = tableRows.map(row => row.slice(1, -1).split('|').map(cell => cell.trim()));
    const separator = rows[1]?.every(cell => /^:?-{3,}:?$/.test(cell));
    if (separator && rows.length > 2) {
      out.push(`<div class="markdown-table-wrap"><table><thead><tr>${rows[0].map(cell=>`<th>${inline(cell)}</th>`).join('')}</tr></thead><tbody>${rows.slice(2).map(row=>`<tr>${row.map(cell=>`<td>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
    } else tableRows.forEach(row => out.push(`<p>${inline(row)}</p>`));
    tableRows = [];
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith('|') && line.endsWith('|')) { closeList(); tableRows.push(line); continue; }
    closeTable();
    if (!line) { closeList(); continue; }
    const bullet = line.match(/^[-*] (.+)$/);
    const numbered = line.match(/^\d+\. (.+)$/);
    const kind = bullet ? 'ul' : numbered ? 'ol' : '';
    if (kind) {
      if (list !== kind) { closeList(); out.push(`<${kind}>`); list = kind; }
      out.push(`<li>${inline((bullet || numbered)[1])}</li>`);
      continue;
    }
    closeList();
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) out.push(`<h${Math.min(heading[1].length + 2, 5)}>${inline(heading[2])}</h${Math.min(heading[1].length + 2, 5)}>`);
    else if (line.startsWith('&gt; ')) out.push(`<blockquote>${inline(line.slice(5))}</blockquote>`);
    else out.push(`<p>${inline(line)}</p>`);
  }
  closeTable();
  closeList();
  return out.join('');
}

function markdownEditor(id, label, value, rows = 6, required = false) {
  return `<div class="markdown-field"><label for="${id}">${label}</label><div class="markdown-shell"><div class="markdown-toolbar" role="toolbar" aria-label="Formatar ${label.toLowerCase()}"><button type="button" data-md="bold" data-for="${id}" aria-label="Negrito"><b>B</b></button><button type="button" data-md="italic" data-for="${id}" aria-label="Itálico"><i>I</i></button><button type="button" data-md="list" data-for="${id}" aria-label="Lista">☷</button><button type="button" data-md="table" data-for="${id}" aria-label="Tabela">▦</button><button type="button" data-md="link" data-for="${id}" aria-label="Link">${uiIcons.link}</button><span class="toolbar-spacer"></span><button type="button" data-md-view="write" data-for="${id}" aria-pressed="true">Escrever</button><button type="button" data-md-view="preview" data-for="${id}" aria-pressed="false">Prévia</button></div><textarea id="${id}" ${id.startsWith('draft-') ? `name="${id.slice(6)}"` : ''} rows="${rows}" ${required ? 'required' : ''}>${esc(value || '')}</textarea><div class="markdown-preview rich-text" data-md-preview="${id}" hidden></div></div><p class="markdown-hint">Use os botões para formatar ou escreva em Markdown.</p></div>`;
}

function formQuestionsEditor(questions = []) {
  return `<section class="form-builder span-two" aria-label="Perguntas do formulário"><div class="section-title"><div><h3>Formulário do desafio</h3><p class="small">Perguntas complementares à resposta livre. Escolha se cada uma é obrigatória.</p></div><button type="button" class="btn secondary" data-action="add-question">Adicionar pergunta</button></div><div class="question-list">${questions.map((q, i) => `<div class="question-editor" data-question="${esc(q.id)}"><div class="section-title"><strong>Pergunta ${i + 1}</strong><button type="button" class="text-button" data-action="remove-question" data-id="${esc(q.id)}">Remover</button></div><div class="question-grid"><label>Enunciado<input data-q-field="label" maxlength="180" required value="${esc(q.label)}" placeholder="O que você quer saber?"></label><label>Tipo<select data-q-field="type">${[['short','Texto curto'],['long','Texto longo'],['select','Escolha única'],['checkbox','Marcação']].map(([v,l])=>`<option value="${v}" ${q.type===v?'selected':''}>${l}</option>`).join('')}</select></label>${q.type === 'select' ? `<label class="question-options">Opções, uma por linha<textarea data-q-field="options" rows="3" placeholder="Opção 1\nOpção 2">${esc((q.options || []).join('\n'))}</textarea></label>` : ''}<label class="question-required"><input type="checkbox" data-q-field="required" ${q.required ? 'checked' : ''}> Obrigatória</label></div></div>`).join('') || '<p class="small">Nenhuma pergunta adicionada. A resposta livre continua disponível.</p>'}</div></section>`;
}

function readFormQuestions(root) {
  return [...root.querySelectorAll('[data-question]')].map(row => ({
    id: row.dataset.question,
    label: row.querySelector('[data-q-field="label"]').value.trim(),
    type: row.querySelector('[data-q-field="type"]').value,
    required: row.querySelector('[data-q-field="required"]').checked,
    options: (row.querySelector('[data-q-field="options"]')?.value || '').split('\n').map(x => x.trim()).filter(Boolean)
  }));
}

function validBriefQuestions(questions) {
  const invalid = questions.find(q => !q.label || q.type === 'select' && q.options.length < 2);
  if (!invalid) return true;
  toast(invalid.type === 'select' && invalid.options.length < 2 ? 'Adicione pelo menos duas opções à pergunta de escolha única.' : 'Escreva o enunciado de cada pergunta.');
  return false;
}

function challengeQuestions(x, values = {}) {
  const questions = x.formQuestions || [];
  if (!questions.length) return '';
  return `<section class="challenge-questions"><h3>Perguntas complementares</h3><p class="small">Responda às perguntas configuradas para esta experiência.</p>${questions.map((q, i) => {
    const id = `answer-${i}`, value = values[q.id];
    const label = `<label for="${id}">${esc(q.label)}${q.required ? ' <span class="required-mark">*</span>' : ''}</label>`;
    const attr = `data-answer="${esc(q.id)}" ${q.required ? 'required' : ''}`;
    if (q.type === 'long') return `<div class="question-answer">${label}<textarea id="${id}" rows="4" ${attr}>${esc(value || '')}</textarea></div>`;
    if (q.type === 'select') return `<div class="question-answer">${label}<select id="${id}" ${attr}><option value="">Selecione uma opção</option>${(q.options || []).map(o=>`<option value="${esc(o)}" ${value===o?'selected':''}>${esc(o)}</option>`).join('')}</select></div>`;
    if (q.type === 'checkbox') return `<div class="question-answer"><label class="check-answer"><input id="${id}" type="checkbox" data-answer="${esc(q.id)}" ${q.required ? 'required' : ''} ${value ? 'checked' : ''}><span>${esc(q.label)}${q.required ? ' *' : ''}</span></label></div>`;
    return `<div class="question-answer">${label}<input id="${id}" type="text" maxlength="500" value="${esc(value || '')}" ${attr}></div>`;
  }).join('')}</section>`;
}

function readChallengeAnswers(root) {
  return Object.fromEntries([...root.querySelectorAll('[data-answer]')].map(input => [input.dataset.answer, input.type === 'checkbox' ? input.checked : input.value]));
}

function colleagueFor(x) {
  const roles = {
    operacoes: 'Assistente administrativo II',
    marketing: 'Assistente de marketing II',
    dados: 'Assistente de dados II',
    atendimento: 'Assistente de atendimento II'
  };
  return { name: 'Roberto', role: roles[x.id] || 'Assistente administrativo II' };
}

function colleagueMessage(message) {
  return `<div class="colleague-message ${message.from === 'you' ? 'mine' : 'theirs'}"><span>${message.from === 'you' ? 'Você' : 'Roberto'}</span><p>${esc(message.text)}</p></div>`;
}

function colleagueReply(question, x) {
  const q = question.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (/materi|anexo|arquivo|fonte|dado/.test(q)) {
    return x.materials.length
      ? `Eu começaria por ${x.materials.map(m => m.name).join(' e ')}. Compare essas informações com o cenário antes de decidir.`
      : 'Neste desafio, o briefing reúne as informações disponíveis. Eu marcaria o que ainda precisa de confirmação antes de propor a solução.';
  }
  if (/prazo|tempo|horario|hora|quando|urgente/.test(q)) {
    const fact = x.facts.find(([title, detail]) => /prazo|hora|tempo|coleta|retorno|aprov|lançamento|lançamento/i.test(title + ' ' + detail));
    return fact ? `Vale olhar este ponto: ${fact[0]}. ${fact[1]}` : 'Eu revisaria os prazos no cenário e nos materiais e colocaria cada decisão em ordem de prioridade.';
  }
  if (/criterio|avali|nota|ponto/.test(q)) {
    return `A equipe vai observar ${x.criteria.map(c => c[0]).join(', ')}. Na resposta, explique como chegou à decisão e cite os dados que usou.`;
  }
  if (/entrega|resposta|formato|escrever|fazer/.test(q)) {
    return `A entrega esperada é: ${x.format} Eu dividiria a resposta pelas tarefas do briefing para não deixar nada de fora.`;
  }
  const firstTask = (x.tasks[0] || 'reler o cenário e identificar a decisão principal').replace(/[.!?\s]+$/, '');
  return `Eu começaria por esta tarefa: ${firstTask}. Depois, conferiria os materiais e anotaria o que ainda precisa ser confirmado.`;
}

function colleaguePanel(x) {
  const colleague = colleagueFor(x);
  const chat = (delivery(x.id).chat || []).filter(m => m && ['you', 'colleague'].includes(m.from) && typeof m.text === 'string');
  return `<div class="colleague-widget"><button type="button" id="colleague-toggle" class="colleague-toggle" aria-controls="colleague-popup" aria-expanded="false"><span class="colleague-avatar" aria-hidden="true">R</span><span>Falar com ${colleague.name}<small>${colleague.role}</small></span><span class="colleague-open-icon">${uiIcons.expand}</span></button><section id="colleague-popup" class="colleague-popup" role="dialog" aria-modal="false" aria-labelledby="colleague-title" hidden><header class="colleague-header"><span class="colleague-avatar" aria-hidden="true">R</span><div><h2 id="colleague-title">${colleague.name}</h2><p>${colleague.role}</p></div><button type="button" class="colleague-close" aria-label="Fechar conversa com ${colleague.name}">×</button></header><div id="colleague-thread" class="colleague-thread" role="log" aria-live="polite" aria-label="Conversa com ${colleague.name}">${colleagueMessage({from:'colleague',text:`Oi! Sou o ${colleague.name}, da equipe da ${x.brand}. Se tiver alguma dúvida sobre o desafio, pode me perguntar.`})}${chat.map(colleagueMessage).join('')}</div><form id="colleague-form" class="colleague-compose"><label class="sr-only" for="colleague-input">Mensagem para ${colleague.name}</label><input id="colleague-input" type="text" required maxlength="500" autocomplete="off" placeholder="Escreva sua dúvida"><button type="submit" aria-label="Enviar mensagem">Enviar</button></form></section></div>`;
}

function challengeTime(x, d) {
  const limit = Number(x.timeLimitMinutes || 0);
  if (!limit) return '';
  const end = Number(d.startedAt || Date.now()) + limit * 60000;
  const remaining = Math.max(0, end - Date.now());
  const display = remaining ? `${Math.ceil(remaining / 60000)} min restantes` : 'Tempo encerrado';
  return `<div class="challenge-timer ${remaining ? '' : 'expired'}" role="timer" aria-live="off" data-deadline="${end}"><span>Tempo limite: ${limit} min</span><strong id="timer-value">${display}</strong></div>`;
}

function challengeStartScreen(x, custom) {
  return `<a class="back" href="#${custom ? 'criar' : `experiencia/${x.id}`}">← ${custom ? 'Voltar ao briefing' : 'Sobre a experiência'}</a>${custom ? '<p class="preview-notice">Prévia do rascunho da empresa. Esta experiência ainda não foi publicada.</p>' : ''}${head(esc(x.brand) + ' / ' + esc(x.area), esc(x.title), 'Antes de começar, confira como funciona o prazo.') }<section class="paper challenge-start-card"><div class="challenge-start-times"><div><span>Duração estimada</span><strong>${x.time} min</strong></div><div><span>Prazo para enviar</span><strong>${x.timeLimitMinutes} min</strong></div></div><p>O prazo começa quando você inicia e continua correndo se sair ou recarregar esta aba. Seu rascunho de texto é salvo nesta sessão.</p><button type="button" class="btn primary" data-action="start-challenge">Iniciar agora — começar prazo de ${x.timeLimitMinutes} min</button></section>`;
}

function updateChallengeTimer() {
  const timer = document.querySelector('.challenge-timer');
  if (!timer) return;
  const ms = Number(timer.dataset.deadline) - Date.now();
  timer.classList.toggle('expired', ms <= 0);
  timer.querySelector('strong').textContent = ms > 0 ? `${Math.ceil(ms / 60000)} min restantes` : 'Tempo encerrado';
  const submit = document.querySelector('#delivery-form button[type="submit"]');
  if (submit) submit.disabled = ms <= 0;
  if (ms <= 0 && !timer.dataset.announced) {
    timer.dataset.announced = 'true';
    const announcement = document.createElement('span');
    announcement.className = 'sr-only';
    announcement.setAttribute('role', 'status');
    announcement.textContent = 'O prazo terminou. Seu rascunho continua salvo.';
    timer.append(announcement);
  }
}

function customExperience() {
  const d = state.draft;
  if (!d) return null;
  const lines = text => String(text || '').split('\n').map(s => s.replace(/^\s*(?:[-*]|\d+[.)])\s*/, '').trim()).filter(Boolean);
  const criteria = lines(d.rubric).slice(0, 3).map(s => {
    const split = s.indexOf(':');
    return split > 0 ? [s.slice(0, split), s.slice(split + 1).trim()] : [s, 'Observe se a decisão está bem justificada.'];
  });
  return {
    id:'criado', brand:d.company || 'Empresa', area:d.sector || 'Experiência', role:d.role || 'Participante',
    time:Number(d.time) || 45, timeLimitMinutes:Number(d.timeLimitMinutes) || 0,
    title:d.title || 'Experiência em revisão', short:'Prévia do briefing criado pela empresa.',
    image:'assets/hero.jpg', alt:'Equipe colaborando em um projeto',
    about:d.eligibility || '', scenario:d.scenario || '',
    facts:[[ 'Contexto', d.eligibility || 'Consulte o briefing antes de decidir.' ]],
    tasks:lines(d.tasks), constraints:d.constraints || '', format:d.format || 'Descreva sua solução.',
    criteria:criteria.length ? criteria : [['Decisão', 'Explique a solução proposta.']],
    materials:[], formQuestions:d.formQuestions || []
  };
}

function challengeScreen() {
  const x = exp(), d = delivery(x.id), custom = x.id === 'criado';
  if (x.timeLimitMinutes && !d.startedAt) return challengeStartScreen(x,custom);
  const rubricNote = custom ? 'Este briefing de teste não recebe análise automática.' : 'A nota é estimada por sinais presentes no texto e não julga se a decisão está correta.';
  const steps = `<nav class="workspace-steps" aria-label="Etapas do desafio"><button type="button" data-action="challenge-step" data-step="context" data-challenge-step="context" ${state.challengeStep==='context'?'aria-current="step"':''}><span>01</span><b>Contexto e materiais</b></button><button type="button" data-action="challenge-step" data-step="solution" data-challenge-step="solution" ${state.challengeStep==='solution'?'aria-current="step"':''}><span>02</span><b>Sua solução</b></button><button type="button" data-action="challenge-step" data-step="delivery" data-challenge-step="delivery" ${state.challengeStep==='delivery'?'aria-current="step"':''}><span>03</span><b>${d.submitted ? 'Entrega enviada' : 'Entrega'}</b></button></nav>`;
  const success = d.submitted ? `<div class="success-banner" role="status"><div><strong>Entrega registrada.</strong><p>${d.estimatedFeedback?.unscored ? 'Não há análise estimada para este formato.' : 'Sua análise estimada está disponível abaixo.'}</p></div>${custom ? link('Voltar ao briefing', 'criar', 'secondary') : link('Ver portfólio', 'portfolio', 'secondary')}</div>` : '';
  return `<a class="back" href="#${custom ? 'criar' : `experiencia/${x.id}`}">← ${custom ? 'Voltar ao briefing' : 'Sobre a experiência'}</a>${custom ? '<p class="preview-notice">Prévia do rascunho da empresa. Esta experiência ainda não foi publicada.</p>' : ''}${head(esc(x.brand) + ' / ' + esc(x.area), esc(x.title), 'Você está no papel de ' + esc(x.role.toLowerCase()) + '.')}${challengeTime(x,d)}<div class="colleague-anchor">${colleaguePanel(x)}</div>${steps}${success}${feedbackPanel(x,d)}<div class="two-column challenge-layout"><div><section id="challenge-context" data-step-section="context" class="paper"><p class="eyebrow">SUA DEMANDA DE TRABALHO</p><h2>O cenário</h2><div class="rich-text">${markdownHtml(x.scenario)}</div><div class="facts">${x.facts.map((f,i)=>`<div><b>0${i+1}</b><section><h3>${esc(f[0])}</h3><p>${esc(f[1])}</p></section></div>`).join('')}</div><div class="note"><strong>Limites da sua decisão</strong><div class="rich-text">${markdownHtml(x.constraints)}</div></div></section><section class="paper"><h2>O que precisamos de você</h2><ol class="tasks">${x.tasks.map(t=>`<li>${esc(t)}</li>`).join('')}</ol></section><form id="delivery-form" class="paper"><section id="challenge-solution" data-step-section="solution" class="solution-heading"><div class="section-title"><h2>Sua solução</h2><span id="save-status" class="small">${d.response ? 'Rascunho salvo' : ''}</span></div><p>${esc(x.format)} Escreva sua solução nesta etapa. Você poderá anexar um documento na conferência.</p></section><div class="field-foot"><span>Texto com pelo menos 80 caracteres, ou um arquivo.</span><span id="char-count">${(d.response || '').length} caracteres</span></div>${markdownEditor('response','Resposta',d.response,10)}<p class="small draft-scope">Rascunho salvo nesta sessão do navegador. Arquivos precisam ser anexados novamente após recarregar.</p>${challengeQuestions(x,d.answers)}<label class="upload-label" for="attachment">Anexar sua entrega <span>PDF, imagem, TXT, CSV ou XLSX. Até 10 MB</span></label><input type="file" id="attachment" accept=".pdf,.png,.jpg,.jpeg,.txt,.csv,.xlsx"><div id="file-status">${fileStatus(x.id)}</div><p id="delivery-error" class="form-error" role="alert"></p><div class="form-actions" id="challenge-delivery" data-step-section="delivery"><button type="button" class="btn secondary" data-action="save-response">Salvar rascunho</button><button type="submit" class="btn primary">${d.submitted ? 'Atualizar entrega' : 'Enviar entrega'}</button></div></form></div><aside><section class="paper challenge-resources"><h2>Na sua mesa</h2>${x.materials.length ? materials(x) : '<p class="small">Use o contexto do briefing como referência.</p>'}<p class="small">Use os anexos como fonte para suas decisões.</p></section><section class="paper mint challenge-criteria"><h2>Critérios de avaliação</h2>${criteria(x)}<p class="small">${rubricNote}</p></section></aside></div>`;
}

function createScreen() {
  const d = state.draft || draftFromTemplate(state.template);
  const step = state.briefingStep || 1;
  const steps = ['Template','Contexto','Entrega e critérios','Materiais e perguntas','Revisão'];
  const stepper = `<ol class="briefing-steps" aria-label="Etapas do briefing">${steps.map((label,index)=>`<li ${step===index+1?'aria-current="step"':''}><span>${String(index+1).padStart(2,'0')}</span>${label}</li>`).join('')}</ol>`;
  const templateSection = step === 1 ? `<section class="template-section"><div class="section-title"><h2>Escolha um ponto de partida</h2><span class="small">6 templates por setor</span></div><div class="template-grid">${templates.map((t,i)=>`<button type="button" class="template-card ${state.template===t.id?'selected':''}" data-template="${t.id}" aria-pressed="${state.template===t.id}"><span>${String(i+1).padStart(2,'0')} / ${t.sector}</span><strong>${t.title}</strong><small>${t.role}<span class="meta-duration">${t.time} min</span></small></button>`).join('')}</div></section>` : '';
  let body = '';
  if (step === 1) body = `<p class="briefing-selection-note">Modelo selecionado: <strong>${esc(templates.find(t=>t.id===state.template)?.sector || 'Logística')}</strong>. Você poderá ajustar o conteúdo nas próximas etapas.</p>`;
  if (step === 2) body = `<h2>Contexto da experiência</h2><p>Defina quem participa, o cenário e o tempo esperado para concluir.</p>${briefingFields(d,['title','company','sector','role','volume','eligibility','time','deadline','scenario'])}`;
  if (step === 3) body = `<h2>Entrega e critérios</h2><p>Explique o que a pessoa precisa entregar, os limites e como a resposta será analisada.</p>${briefingFields(d,['tasks','format','constraints','rubric','reference','permissions'])}<div class="time-limit-field"><label for="draft-time-limit">Prazo cronometrado para resolver (minutos, opcional)</label><input id="draft-time-limit" type="number" min="1" max="10080" value="${esc(d.timeLimitMinutes || '')}" placeholder="Sem limite"><p class="small">Quando a pessoa iniciar, o prazo continua correndo se ela sair ou recarregar a aba.</p></div>`;
  if (step === 4) body = `<h2>Materiais e perguntas</h2><p>Os materiais dão contexto. Perguntas complementares são opcionais; a resposta livre continua disponível.</p>${briefingFields(d,['materials'],true)}${formQuestionsEditor(d.formQuestions || [])}<section class="paper quiet"><h3>Materiais do template</h3><div id="template-materials">${templateMaterials(state.template)}</div></section>`;
  if (step === 5) body = `<h2>Revisão final</h2>${briefingReview(d)}<section class="paper quiet"><h3>Antes de salvar</h3><p>O briefing será salvo como rascunho nesta sessão. Teste como participante e revise os materiais, o prazo, as perguntas e os critérios com a equipe.</p></section>`;
  const back = step > 1 ? '<button type="button" class="btn secondary" data-action="briefing-back">Voltar</button>' : '';
  const test = step === 5 && state.draft ? link('Testar como participante','desafio/criado','secondary') : '';
  const forward = step < 5 ? '<button type="button" class="btn primary" id="briefing-next" data-action="briefing-next">Continuar</button>' : `${test}<button type="submit" class="btn primary">Salvar rascunho</button>`;
  return `${head('CRIAÇÃO DE EXPERIÊNCIAS','Traga o trabalho para o desafio.','Parta de uma situação do seu setor e ajuste o contexto para a sua empresa.')}<div class="section-title briefing-title"><h2>${steps[step-1]}</h2><span class="small" id="draft-status">${state.draft?'Rascunho salvo':''}</span></div>${stepper}${templateSection}<form id="briefing-form" class="briefing-form ${step===1?'briefing-template-step':''}"><section class="paper briefing-step-content">${body}<nav class="form-actions briefing-actions" aria-label="Navegação das etapas">${back}${forward}</nav>${step===5 && state.draft ? '<p class="small">O briefing fica salvo nesta sessão do navegador.</p>' : ''}</section>${step < 5 ? `<aside><section class="paper mint"><h2>Um bom desafio tem contexto.</h2><ol class="tasks"><li>Uma pessoa com uma função e uma decisão concreta.</li><li>Dados suficientes, prazos e limites da atuação.</li><li>Uma entrega compatível com quem está começando.</li><li>Critérios observáveis e uma referência para quem avalia.</li></ol></section><section class="paper quiet"><h3>Rascunho salvo nesta sessão</h3><p>As alterações são guardadas nesta aba enquanto você avança pelas etapas.</p></section></aside>` : ''}</form>`;
}

function skillNames() {
  return [...new Set(String(state.profile.skills || '').split(',').map(s=>s.trim()).filter(Boolean))];
}

function skillLevelEditor() {
  return `<section class="paper skill-level-editor"><div class="section-title"><div><h2>Níveis de competência</h2><p class="small">Indique de 1 a 5 o quanto você já praticou cada competência. Edite os nomes no perfil.</p></div></div><div class="skill-level-list">${skillNames().map(name=>`<label><span>${esc(name)}</span><select data-skill-level="${esc(name)}" aria-label="Nível de ${esc(name)}">${[1,2,3,4,5].map(n=>`<option value="${n}" ${Number(state.profile.skillLevels?.[name] || 1)===n?'selected':''}>Nível ${n}</option>`).join('')}</select></label>`).join('')}</div><p class="small">1: começando. 3: praticando com autonomia. 5: experiência consolidada.</p></section>`;
}

document.addEventListener('click', event => {
  const tool = event.target.closest('[data-md]');
  if (tool) {
    const input = document.getElementById(tool.dataset.for);
    if (!input) return;
    const from = input.selectionStart, to = input.selectionEnd;
    const selected = input.value.slice(from, to) || 'texto';
    const replacement = ({bold:`**${selected}**`, italic:`*${selected}*`, list:`- ${selected}`, table:'| Item | Valor |\n| --- | --- |\n| Exemplo | 0 |', link:`[${selected}](https://)`})[tool.dataset.md];
    input.setRangeText(replacement, from, to, 'select');
    input.dispatchEvent(new Event('input', {bubbles:true}));
    input.focus();
  }
  const view = event.target.closest('[data-md-view]');
  if (view) {
    const input = document.getElementById(view.dataset.for);
    const preview = document.querySelector(`[data-md-preview="${view.dataset.for}"]`);
    if (!input || !preview) return;
    const showing = view.dataset.mdView === 'preview';
    preview.innerHTML = markdownHtml(input.value) || '<p>Escreva para visualizar a prévia.</p>';
    preview.hidden = !showing;
    input.hidden = showing;
    document.querySelectorAll(`[data-md-view][data-for="${view.dataset.for}"]`).forEach(button => button.setAttribute('aria-pressed', button === view));
  }
});

document.addEventListener('input', event => {
  if (!event.target.matches('.markdown-shell textarea')) return;
  const preview = document.querySelector(`[data-md-preview="${event.target.id}"]`);
  if (preview && !preview.hidden) preview.innerHTML = markdownHtml(event.target.value);
});

document.addEventListener('invalid', event => {
  const input = event.target;
  if (!input.matches('.markdown-shell textarea') || !input.hidden) return;
  const preview = document.querySelector(`[data-md-preview="${input.id}"]`);
  input.hidden = false;
  if (preview) preview.hidden = true;
  document.querySelectorAll(`[data-md-view][data-for="${input.id}"]`).forEach(button => button.setAttribute('aria-pressed', button.dataset.mdView === 'write'));
}, true);

function closeColleague() {
  const popup = document.getElementById('colleague-popup');
  const toggle = document.getElementById('colleague-toggle');
  if (!popup || popup.hidden) return;
  popup.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.focus();
}

document.addEventListener('click', event => {
  const toggle = event.target.closest('#colleague-toggle');
  if (toggle) {
    const popup = document.getElementById('colleague-popup');
    if (!popup.hidden) { closeColleague(); return; }
    popup.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    const thread = document.getElementById('colleague-thread');
    thread.scrollTop = thread.scrollHeight;
    document.getElementById('colleague-input').focus();
    return;
  }
  if (event.target.closest('.colleague-close')) { closeColleague(); return; }
  const popup = document.getElementById('colleague-popup');
  if (popup && !popup.hidden && !event.target.closest('.colleague-widget')) closeColleague();
});

document.addEventListener('keydown', event => {
  const popup = document.getElementById('colleague-popup');
  if (event.key === 'Escape' && popup && !popup.hidden) closeColleague();
});

document.addEventListener('submit', event => {
  if (event.target.id !== 'colleague-form') return;
  event.preventDefault();
  const input = document.getElementById('colleague-input');
  const question = input.value.trim();
  if (!question) return;
  const x = exp();
  const messages = [
    {from:'you', text:question},
    {from:'colleague', text:colleagueReply(question, x)}
  ];
  state.deliveries[x.id] = {...delivery(x.id), chat:[...(delivery(x.id).chat || []), ...messages].slice(-24)};
  persist();
  const thread = document.getElementById('colleague-thread');
  thread.insertAdjacentHTML('beforeend', messages.map(colleagueMessage).join(''));
  thread.scrollTop = thread.scrollHeight;
  input.value = '';
  input.focus();
});

setInterval(updateChallengeTimer, 1000);
