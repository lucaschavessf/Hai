// Integration checks run against the same file:// entry point used by the user.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const vm = require('node:vm');

(async () => {
  fs.mkdirSync('tmp/qa', { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', e => { errors.push(e.message); console.error('Runtime:', e.message); });
    const base = pathToFileURL(path.resolve('index.html')).href;
    const go = async route => {
      await page.goto(`${base}#${route}`);
      await page.waitForFunction(expected => document.querySelector('#screen').dataset.route === expected, route);
      await page.locator('#screen h1').waitFor();
    };
    const challengeStep = async step => {
      await page.locator(`.workspace-steps [data-challenge-step="${step}"]`).click();
      await page.locator(`[data-step-panel="${step}"]`).waitFor({state:'visible'});
    };
    await go('inicio');
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();
    assert.equal(await page.locator('.hero h1').innerText(),'Conheça profissões\nresolvendo desafios.');
    assert.equal(await page.locator('.hero .btn').getAttribute('href'),'#explorar');
    assert.equal(await page.locator('.hero-note').count(),1);

    // All routes at phone, tablet and desktop widths, including narrow phones.
    const routes = ['inicio','acesso','explorar','portfolio','perfil-empresa/Nexa','perfil-empresa/Lumina','perfil-empresa/V%C3%A9rtice','perfil-empresa/Ponto','sobre','privacidade','ajuda','empresa','avaliacao/maria','avaliacao/joao','avaliacao/ana','criar',
      ...['operacoes','marketing','dados','atendimento'].flatMap(id => [`experiencia/${id}`,`desafio/${id}`])];
    let layoutChecks = 0;
    for (const width of [320,390,768,1024,1440]) {
      await page.setViewportSize({width,height:900});
      for (const route of routes) {
        process.stdout.write(`Checking ${width} ${route}\n`);
        await go(route);
        const result = await page.evaluate(async () => {
          document.querySelectorAll('img').forEach(img => img.loading = 'eager');
          await Promise.race([
            Promise.all([...document.images].map(img => img.decode().catch(() => {}))),
            new Promise(resolve=>setTimeout(resolve,3000))
          ]);
          return {
            width: innerWidth,
            content: document.documentElement.scrollWidth,
            broken: [...document.images].filter(i => !i.naturalWidth).map(i => i.src),
            h1: document.querySelectorAll('h1').length,
            text: document.body.innerText,
            unlabeled: [...document.querySelectorAll('input,textarea,select')].filter(e => !e.labels?.length && !e.getAttribute('aria-label')).map(e => e.id)
          };
        });
        assert(result.content <= result.width + 1, `Overflow ${route} at ${width}: ${result.content}`);
        assert.equal(result.broken.length, 0, `Broken image ${route}`);
        assert.equal(result.h1, 1, `Heading ${route}`);
        assert.deepEqual(result.unlabeled, [], `Unlabeled inputs ${route}`);
        assert(!result.text.includes('↗') && !result.text.includes('${uiIcons'), `Unresolved navigation icon in ${route}`);
        assert(!/protótipo|demonstração|✦|👋/i.test(result.text), `Unexpected UI copy ${route}`);
        assert(!result.text.includes('·'), `Middle-dot separator in ${route}`);
        assert(!/O próximo passo é seu|No seu ritmo|Da curiosidade à prática/.test(result.text), `Decorative microcopy in ${route}`);
        const isCompany = /^(empresa|avaliacao|criar)/.test(route);
        const nav = await page.locator('header nav').count() ? await page.locator('header nav').innerText() : '';
        if(isCompany) assert(!nav.includes('Meu portfólio'), 'Mixed employer navigation');
        else assert(!nav.includes('Avaliações'), 'Mixed youth navigation');
        layoutChecks++;
        if ([390,768,1440].includes(width) && ['explorar','empresa','criar','avaliacao/maria','desafio/dados','portfolio'].includes(route)) {
          await page.screenshot({path:`tmp/qa/${route.replace('/','-')}-${width}.png`,fullPage:true});
        }
      }
    }
    console.log(`${layoutChecks} route/viewport checks: no overflow, broken images, unlabeled fields or mixed navigation.`);

    // Mobile navigation leads through the challenge context and keeps key actions visible.
    await page.setViewportSize({width:390,height:900});
    await go('perfil-empresa/Nexa');
    assert.equal(await page.locator('.company-profile-actions a').getAttribute('href'),'#experiencia/operacoes');
    await go('experiencia/marketing');
    assert.match(await page.locator('.detail-hero .btn').innerText(),/Conferir prazo de 90 min/);
    await go('empresa');
    const evaluationQueue = await page.evaluate(() => {
      const queue = document.querySelector('.company-columns>.paper.mint').getBoundingClientRect();
      const summary = document.querySelector('.company-columns>.paper:not(.mint)').getBoundingClientRect();
      return {queue:queue.top,summary:summary.top};
    });
    assert(evaluationQueue.queue < evaluationQueue.summary,'Mobile evaluation queue should precede the experience summary');
    await go('criar');
    const briefingLayout = await page.evaluate(() => {
      const action = document.querySelector('.briefing-actions');
      const body = document.querySelector('.briefing-selection-note');
      return {action:action.getBoundingClientRect().top,body:body.getBoundingClientRect().bottom};
    });
    assert(briefingLayout.action > briefingLayout.body,'First briefing action should follow its guidance');
    await go('avaliacao/maria');
    await page.getByRole('button',{name:'Ir para avaliação'}).click();
    assert.equal(await page.evaluate(() => document.activeElement?.id),'evaluation-form');

    await page.setViewportSize({width:1440,height:1000});
    await go('explorar');
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();
    assert.equal(await page.locator('.experience-card').count(),4);
    const marketingCard = page.locator('.experience-card').filter({has:page.locator('h3 a[href="#experiencia/marketing"]')});
    assert.match(await marketingCard.locator('.card-image').innerText(),/60 min estimados/);
    assert.match(await marketingCard.locator('.card-deadline').innerText(),/Prazo para enviar: 90 min/);
    assert.equal(await page.locator('.experience-card:not(:has(h3 a[href="#experiencia/marketing"])) .card-deadline').count(),0);
    await page.getByRole('button',{name:'Marketing',exact:true}).click();
    assert.equal(await page.locator('.experience-card').count(),1);
    await page.locator('#search').fill('inexistente');
    assert.equal(await page.locator('.experience-card').count(),0);
    await page.getByRole('button',{name:'Limpar filtros'}).click();
    await page.locator('#search').fill('Vértice');
    assert.equal(await page.locator('.experience-card').count(),1);
    await page.getByRole('link',{name:'Ver desafio'}).click();
    assert.match(page.url(),/experiencia\/dados$/);
    await page.getByRole('heading',{name:/atrasando/i}).waitFor();

    // Real material downloads, not placeholder controls.
    const source = {};
    vm.runInNewContext(fs.readFileSync('data.js','utf8')+'; capture(templates)', {capture:v=>source.templates=v});
    let materialChecks = 0;
    for (const t of source.templates) for (const m of t.resources) {
      assert.equal(fs.readFileSync(path.join('materiais',m.file),'utf8'), '\ufeff'+m.content);
      assert(m.content.length>100);
      materialChecks++;
    }
    const [download] = await Promise.all([page.waitForEvent('download'),page.locator('.material').first().click()]);
    assert.equal(download.suggestedFilename(),'vertice-chamados.csv');
    assert.equal(await download.failure(),null);
    console.log(`${materialChecks} downloadable materials match their sources; CSV browser download verified.`);

    // Independent answers, validation, file upload and persistence after reload.
    const answers = {};
    for (const id of ['operacoes','marketing','dados','atendimento']) {
      await go(`desafio/${id}`);
      if (await page.locator('[data-action="start-challenge"]').count()) await page.locator('[data-action="start-challenge"]').click();
      if (id === 'operacoes') {
        assert.equal(await page.locator('[data-step-panel="context"]').isVisible(), true);
        assert.equal(await page.locator('[data-step-panel="solution"]').isVisible(), false);
        assert.equal(await page.locator('[data-step-panel="delivery"]').isVisible(), false);
        await go('inicio');
        assert.equal(await page.locator('.hero .btn').getAttribute('href'),'#desafio/operacoes');
        assert.match(await page.locator('.hero .btn').innerText(),/Continuar desafio/);
        await go('explorar');
        await page.locator('#search').fill('Nexa');
        const activeCard = page.locator('.experience-card').filter({has:page.getByRole('heading',{name:'Uma entrega que não pode esperar'})});
        assert.equal(await activeCard.locator('.card-link').innerText(),'Continuar desafio');
        assert.equal(await activeCard.locator('.card-link').getAttribute('href'),'#desafio/operacoes');
        assert.equal(await activeCard.locator('h3 a').getAttribute('href'),'#desafio/operacoes');
        await activeCard.locator('.card-link').click();
        assert.match(page.url(),/desafio\/operacoes$/);
      }
      await challengeStep('delivery');
      await page.getByRole('button',{name:'Enviar entrega',exact:true}).click();
      assert.match(await page.locator('#delivery-error').innerText(),/80 caracteres/);
      answers[id]=`Minha solução para ${id}: começo conferindo as informações do material, organizo as decisões conforme os prazos e explico os critérios usados para a equipe.`;
      await challengeStep('solution');
      await page.locator('#response').fill(answers[id]);
      await challengeStep('delivery');
      await page.getByRole('button',{name:'Enviar entrega',exact:true}).click();
      await page.locator('.success-banner').waitFor();
    }
    for(const id of Object.keys(answers)) {
      await go(`desafio/${id}`);
      if (await page.locator('[data-action="start-challenge"]').count()) await page.locator('[data-action="start-challenge"]').click();
      assert.equal(await page.locator('#response').inputValue(),answers[id]);
      assert.equal(await page.locator('.success-banner').count(),1);
    }
    await go('inicio');
    assert.equal(await page.locator('.hero .btn').getAttribute('href'),'#explorar');
    assert.match(await page.locator('.hero .btn').innerText(),/Explorar experiências/);
    await go('explorar');
    await page.locator('#search').fill('Nexa');
    const submittedCard = page.locator('.experience-card').filter({has:page.getByRole('heading',{name:'Uma entrega que não pode esperar'})});
    assert.equal(await submittedCard.locator('.card-link').innerText(),'Ver entrega');
    assert.equal(await submittedCard.locator('.card-link').getAttribute('href'),'#desafio/operacoes');
    await go('desafio/atendimento');
    await page.reload();
    assert.equal(await page.locator('#response').inputValue(),answers.atendimento);
    await page.locator('#attachment').setInputFiles({name:'not-allowed.exe',mimeType:'application/octet-stream',buffer:Buffer.from('bad')});
    assert.match(await page.locator('#delivery-error').innerText(),/até 10 MB/);
    await page.locator('#attachment').setInputFiles({name:'grande.txt',mimeType:'text/plain',buffer:Buffer.alloc(10*1024*1024+1)});
    assert.match(await page.locator('#delivery-error').innerText(),/até 10 MB/);
    await page.locator('#attachment').setInputFiles('materiais/ponto-historico.txt');
    assert.match(await page.locator('#file-status').innerText(),/ponto-historico/);
    await challengeStep('solution');
    await page.locator('#response').fill('');
    await challengeStep('delivery');
    await page.getByRole('button',{name:'Atualizar entrega'}).click();
    await page.locator('.success-banner').waitFor();
    await page.locator('[data-action="remove-file"]').click();
    await challengeStep('solution');
    await page.locator('#response').fill(answers.atendimento);
    await challengeStep('delivery');
    await page.getByRole('button',{name:'Atualizar entrega'}).click();
    console.log('All four deliveries: independent state, validation, submission, reload, file type/size and file-only submission verified.');

    // Public preview respects both section-level and per-delivery privacy.
    await go('portfolio');
    assert.equal(await page.locator('.portfolio-entry').count(),4);
    await page.getByRole('button',{name:'Ver prévia pública'}).click();
    assert(!(await page.locator('dialog').textContent()).includes(answers.operacoes));
    assert(!(await page.locator('dialog').innerText()).includes('Recife, PE'));
    await page.keyboard.press('Escape');
    await page.locator('[data-share="operacoes"]').check();
    await page.locator('[data-visibility="city"]').check();
    await page.getByRole('button',{name:'Ver prévia pública'}).click();
    assert((await page.locator('dialog').textContent()).includes(answers.operacoes));
    assert((await page.locator('dialog').innerText()).includes('Recife, PE'));
    // Native dialog traps keyboard focus and Escape closes it.
    for(let i=0;i<8;i++) await page.keyboard.press('Tab');
    assert(await page.evaluate(()=>document.querySelector('dialog').contains(document.activeElement)));
    await page.keyboard.press('Escape');
    await page.locator('[data-visibility="experiences"]').uncheck();
    await page.getByRole('button',{name:'Ver prévia pública'}).click();
    assert(!(await page.locator('dialog').textContent()).includes(answers.operacoes));
    await page.keyboard.press('Escape');
    await page.getByRole('button',{name:'Editar perfil'}).click();
    await page.locator('#profile-name').fill('Luiza Oliveira');
    await page.locator('#profile-bio').fill('<script>alert("xss")</script> Perfil editado.');
    await page.getByRole('button',{name:'Salvar perfil'}).click();
    assert.equal(await page.locator('.profile h2').innerText(),'Luiza Oliveira');
    assert.equal(await page.locator('.profile script').count(),0);
    console.log('Profile editing, escaped content, privacy choices and keyboard dialog behavior verified.');

    // Each candidate has a unique answer and independent human evaluation.
    const responses=[];
    for(const [i,id] of ['maria','joao','ana'].entries()) {
      await go(`avaliacao/${id}`);
      responses.push(await page.locator('.answer-text').innerText());
      await page.locator('#score-0').fill(String(i+2));
      await page.locator('#score-1').fill('4');
      await page.locator('#score-2').fill('5');
      await page.locator('#feedback').fill(`Avaliação de ${id}: sua proposta apresenta uma sequência coerente. Explicite o horário da próxima atualização para o cliente.`);
      await page.getByRole('button',{name:'Salvar avaliação',exact:true}).click();
      assert.equal(await page.locator('.status').innerText(),'Avaliada');
      assert.equal(await page.locator('#score-total').innerText(),`${i+11}/15`);
    }
    assert.equal(new Set(responses).size,3);
    await go('empresa');
    assert.match(await page.locator('.company-summary').innerText(),/0\s+Para avaliar/);
    await page.locator('#queue-filter').selectOption('Pendentes');
    assert.match(await page.locator('#candidate-list').innerText(),/Nenhuma/);
    await page.locator('#queue-filter').selectOption('Avaliadas');
    assert.equal(await page.locator('tbody tr').count(),3);
    console.log('Three separate human evaluations saved; totals and employer queue updated.');

    // Sector-specific templates, review and return to saved employer briefing.
    await go('criar');
    assert.equal(await page.locator('.template-card').count(),6);
    for(const t of source.templates) {
      await page.locator(`[data-template="${t.id}"]`).click();
      assert.equal(await page.locator('#dialog').isVisible(),false,'Pristine template selection should not need confirmation');
      const draft = await page.evaluate(() => JSON.parse(sessionStorage.getItem('hai-v2')).draft);
      assert.equal(draft.title,t.title);
      assert(draft.reference.length>100);
      assert.equal(draft.resources.length,2);
    }
    await page.locator('[data-action="briefing-next"]').click();
    await page.locator('#draft-title').fill('Conciliação de pagamentos — turma de entrada');
    await page.locator('[data-action="briefing-back"]').click();
    await page.locator('[data-template="operacoes"]').click();
    assert.equal(await page.locator('#dialog').isVisible(),true,'Replacing edited briefing should need confirmation');
    await page.getByRole('button',{name:'Continuar editando'}).click();
    await page.locator('[data-action="briefing-next"]').click();
    assert.equal(await page.locator('#draft-title').inputValue(),'Conciliação de pagamentos — turma de entrada');
    for (let i=0;i<3;i++) await page.locator('[data-action="briefing-next"]').click();
    assert.match(await page.locator('.briefing-review').innerText(),/Conciliação de pagamentos/);
    await page.getByRole('button',{name:'Salvar rascunho',exact:true}).click();
    await go('empresa');
    assert.match(await page.locator('#screen').innerText(),/Conciliação de pagamentos/);
    await page.getByRole('link',{name:'Continuar edição'}).click();
    for (let i=0;i<4;i++) await page.locator('[data-action="briefing-back"]').click();
    await page.locator('[data-action="briefing-next"]').click();
    assert.equal(await page.locator('#draft-title').inputValue(),'Conciliação de pagamentos — turma de entrada');
    await page.reload();
    assert.equal(await page.locator('#draft-title').inputValue(),'Conciliação de pagamentos — turma de entrada');
    console.log('All six templates populated, reviewed and saved; briefing survives navigation and reload.');

    // Footer routes preserve the current environment, and the portfolio design is persistent.
    await go('empresa');
    for (const route of ['sobre','privacidade','ajuda']) {
      await page.locator(`footer a[href="#${route}"]`).click();
      await page.waitForFunction(expected => document.querySelector('#screen').dataset.route === expected, route);
      assert((await page.locator('header nav').innerText()).includes('Avaliações'));
      assert.equal(await page.locator('footer a[href="#'+route+'"]').count(),1);
    }
    await page.locator('footer a[href="#portfolio"]').click();
    await page.waitForFunction(() => document.querySelector('#screen').dataset.route === 'portfolio');
    assert((await page.locator('header nav').innerText()).includes('Meu portfólio'));
    await page.locator('footer a[href="#sobre"]').click();
    await page.waitForFunction(() => document.querySelector('#screen').dataset.route === 'sobre');
    assert((await page.locator('header nav').innerText()).includes('Meu portfólio'));
    await go('portfolio');
    await page.locator('.design-controls > summary').click();
    for (const layout of ['editorial','studio','classic']) {
      await page.locator(`[data-appearance="layout"][data-value="${layout}"]`).click();
      assert(await page.locator(`#portfolio-live .pf-${layout}`).count());
      await page.getByRole('button',{name:'Ampliar'}).click();
      assert.equal(await page.locator('dialog .public-portfolio').getAttribute('class'),await page.locator('#portfolio-live .public-portfolio').getAttribute('class'));
      assert.equal(await page.locator('dialog .public-portfolio').innerHTML(),await page.locator('#portfolio-live .public-portfolio').innerHTML());
      await page.keyboard.press('Escape');
    }
    await page.locator('[data-appearance="font"][data-value="serif"]').click();
    await page.locator('[data-appearance="cover"][data-value="lines"]').click();
    await page.locator('[data-appearance="color"][data-value="#ad563e"]').click();
    await page.locator('#portfolio-color').fill('#334455');
    assert.match(await page.locator('#portfolio-live .public-portfolio').getAttribute('style'),/#334455/);
    await page.locator('[data-portfolio-device="mobile"]').click();
    assert.match(await page.locator('#portfolio-live').getAttribute('class'),/mobile/);
    await page.reload();
    await page.locator('.design-controls > summary').click();
    assert(await page.locator('#portfolio-live .pf-classic.pf-font-serif.pf-cover-lines').count());
    assert.match(await page.locator('#portfolio-live .public-portfolio').getAttribute('style'),/#334455/);
    await page.locator('[data-design-reset]').click();
    assert(await page.locator('#portfolio-live .pf-editorial.pf-font-sans.pf-cover-soft').count());
    for (const key of ['formation','projects','skills','city','institution','experiences']) {
      await page.locator(`[data-visibility="${key}"]`).uncheck();
    }
    const privatePreview = await page.locator('#portfolio-live').textContent();
    for (const hidden of ['Administração em formação','Organização de uma feira estudantil','Comunicação','Recife, PE','Escola Modelo',answers.operacoes]) {
      assert(!privatePreview.includes(hidden), `Hidden content leaked in live preview: ${hidden}`);
    }
    await page.getByRole('button',{name:'Ampliar'}).click();
    const privateDialog = await page.locator('dialog .public-portfolio').textContent();
    for (const hidden of ['Administração em formação','Organização de uma feira estudantil','Comunicação','Recife, PE','Escola Modelo',answers.operacoes]) {
      assert(!privateDialog.includes(hidden), `Hidden content leaked in expanded preview: ${hidden}`);
    }
    await page.keyboard.press('Escape');
    console.log('Footer routes, environment continuity, three portfolio layouts, expanded preview, styling and reload persistence verified.');
    assert.deepEqual(errors,[],'Browser runtime errors');
    fs.writeFileSync('tmp/qa/results.json',JSON.stringify({layoutChecks,materialChecks,errors,passed:true},null,2));
    console.log('PASS — no browser runtime errors.');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1});
