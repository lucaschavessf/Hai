# Hai — experiências profissionais

Prova de conceito navegável para jovens em início de carreira e equipes de RH. Abra `index.html` no Chrome ou Edge. Não exige instalação, servidor nem conexão com a internet.

## Jornadas

- **Jovem:** início, catálogo com busca e filtros, contexto da experiência, desafio com materiais para baixar, rascunho, entrega em texto ou arquivo e portfólio com prévia pública.
- **RH:** painel da Nexa, fila de participantes, três avaliações humanas independentes e criação assistida a partir de seis templates por setor.
- **Ambientes:** `#acesso` separa as entradas. Cada ambiente tem sua própria navegação; o rodapé permite trocar de ambiente.

## Desafios disponíveis

| Empresa | Área | Demanda | Materiais |
| --- | --- | --- | --- |
| Nexa | Administração | Expedição com estoque limitado e prazo de coleta | Pedidos CSV e e-mail/regras TXT |
| Lumina | Marketing | Campanha local com R$ 3.000 de orçamento | Resultados por canal CSV e briefing TXT |
| Vértice | Tecnologia | Limpeza e análise de chamados de suporte | Base CSV e dicionário TXT |
| Ponto | Atendimento | Resolução de entrega incorreta antes de uma viagem | Histórico TXT e política TXT |

Cada desafio tem um cenário, restrições, entregáveis e três critérios observáveis. Os seis templates de RH incluem esses quatro setores, indústria e serviços financeiros. Todos oferecem materiais de exemplo, referência para avaliação e campos editáveis de cargo, público, prazo, formato, restrições e permissões.

## Limites da prova de conceito

As empresas, participantes e demandas são exemplos. Não há autenticação, backend, envio externo, publicação real, contato com candidatos ou avaliação por IA. A navegação por ambientes não é uma barreira de autorização.

Textos, perfil, escolhas de visibilidade, avaliações e briefing ficam em `sessionStorage` na aba atual, incluindo após recarregar. Arquivos anexados são mantidos em memória durante a navegação; apenas nome e tamanho sobrevivem ao recarregamento. Reanexe um arquivo se precisar atualizar a entrega depois de recarregar. A prévia pública só apresenta respostas em texto explicitamente autorizadas; arquivos não são publicados.

O painel do RH usa uma base própria de exemplos e avaliações humanas; as entregas locais do jovem não são sincronizadas com ele. Os totais de participantes e conclusões são dados de cenário, e a fila de três avaliações muda conforme a interação.

## Identidade e implementação

- Paleta Hai preservada: `#087F8C`, `#064B55`, `#DFF3EF`, `#FFE8DD`, branco e `#F7FAF9`.
- Logo original em `Hai_Logo_Vetorizada.svg`.
- Fotografias locais em `assets/`; fontes documentadas em `assets/README.md`.
- `data.js`: experiências, candidatos e templates.
- `app.js`: rotas, interfaces e estado da sessão.
- `styles.css`: layout responsivo, estados de foco e redução de movimento.
- `materiais/`: 12 anexos de exemplo em UTF-8, com BOM para facilitar abertura dos CSVs no Excel.

## Verificação

Com Node e Chrome instalados, execute `npm install` e `npm test`. A dependência Playwright é usada somente para os testes, não para abrir a plataforma. Também é possível definir `PLAYWRIGHT_PATH` para uma instalação existente e executar `node tools/verify.cjs`.

A suíte verifica 17 rotas em 320, 390, 768, 1024 e 1440 pixels, imagens, navegação separada, downloads, busca, quatro entregas, validação de arquivos, persistência, privacidade, edição de perfil, avaliações e seis templates. Capturas e resultados ficam em `tmp/qa/`, ignorado pelo Git.
