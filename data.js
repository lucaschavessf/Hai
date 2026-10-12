const experiences = [{
  id: 'operacoes',
  brand: 'Nexa',
  area: 'Administração',
  sector: 'Logística',
  role: 'Assistente de operações',
  time: 45,
  title: 'Uma entrega que não pode esperar',
  short: 'Organize uma expedição com estoque limitado e alinhe o próximo passo com o cliente.',
  image: 'assets/operacoes.jpg',
  alt: 'Corredores de um centro de distribuição',
  about: 'A Nexa distribui materiais de escritório para pequenas empresas. Você acompanha pedidos entre estoque, transportadora e atendimento.',
  scenario: 'São 14h de uma terça-feira. A clínica Horizonte espera 120 kits de boas-vindas até as 17h para receber sua equipe amanhã. Há apenas 90 kits liberados. A coleta ocorre às 15h30 e a supervisora está em reunião até as 15h. Você precisa propor um encaminhamento antes da coleta, sem prometer estoque ainda não confirmado.',
  facts: [['Pedido 4821', '120 kits a R$ 42 cada. Há 90 liberados e 30 em conferência. Carlos, do estoque, pode confirmar a liberação até 14h40.'], ['Transporte', 'Coleta regular às 15h30, entrega até 17h, custo de R$ 80. Segunda viagem: R$ 180, chegada às 19h. Gastos extras exigem aprovação da supervisora.'], ['Outras demandas', 'O relatório de estoque vence amanhã às 10h e tem duas divergências. Uma colega precisa do procedimento de devolução, na pasta Operações / Procedimentos.']],
  tasks: ['Monte uma sequência de ações entre 14h e 15h30 com responsável, prazo e dependência. Inclua as demandas secundárias.', 'Compare envio parcial e espera pela conferência. Indique quando decidir e o que depende de autorização.', 'Escreva uma mensagem de até 120 palavras à clínica: o que está confirmado, o que falta confirmar e o horário da próxima atualização.'],
  constraints: 'Não altere o pedido nem autorize frete extra. A clínica pode aceitar entrega parcial, mas isso ainda precisa ser confirmado.',
  format: 'Plano de ação e mensagem ao cliente.',
  criteria: [['Priorização', 'Conecta a confirmação às 14h40 à coleta às 15h30 e acomoda as demandas secundárias.'], ['Viabilidade', 'Diferencia estoque liberado de conferência e respeita a aprovação do frete.'], ['Comunicação', 'Explica o que está confirmado, quem acompanha e quando será o próximo contato.']],
  materials: [{
    name: 'Pedidos e posição de estoque',
    file: 'nexa-pedidos.csv',
    type: 'CSV',
    content: 'pedido;cliente;item;quantidade;liberados;em_conferencia;prazo\n4821;Clínica Horizonte;Kit;120;90;30;Hoje 17h\n4822;Escritório Maré;Pasta;40;40;0;Amanhã 12h\n4823;Ateliê Norte;Bloco;60;58;2;Amanhã 16h\n'
  }, {
    name: 'E-mail e regras de expedição',
    file: 'nexa-contexto.txt',
    type: 'TXT',
    content: 'De: Mariana Costa, Clínica Horizonte\nPrecisamos dos 120 kits até 17h. Nossa integração começa amanhã às 8h. Consigo uma atualização até 15h?\n\nColeta regular: 15h30, chegada até 17h, R$ 80.\nColeta extra: 17h30, chegada até 19h, R$ 180.\nFrete extra depende de Renata, supervisora, disponível às 15h.\nCarlos retorna a conferência até 14h40.\nDivergências do relatório: pastas, sistema 42 e físico 40; blocos, sistema 60 e físico 58 com 2 em conferência.\nProcedimento de devolução: Operações / Procedimentos.\n'
  }]
}, {
  id: 'marketing',
  timeLimitMinutes: 90,
  formQuestions: [{ id: 'channel', label: 'Qual canal você priorizaria para o lançamento?', type: 'select', required: false, options: ['Instagram local', 'Criador local', 'Panfletagem nas faculdades'] }],
  brand: 'Lumina',
  area: 'Marketing',
  sector: 'Varejo e consumo',
  role: 'Assistente de marketing',
  time: 60,
  title: 'Uma campanha para trazer gente à loja',
  short: 'Escolha os canais e planeje um lançamento com R$ 3.000 de orçamento.',
  image: 'assets/marketing.jpg',
  alt: 'Computador sobre uma mesa com gráficos de campanha',
  about: 'A Lumina é uma papelaria com loja no centro do Recife. Sua equipe prepara o lançamento da coleção de cadernos reciclados Recomeço.',
  scenario: 'É segunda-feira. A coleção chega no sábado e a gerente quer gerar 60 visitas à loja atribuídas à campanha em sete dias. Você recebeu R$ 3.000. O público principal são estudantes de 16 a 24 anos, e há duas faculdades a duas quadras da loja. Sua proposta precisa ser aprovada amanhã até 12h.',
  facts: [['Produto e oferta', 'Caderno de R$ 39,90, estoque de 200 unidades. Um marcador para as primeiras 50 compras; sem descontos autorizados.'], ['Canais', 'Instagram local, criador de conteúdo e panfletagem nas faculdades. Os custos e resultados anteriores estão no anexo.'], ['Produção', 'A designer tem quatro horas na quarta-feira. O caixa pode registrar a origem de cada visita. A loja fecha aos domingos.']],
  tasks: ['Distribua a verba entre pelo menos dois canais, usando os resultados anteriores. Preserve R$ 300 para ajustes após a revisão.', 'Monte um cronograma de segunda a domingo com aprovação, produção, lançamento e acompanhamento.', 'Escreva uma publicação de até 100 palavras com produto, preço, local e chamada para visita. Explique como medir as 60 visitas.'],
  constraints: 'Não invente selos ambientais. Papel reciclado é o único atributo ambiental confirmado. Não ofereça descontos.',
  format: 'Orçamento, cronograma, uma publicação e plano de medição.',
  criteria: [['Orçamento', 'Respeita R$ 3.000, reserva R$ 300 e utiliza os custos do anexo.'], ['Canais', 'Relaciona público local e visitas anteriores à escolha dos canais.'], ['Execução', 'Inclui aprovação, produção, oferta correta e registro da origem das visitas.']],
  materials: [{
    name: 'Custos e resultados por canal',
    file: 'lumina-canais.csv',
    type: 'CSV',
    content: 'canal;custo_reais;alcance;visitas;escopo\nInstagram local;1200;18000;32;Sete dias raio 3km\nCriador local;900;8500;21;Um vídeo e três stories\nPanfletagem;600;2000;18;Impressão e distribuição em duas faculdades\n'
  }, {
    name: 'Briefing da coleção Recomeço',
    file: 'lumina-briefing.txt',
    type: 'TXT',
    content: 'Objetivo: 60 visitas presenciais em sete dias.\nLoja: Rua da Aurora, 240, Recife. Segunda a sábado, 9h às 18h. Domingo fechada.\nCaderno Recomeço: papel reciclado, R$ 39,90. Estoque: 200.\nOferta: marcador para as primeiras 50 compras. Sem descontos.\nVerba: R$ 3.000, reserva obrigatória de R$ 300.\nDesigner: quatro horas na quarta. Aprovação: terça até 12h. Lançamento: sábado.\nCaixa registra canal de origem, data, visita e compra separadamente.\nResultados anteriores não são garantia de novos resultados.\n'
  }]
}, {
  id: 'dados',
  brand: 'Vértice',
  area: 'Tecnologia',
  sector: 'Tecnologia',
  role: 'Assistente de dados',
  time: 50,
  title: 'O que está atrasando o atendimento?',
  short: 'Investigue uma base de chamados e transforme os números em uma recomendação.',
  image: 'assets/dados.jpg',
  alt: 'Tela com painéis analíticos e gráficos de desempenho',
  about: 'A Vértice desenvolve um sistema de gestão para pequenos negócios. O suporte acompanha o tempo de primeira resposta aos clientes.',
  scenario: 'Na reunião de segunda-feira, a coordenadora relata reclamações sobre demora. A meta é responder em até quatro horas úteis. Você recebeu 12 registros da semana anterior, entre cobrança, acesso e configuração. Antes de ampliar a equipe, ela quer entender onde se concentram os atrasos e se os dados são confiáveis.',
  facts: [['Qualidade da base', 'Pode haver duplicidade ou campo vazio. Os tempos já estão em horas úteis; não é necessário calcular calendários.'], ['Recurso disponível', 'Um especialista tem duas horas para uma ação de melhoria nesta semana. Recomende uma intervenção em uma categoria.'], ['Limite da análise', 'A amostra é pequena: não representa o mês inteiro. Campo vazio não significa zero.']],
  tasks: ['Identifique duplicidades e valores ausentes. Explique o tratamento e informe o número de registros válidos.', 'Calcule por categoria o tempo médio e o percentual de chamados acima de quatro horas. Mostre os cálculos.', 'Recomende, em até 200 palavras, a categoria prioritária, o uso das duas horas e um indicador para a próxima semana.'],
  constraints: 'Não exclua chamados apenas por demora. Registre as decisões de limpeza e o tamanho da amostra.',
  format: 'Tabela de cálculos, decisões de limpeza e recomendação.',
  criteria: [['Qualidade', 'Remove a duplicata C104 e trata C109 sem converter o tempo ausente em zero.'], ['Cálculo', 'Distingue tempo médio de proporção fora da meta e usa registros válidos.'], ['Recomendação', 'Relaciona a intervenção aos dados e reconhece o limite da amostra.']],
  materials: [{
    name: 'Chamados da semana',
    file: 'vertice-chamados.csv',
    type: 'CSV',
    content: 'id;categoria;primeira_resposta_horas;dia\nC101;Acesso;2;Segunda\nC102;Cobrança;6;Segunda\nC103;Configuração;3;Terça\nC104;Cobrança;8;Terça\nC104;Cobrança;8;Terça\nC105;Acesso;1;Quarta\nC106;Configuração;5;Quarta\nC107;Cobrança;7;Quinta\nC108;Acesso;3;Quinta\nC109;Configuração;;Sexta\nC110;Configuração;2;Sexta\nC111;Cobrança;3;Sexta\n'
  }, {
    name: 'Dicionário e orientação da equipe',
    file: 'vertice-dicionario.txt',
    type: 'TXT',
    content: 'id: identificador único. Linhas idênticas com mesmo ID são duplicatas.\nprimeira_resposta_horas: horas úteis até a primeira resposta. Vazio é dado não registrado.\nMeta: até 4 horas inclusive. Atraso: maior que 4.\nMédia: soma dos tempos válidos / número de chamados válidos.\nPercentual fora da meta: chamados acima de 4 horas / chamados com tempo válido x 100.\nRecurso: duas horas de especialista para orientação, triagem ou treinamento.\n'
  }]
}, {
  id: 'atendimento',
  brand: 'Ponto',
  area: 'Atendimento',
  sector: 'Varejo e relacionamento',
  role: 'Assistente de atendimento',
  time: 40,
  title: 'Uma conversa que recupera a confiança',
  short: 'Resolva uma entrega incorreta com empatia e atenção às regras da operação.',
  image: 'assets/atendimento.jpg',
  alt: 'Atendimento ao cliente no balcão de uma loja',
  about: 'A Ponto vende acessórios para trabalho e estudo. O atendimento coordena soluções com o estoque e a logística.',
  scenario: 'Às 10h de quinta-feira, Beatriz escreve: comprou uma mochila azul para uma viagem no sábado, mas recebeu uma preta. Já entrou em contato ontem e não teve retorno. Você encontra o pedido pago, uma foto da etiqueta e o registro anterior sem encaminhamento. Ofereça uma solução possível sem pedir que ela repita toda a história.',
  facts: [['Pedido 7308', 'Mochila azul, R$ 189,90, entregue ontem. Há duas unidades azuis na loja Centro, a 4 km da cliente.'], ['Alternativas', 'Troca em loja hoje, das 10h às 19h, com reserva por 24 horas; ou coleta e reenvio sem custo, com chegada em três dias úteis após a coleta.'], ['Retorno', 'A logística confirma a coleta em até quatro horas úteis. Reembolso é possível, conforme a política anexa.']],
  tasks: ['Escreva a primeira resposta em até 150 palavras, reconhecendo o histórico e comparando as soluções com a viagem de sábado.', 'Crie uma nota interna com pedido, problema, opção a confirmar, responsável e prazo de retorno.', 'Prepare uma mensagem de acompanhamento se a cliente preferir reenvio, esclarecendo prazo e dependências.'],
  constraints: 'Não prometa entrega antes de sábado, não peça a foto novamente e não ofereça descontos fora da política.',
  format: 'Primeira resposta, nota interna e acompanhamento.',
  criteria: [['Escuta', 'Reconhece o contato anterior e usa as informações já recebidas.'], ['Operação', 'Apresenta prazos corretos e a reserva de 24 horas.'], ['Continuidade', 'Registra responsável, próximo contato e dados para a próxima pessoa.']],
  materials: [{
    name: 'Histórico do atendimento',
    file: 'ponto-historico.txt',
    type: 'TXT',
    content: 'Pedido 7308 | Beatriz Almeida | Mochila azul | R$ 189,90\nQuarta 15h12: Recebi preta. Pedi azul. Segue foto da etiqueta.\nQuarta 15h15, atendimento: Vamos verificar.\nQuinta 10h: Ninguém respondeu. Viajo sábado e preciso resolver.\nFoto recebida, divergência confirmada. Sem encaminhamento.\nLoja Centro: Rua do Sol, 180. Segunda a sábado, 10h às 19h. Estoque: duas azuis.\n'
  }, {
    name: 'Política de resolução',
    file: 'ponto-politica.txt',
    type: 'TXT',
    content: 'Troca em loja: sem custo, reserva de 24h após confirmação. Levar produto recebido e número do pedido.\nColeta: janela confirmada em até quatro horas úteis. Reenvio chega em três dias úteis após coleta. Sem custo.\nReembolso: financeiro processa em até dois dias úteis após recebimento do produto. Crédito no cartão depende da operadora e pode aparecer em até duas faturas.\nNão repetir solicitação de foto. Não garantir antecipação nem oferecer desconto sem aprovação. Registrar próximo retorno com horário e responsável.\n'
  }]
}];
const templates = [...experiences.map(x => ({
  id: x.id,
  title: x.title,
  sector: x.sector,
  role: x.role,
  area: x.area,
  scenario: x.scenario,
  tasks: x.tasks.join('\n'),
  constraints: x.constraints,
  materials: x.materials.map(m => m.name).join('\n'),
  rubric: x.criteria.map(c => c.join(': ')).join('\n'),
  time: x.time
})), {
  id: 'industria',
  title: 'Reorganizar a produção com falta de insumos',
  sector: 'Indústria',
  role: 'Aprendiz de produção',
  area: 'Operações',
  time: 50,
  scenario: 'Às 8h, a linha recebe uma ordem de 300 peças para as 16h. Há insumos para 220 peças; o restante chega às 13h. A linha faz 50 peças por hora e para das 12h às 13h. Um lote de 20 peças aguarda inspeção. Proponha uma sequência e comunique o risco ao supervisor.',
  tasks: 'Cronograma por hora; cálculo da capacidade; mensagem com risco e alternativa.',
  constraints: 'Não operar máquinas nem autorizar horas extras. Respeitar pausa e liberação da qualidade.',
  materials: 'Ordem de produção; saldo de insumos; capacidade por hora; registro da inspeção.',
  rubric: 'Capacidade: calcula horas e peças. Segurança: preserva inspeção e pausa. Comunicação: apresenta risco e decisão necessária.'
}, {
  id: 'financas',
  title: 'Conferir pagamentos antes do fechamento',
  sector: 'Serviços financeiros',
  role: 'Assistente financeiro',
  area: 'Finanças',
  time: 45,
  scenario: 'No último dia útil do mês, oito notas precisam ser conciliadas até 16h. Uma foi paga duas vezes, duas estão sem comprovante e uma difere R$ 120 do extrato. A liderança está disponível às 14h. Prepare pendências e a lista para aprovação, sem movimentar valores.',
  tasks: 'Tabela por documento; classificação das divergências; e-mail de até 150 palavras para aprovação.',
  constraints: 'Não efetuar pagamentos ou estornos. Utilizar somente dados sintéticos, sem contas reais.',
  materials: 'Oito notas sintéticas; extrato com IDs correspondentes; regra de conciliação; agenda de fechamento.',
  rubric: 'Precisão: encontra duplicidade e R$ 120. Rastreabilidade: vincula nota ao lançamento. Priorização: solicita comprovantes antes das 14h.'
}];
const candidates = [{
  id: 'maria',
  name: 'Maria Santos',
  city: 'Recife, PE',
  answer: 'Às 14h pediria a Carlos a confirmação dos 30 kits até 14h40. Enviaria à colega o caminho do procedimento e avisaria a clínica sobre a conferência. Sem liberação às 14h40, consultaria a clínica sobre receber 90 hoje e levaria a Renata às 15h a aprovação do frete adicional. Fecharia a expedição até 15h15. Conferiria o relatório após a coleta.\n\nMariana, temos 90 kits liberados e 30 em conferência. Vou atualizar você até 14h45 para alinharmos a entrega. Se necessário, podemos conversar sobre um envio parcial.',
  project: { title: 'Organização de uma feira estudantil', where: 'Escola', role: 'Planejamento e comunicação', process: 'Dividi tarefas com colegas, preparei um cronograma e acompanhei as atividades até o evento.', result: 'Aprendi a ajustar o planejamento quando surgiram imprevistos.' }
}, {
  id: 'joao',
  name: 'João Pedro',
  city: 'Olinda, PE',
  answer: 'Aguardaria o estoque até 14h40 e conferiria o relatório nesse intervalo. Às 15h pediria autorização de frete extra, se necessário. Avisaria a clínica antes da coleta sobre a quantidade disponível.\n\nMariana, estamos verificando 30 kits e temos 90 disponíveis. Retorno às 15h. Se não houver liberação, podemos combinar uma entrega parcial?',
  project: { title: 'Controle de materiais do grêmio', where: 'Grêmio estudantil', role: 'Registro de materiais', process: 'Organizei uma planilha de entradas e saídas e estabeleci uma conferência periódica com a equipe.', result: 'O grupo passou a consultar um registro único dos materiais.' }
}, {
  id: 'ana',
  name: 'Ana Clara',
  city: 'Jaboatão, PE',
  answer: 'Consultaria a clínica sobre receber 90 kits. Pediria a posição dos outros 30 até 14h40. Enviaria o procedimento à colega e registraria as divergências para revisar após a coleta. Levaria a decisão do frete à supervisora às 15h.\n\nMariana, acompanho seu pedido. Temos 90 kits liberados e aguardamos a conferência de 30 até 14h40. Retorno até 14h50. Você conseguiria receber 90 hoje se o restante ainda estivesse em conferência?',
  project: { title: 'Campanha de arrecadação', where: 'Comunidade local', role: 'Comunicação e organização', process: 'Ajudei a divulgar a campanha, combinei pontos de coleta e organizei a triagem das doações.', result: 'Aprendi a comunicar prazos e responsabilidades com clareza.' }
}];

