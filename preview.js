function openPortfolioPreview() {
  const v = state.visibility;
  const panel = document.createElement('div');
  panel.className = 'preview-overlay';
  panel.innerHTML = `<div class="preview-dialog" role="dialog" aria-modal="true" aria-labelledby="preview-title">
    <div class="preview-toolbar"><div><span class="eyebrow">VISÃO PÚBLICA</span><strong id="preview-title">Prévia do portfólio</strong></div><button class="preview-close" type="button" aria-label="Fechar prévia">×</button></div>
    <div class="preview-body"><div class="preview-cover"><span>✦</span></div><div class="preview-intro"><div class="profile-avatar">LM</div><span class="eyebrow">CONHEÇA MEU TRABALHO</span><h2>Luiza Martins</h2><p>Jovem em início de carreira, interessada em administração e projetos que unem pessoas e organização.</p>${v.city?'<small>Recife, PE</small>':''}</div>
    ${v.formation?'<section><span class="eyebrow">FORMAÇÃO</span><h3>Aprendendo e construindo meu caminho</h3><p>Estudante em fase de exploração profissional.</p>'+(v.institution?'<p>Instituição de ensino: Escola Modelo</p>':'')+'</section>':''}
    ${v.experiences?'<section><span class="eyebrow">EXPERIÊNCIAS</span><h3>Um dia na equipe de operações</h3><p>Nexa · '+(state.submitted?'Entrega realizada, aguardando avaliação.':'Experiência em andamento.')+'</p></section>':''}
    ${v.projects?'<section><span class="eyebrow">PROJETOS</span><h3>Organização de uma feira estudantil</h3><p>Planejamento, comunicação e colaboração com a equipe.</p></section>':''}
    ${v.skills?'<section><span class="eyebrow">COMPETÊNCIAS</span><div class="chips"><span class="tag">Organização</span><span class="tag">Comunicação</span><span class="tag">Análise</span></div></section>':''}
    <div class="preview-note">Esta é uma prévia local. Nenhum portfólio foi publicado.</div></div></div>`;
  document.body.appendChild(panel);
  panel.querySelector('.preview-close').focus();
  const close = () => { panel.remove(); document.removeEventListener('keydown', keyHandler); };
  const keyHandler = event => { if(event.key==='Escape') close(); };
  panel.addEventListener('click', event => { if(event.target===panel || event.target.closest('.preview-close')) close(); });
  document.addEventListener('keydown', keyHandler);
}
document.addEventListener('click', event => {
  if(event.target.closest('[data-action="preview-portfolio"]')) {
    event.stopPropagation();
    openPortfolioPreview();
  }
}, true);
