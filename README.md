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

O desafio de Marketing demonstra uma pergunta complementar opcional e um contador de 90 minutos. No RH, salve um briefing e use **Testar como participante** para experimentar as perguntas e o limite de tempo configurados. O tempo começa na primeira abertura e continua após recarregar a aba. A resposta pode ser formatada com botões ou Markdown; a prévia e o portfólio renderizam a formatação. Após enviar uma resposta escrita em um dos quatro desafios de exemplo, a análise por regras mostra uma nota estimada por critério, os sinais identificados e pontos para revisão. A estimativa vai até 4/5, reservando a nota máxima à avaliação humana. Uma nova entrega atualiza a estimativa. Anexos e briefings personalizados não são pontuados por esse mecanismo.

## Limites da prova de conceito

As empresas, participantes e demandas são exemplos. Não há autenticação, backend, envio externo, publicação real, contato com candidatos ou avaliação por IA. O feedback estimado usa sinais textuais configurados para os quatro desafios de exemplo; não verifica se uma decisão é correta nem substitui a avaliação humana. Roberto responde com mensagens de exemplo relacionadas ao desafio, sem conexão com um serviço de IA. A navegação por ambientes não é uma barreira de autorização.

Textos, perfil do jovem e da Nexa, feedback estimado, escolhas de visibilidade, avaliações e briefing ficam em `sessionStorage` na aba atual, incluindo após recarregar. Arquivos anexados são mantidos em memória durante a navegação; apenas nome e tamanho sobrevivem ao recarregamento. Reanexe um arquivo se precisar atualizar a entrega depois de recarregar. A prévia pública só apresenta respostas em texto explicitamente autorizadas; arquivos e feedback não são publicados.

O jovem pode escolher entre três designs de portfólio, cinco cores prontas ou uma cor personalizada, duas tipografias e três estilos de capa. A prévia usa a mesma composição na página e no diálogo ampliado. Aparência e visibilidade são escolhas independentes.
As competências do perfil têm níveis de 1 a 5, ajustáveis no portfólio e respeitados na prévia pública quando a seção estiver visível.
Cada perfil pode manter um projeto complementar. O jovem pode informar onde fez, sua participação, como trabalhou e o resultado, além de editar ou remover o registro. O projeto só aparece na prévia quando a seção está visível; as simulações da Hai permanecem em destaque.

O painel do RH usa uma base própria de exemplos e avaliações humanas; as entregas locais do jovem não são sincronizadas com ele. Os totais de participantes e conclusões são dados de cenário, e a fila de três avaliações muda conforme a interação.

## Identidade e implementação

- Paleta Hai preservada: `#087F8C`, `#064B55`, `#DFF3EF`, `#FFE8DD`, branco e `#F7FAF9`.
- Logo original em `Hai_Logo_Vetorizada.svg`.
- Fotografias locais em `assets/`; fontes documentadas em `assets/README.md`.
- `data.js`: experiências, candidatos e templates.
- `app.js`: rotas, interfaces e estado da sessão.
- `styles.css`: layout responsivo, estados de foco e redução de movimento.
- `portfolio.js` e `portfolio.css`: editor de aparência e prévia pública responsiva.
- `project.js` e `project.css`: projeto complementar único, edição e apresentação no portfólio e nas avaliações de exemplo.
- `institutional.js` e `institutional.css`: páginas Sobre, Privacidade e Ajuda, além do rodapé.
- `features.js` e `features.css`: editor Markdown, formulário de perguntas, contador opcional, níveis de competência e conversa com o colega de equipe.
- `company-feedback.js` e `company-feedback.css`: perfil das empresas, edição da Nexa e feedback estimado por critério.
- `materiais/`: 12 anexos de exemplo em UTF-8, com BOM para facilitar abertura dos CSVs no Excel.

## Verificação

Com Node e Chrome instalados, execute `npm install` e `npm test`. A dependência Playwright é usada somente para os testes, não para abrir a plataforma. Também é possível definir `PLAYWRIGHT_PATH` para uma instalação existente e executar `node tools/verify.cjs`.

A suíte verifica 24 rotas em 320, 390, 768, 1024 e 1440 pixels, imagens, navegação separada, downloads, busca, quatro entregas, validação de arquivos, persistência, privacidade, aparência do portfólio, rodapé, avaliações e seis templates. Também cobre os perfis das empresas, edição da Nexa, feedback estimado e revisão da resposta, formatação Markdown, perguntas configuráveis, tempo limite, conversa com Roberto, níveis de competência e o ciclo de edição do projeto único. Capturas e resultados ficam em `tmp/qa/`, ignorado pelo Git.