// The same source drives the participant brief and the employer's template.
templates.forEach(t => {
  const x = experiences.find(e => e.id === t.id);
  t.format = x ? x.format + ' Texto ou arquivo de até 10 MB.' : 'Texto e tabela, em PDF ou planilha de até 10 MB.';
  if (x) {
    t.scenario += '\n\n' + x.facts.map(f => f.join(': ')).join('\n\n');
    t.resources = x.materials;
  }
});
templates.find(t => t.id === 'industria').resources = [{
  name: 'Ordem, insumos e capacidade',
  file: 'industria-producao.csv',
  type: 'CSV',
  content: 'item;quantidade;horario;observacao\nOrdem de produção;300;16h;Prazo de saída\nMaterial disponível;220;8h;Inclui 20 peças que dependem de inspeção\nReposição de material;80;13h;Chegada prevista\nCapacidade por hora;50;8h a 16h;Pausa de 12h a 13h\nLote em inspeção;20;9h;Liberação prevista pela qualidade\n'
}, {
  name: 'Orientações de produção',
  file: 'industria-orientacoes.txt',
  type: 'TXT',
  content: 'Função: aprendiz de produção, atuando no planejamento com supervisão.\nA capacidade de 50 peças/hora já inclui montagem e embalagem.\nAs 20 peças em inspeção são insumos para montagem e integram o saldo de 220.\nQualidade confirma a liberação até 9h. Não consumir o lote antes da confirmação.\nSe a reposição das 13h atrasar, informar o supervisor e revisar a previsão. Não compensar com hora extra não autorizada.\nEntregar cronograma de 8h a 16h, cálculo de capacidade e mensagem ao supervisor.\n'
}];
templates.find(t => t.id === 'financas').resources = [{
  name: 'Notas e lançamentos para conciliação',
  file: 'financas-conciliacao.csv',
  type: 'CSV',
  content: 'nota;valor_nota;valor_extrato;comprovante;id_lancamento\nNF01;450;450;Sim;L01\nNF02;800;800;Sim;L02\nNF02;800;800;Sim;L03\nNF03;320;320;Não;L04\nNF04;1000;1000;Sim;L05\nNF05;560;680;Sim;L06\nNF06;240;240;Não;L07\nNF07;900;900;Sim;L08\nNF08;150;150;Sim;L09\n'
}, {
  name: 'Regras e agenda de fechamento',
  file: 'financas-fechamento.txt',
  type: 'TXT',
  content: 'Todos os valores são sintéticos, em reais. Oito notas distintas, nove lançamentos.\nUma nota pode ter mais de um lançamento; conferir se existe autorização antes de classificar como pagamento em duplicidade. Não há parcelamentos nem pagamentos adicionais aprovados neste lote.\nConciliação exige valor correspondente e comprovante. Extrato não substitui comprovante.\nResponsável financeiro disponível às 14h, fechamento até 16h.\nSolicitar comprovantes ao administrativo antes das 14h. Não executar estornos ou pagamentos.\nEntregar tabela por nota, divergência, ação pendente e responsável.\n'
}];
const referenceAnswers = {
  operacoes: 'Confirmar os 30 kits até 14h40, consultar aceite do cliente para eventual parcial, solicitar aprovação de Renata às 15h e fechar expedição antes das 15h30. Não garantir 120 kits nem autorizar frete extra. Encaminhar o procedimento à colega e revisar divergências após a coleta.',
  marketing: 'Exemplo viável: R$ 1.200 em Instagram, R$ 900 em criador e R$ 600 em panfletagem, mantendo R$ 300 de reserva. O histórico soma 71 visitas, sem garantir repetição. Aprovar terça, produzir quarta, lançar sábado; domingo serve para analisar, não receber visitas. Registrar origem no caixa.',
  dados: 'Após remover uma duplicata e excluir apenas o tempo ausente dos cálculos, há 10 tempos válidos. Acesso: média 2h, 0% acima da meta (3 casos). Cobrança: média 6h, 75% acima (4 casos). Configuração: média 3,33h, 33,33% acima (3 casos). Priorizar cobrança com orientação ou triagem e acompanhar o percentual de atraso.',
  atendimento: 'Reconhecer a falta de retorno, oferecer a troca em loja com reserva de 24 horas como alternativa compatível com sábado. Explicar que reenvio em três dias úteis após coleta não atende à viagem. Confirmar a escolha e registrar retorno até 14h para a janela de coleta, se solicitada.',
  industria: 'Sete horas produtivas permitem até 350 peças, acima das 300 demandadas. Produzir 200 até 12h; das 13h às 15h, produzir as 100 restantes, com 20 do saldo e 80 da reposição. Uma hora de folga depende da confirmação da inspeção e da chegada às 13h. Não consumir lote retido.',
  financas: 'NF02 tem dois lançamentos de R$ 800 sem autorização adicional. NF03 e NF06 não possuem comprovante. NF05 tem diferença de R$ 120 a maior. Solicitar documentos antes das 14h e levar divergências para aprovação, sem movimentar valores.'
};
templates.forEach(t => {
  t.reference = referenceAnswers[t.id];
  t.materials = t.resources.map(m => m.name).join('\n');
});
