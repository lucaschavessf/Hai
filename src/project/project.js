const initialProject = {
  title: 'Organização de uma feira estudantil',
  where: 'Projeto escolar',
  role: 'Planejamento e comunicação',
  process: 'Planejei atividades e organizei a comunicação com a equipe para realizar uma feira estudantil.',
  result: ''
};

function projectDetails(project) {
  if (!project) return '';
  return `<div class="project-details"><h3>${esc(project.title)}</h3>${project.where || project.role ? `<div class="project-facts">${project.where ? `<div><span>Onde</span><strong>${esc(project.where)}</strong></div>` : ''}${project.role ? `<div><span>Minha participação</span><strong>${esc(project.role)}</strong></div>` : ''}</div>` : ''}${project.process ? `<div class="project-story"><span>Como fiz</span><p>${esc(project.process)}</p></div>` : ''}${project.result ? `<div class="project-story"><span>Resultado</span><p>${esc(project.result)}</p></div>` : ''}</div>`;
}

function projectManagement() {
  const project = state.project;
  return `<section class="paper project-management"><div class="section-title"><div><p class="eyebrow">PROJETO COMPLEMENTAR</p><h2>Um projeto além das simulações</h2></div><span class="project-count">${project ? '1 de 1' : '0 de 1'}</span></div>${project ? `${projectDetails(project)}<div class="project-actions"><button type="button" class="btn secondary" data-action="edit-project">Editar projeto</button><button type="button" class="text-button" data-action="remove-project">Remover</button></div>` : `<p>Compartilhe uma experiência que ajude a contar sua trajetória. Você pode manter um projeto por perfil.</p><button type="button" class="btn secondary" data-action="edit-project">Adicionar projeto</button>`}<p class="small">As entregas dos desafios da Hai continuam em destaque na prévia pública.</p></section>`;
}

function projectForm() {
  const p = state.project || {title:'',where:'',role:'',process:'',result:''};
  return `<form id="project-form" class="project-form"><p>Descreva um projeto real em que você participou. Você pode manter um projeto por perfil.</p><label for="project-title">Nome do projeto</label><input id="project-title" name="title" required maxlength="100" value="${esc(p.title)}" placeholder="Ex.: organização de uma feira"><label for="project-where">Onde você fez</label><input id="project-where" name="where" required maxlength="120" value="${esc(p.where)}" placeholder="Escola, comunidade, trabalho ou iniciativa própria"><p class="small">Se o projeto estiver visível, este local também aparecerá na prévia.</p><label for="project-role">Sua participação</label><input id="project-role" name="role" required maxlength="120" value="${esc(p.role)}" placeholder="O que ficou sob sua responsabilidade"><label for="project-process">Como você fez</label><textarea id="project-process" name="process" required maxlength="700" rows="5" placeholder="Conte as etapas, ferramentas e decisões que você tomou.">${esc(p.process)}</textarea><label for="project-result">Resultado ou aprendizado (opcional)</label><textarea id="project-result" name="result" maxlength="350" rows="3" placeholder="O que aconteceu e o que você aprendeu?">${esc(p.result)}</textarea><div class="form-actions"><button class="btn primary" type="submit">Salvar projeto</button></div></form>`;
}
