# Hai — experiências profissionais

Prova de conceito navegável para jovens em início de carreira e equipes de RH. Abra `index.html` no Chrome ou Edge. Não exige instalação, servidor nem conexão com a internet.

## Jornadas

- **Jovem:** início, catálogo com busca e filtros, perfil das empresas com cultura e desafios abertos, contexto da experiência, desafio com materiais para baixar, editor Markdown, perguntas complementares, rascunho, entrega em texto ou arquivo, feedback automático estimado por critério e portfólio com prévia pública.
- **RH:** painel da Nexa, perfil da empresa editável, fila de participantes, três avaliações humanas independentes e criação assistida a partir de seis templates por setor, com editor Markdown, formulário configurável e tempo limite opcional.
- **Ambientes:** `#acesso` separa as entradas. Cada ambiente tem sua própria navegação; o rodapé permite trocar de ambiente.
- **Páginas institucionais:** Sobre, Privacidade e Ajuda, acessíveis pelo rodapé em ambos os ambientes.

## Desafios disponíveis

| Empresa | Área | Demanda | Materiais |
| --- | --- | --- | --- |
| Nexa | Administração | Expedição com estoque limitado e prazo de coleta | Pedidos CSV e e-mail/regras TXT |
| Lumina | Marketing | Campanha local com R$ 3.000 de orçamento | Resultados por canal CSV e briefing TXT |
| Vértice | Tecnologia | Limpeza e análise de chamados de suporte | Base CSV e dicionário TXT |
| Ponto | Atendimento | Resolução de entrega incorreta antes de uma viagem | Histórico TXT e política TXT |

Cada desafio tem um cenário, restrições, entregáveis e três critérios observáveis. Os seis templates de RH incluem esses quatro setores, indústria e serviços financeiros. Todos oferecem materiais de exemplo, referência para avaliação e campos editáveis de cargo, público, prazo, formato, restrições e permissões.

O desafio de Marketing demonstra uma pergunta complementar opcional e um prazo de 90 minutos. Antes de iniciar, a pessoa vê a duração estimada separada do prazo. O relógio só começa após **Iniciar agora** e continua correndo ao sair ou recarregar a aba. No RH, salve um briefing e use **Testar como participante** para experimentar as perguntas e o limite de tempo configurados. A resposta pode ser formatada com botões ou Markdown; a prévia e o portfólio renderizam a formatação. Após enviar uma resposta escrita em um dos quatro desafios de exemplo, a análise por regras mostra uma estimativa por critério, os sinais identificados e pontos para revisão. A estimativa vai até 4/5 e usa apenas sinais presentes no texto: não confirma se a resposta está correta. Uma nova entrega atualiza a estimativa. Anexos e briefings personalizados não são pontuados por esse mecanismo.

Durante o desafio, Contexto, Sua solução e Entrega aparecem uma etapa por vez. Na escrita, um painel permite consultar o cenário, as tarefas e os materiais sem perder o rascunho; os critérios ficam junto ao editor. O cronômetro permanece visível durante a rolagem, e a conversa com Roberto só se abre quando solicitada. Os cartões de desafios cronometrados mostram tanto a duração estimada quanto o prazo para enviar.

## Limites da prova de conceito

As empresas, participantes e demandas são exemplos. Não há autenticação, backend, envio externo, publicação real, contato com candidatos ou avaliação por IA. O feedback estimado usa sinais textuais configurados para os quatro desafios de exemplo; não verifica se uma decisão é correta. A jornada do jovem mostra somente essa estimativa e não promete uma análise humana futura. Roberto responde com mensagens de exemplo relacionadas ao desafio, sem conexão com um serviço de IA. A navegação por ambientes não é uma barreira de autorização.

Textos, perfil do jovem e da Nexa, feedback estimado, escolhas de visibilidade, avaliações e briefing ficam em `sessionStorage` na aba atual, incluindo após recarregar. Arquivos anexados são mantidos em memória durante a navegação; apenas nome e tamanho sobrevivem ao recarregamento. Reanexe um arquivo se precisar atualizar a entrega depois de recarregar. A prévia pública só apresenta respostas em texto explicitamente autorizadas; arquivos e feedback não são publicados.

O jovem pode escolher entre três designs de portfólio, cinco cores prontas ou uma cor personalizada, duas tipografias e três estilos de capa. A prévia usa a mesma composição na página e no diálogo ampliado. Aparência e visibilidade são escolhas independentes.
As competências do perfil têm níveis de 1 a 5, ajustáveis no portfólio e respeitados na prévia pública quando a seção estiver visível.
Cada perfil pode manter um projeto complementar. O jovem pode informar onde fez, sua participação, como trabalhou e o resultado, além de editar ou remover o registro. O projeto só aparece na prévia quando a seção está visível; as simulações da Hai permanecem em destaque.

O painel do RH usa uma base própria de exemplos e avaliações humanas; as entregas locais do jovem não são sincronizadas com ele. Os totais de participantes e conclusões são dados de cenário, e a fila de três avaliações muda conforme a interação.

## Identidade e implementação

- Paleta Hai preservada: `#087F8C`, `#064B55`, `#DFF3EF`, `#FFE8DD`, branco e `#F7FAF9`.
- Logo original em `Hai_Logo_Vetorizada.svg`.
- Fotografias em `assets/`; materiais de experiência em `materiais/`, com fontes documentadas em `assets/README.md`.
- `src/core/`: inicialização da aplicação, rotas, estado, dados e estilos compartilhados.
- `src/features/`: desafios, criação de experiências e componentes de interação.
- `src/company/`: perfis de empresas e feedback estimado.
- `src/institutional/`: páginas Sobre, Privacidade e Ajuda, além do rodapé.
- `src/portfolio/`: editor de aparência e prévia pública responsiva.
- `src/project/`: projeto complementar, edição e apresentação no portfólio e nas avaliações.
- `materiais/`: 12 anexos de exemplo em UTF-8, com BOM para facilitar abertura dos CSVs no Excel.
- `tools/`: verificações automatizadas e captura de telas.

## Verificação

Com Node e Chrome instalados, execute `npm install` e `npm test`. A dependência Playwright é usada somente para os testes, não para abrir a plataforma. Também é possível definir `PLAYWRIGHT_PATH` para uma instalação existente e executar `node tools/verify.cjs`.

A suíte verifica 24 rotas em 320, 390, 768, 1024 e 1440 pixels, imagens, navegação separada, downloads, busca, quatro entregas, validação de arquivos, persistência, privacidade, aparência do portfólio, rodapé, avaliações e seis templates. Também cobre os perfis das empresas, edição da Nexa, feedback estimado e revisão da resposta, formatação Markdown, perguntas configuráveis, tempo limite, conversa com Roberto, níveis de competência e o ciclo de edição do projeto único. Capturas e resultados ficam em `tmp/qa/`, ignorado pelo Git.
