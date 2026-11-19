# Relatório de validação e limites da entrega

Ambiente verificado: Linux cloud, Node 24.22.1, npm 11.9.0, Expo SDK 58 e Chromium do sistema. As evidências visuais são **Expo web**, viewport 390 × 844. O navegador não é um Android Emulator.

## Verificações executadas

| Verificação | Resultado | O que demonstra |
|---|---|---|
| `npm ci --engine-strict --no-audit --no-fund` | Passou | Instalação reproduzível pelo lockfile |
| `npm run typecheck` | Passou | Tipos TypeScript da aplicação e testes |
| `npm run lint` | Passou | Regras estáticas do projeto |
| `npm test` | 8 passaram; 0 falharam ou ignorados | Filtros, categorias, datas, validação, SQLite real e persistência após reabrir arquivo |
| `npm run test:e2e` | 6 passaram; 0 falharam ou ignorados | Jornada web, persistência com expo-sqlite, estados de falha e acessibilidade |
| `expo export --platform all` | Passou para web, Android e iOS | Geração dos bundles; não comprova execução nativa nem gera APK/IPA |
| Captura de demonstração | Prints e vídeo web em `docs/evidencias` | Sessão real com navegação, mock identificado, gravação e consulta de dados |

O resultado estruturado da última execução de navegador está em [evidencias/testes-web.json](evidencias/testes-web.json). Os testes são reproduzíveis; relatórios temporários completos ficam em `test-results/`, ignorado pelo Git.

## Cobertura dos testes

- Domínio: ativas excluem histórico/relato/sensor; busca sem distinção de acento/caixa; combinação de região e categoria; rejeição de mock inválido; datas antigas/futuras; validação do formulário.
- SQLite real: migração repetível, favorita sem duplicação, inserção de relato, texto com apóstrofo e trecho semelhante a SQL tratado como texto, fechamento e reabertura do arquivo, exclusão persistente e proteção contra versão de esquema desconhecida.
- Expo web: navegação pelo detalhe e ID inválido; favoritas/relatos mantidos após fechar e reabrir página; erros de formulário; exclusão com confirmação; base vazia, falha/retry/recuperação e antiguidade.
- Acessibilidade web: axe com regras WCAG 2 A/AA e 2.1 AA em seis telas; viewport estreito de 320 × 640 sem transbordamento horizontal. Isso não é certificação de acessibilidade nem substitui TalkBack.

Durante a validação foi corrigido um indicador de carregamento sem nome acessível. Seletores de testes foram ajustados para observar a tela visível, pois o Router pode manter telas anteriores montadas. A exportação de vídeo foi corrigida para salvar a gravação antes de encerrar a conexão com o navegador.

## Revisão dos seis critérios

| Critério | Evidência disponível | O que ainda impede afirmar atendimento integral |
|---|---|---|
| Telas e navegação | Fluxo completo web, Router e bundles nativos | Executar no Android e verificar teclado/gesto voltar |
| Consumo de dados | Mock documentado, fonte/data/status e estados de consulta | Dados demonstrativos, não uma API oficial; mock é permitido pelo enunciado |
| Banco | SQLite real e persistência demonstrada nos caminhos testados | Repetir encerramento/reabertura no Android; o enunciado não exige banco remoto |
| Acessibilidade | Rótulos, contraste verificado, alvos, mensagens e scanner web | TalkBack e fonte/tamanho de exibição ampliados no Android |
| Aderência ao problema | Consulta manual por via/região com informação contextualizada | Pesquisa com cidadãos, recorte territorial e indicador ainda não medidos |
| Documentação | Ficha, nomes/RMs, fontes, arquitetura, prints, vídeo de 54,68s e prompts; links públicos verificados | Registrar validação Android e enviar o repositório no Teams |

**Não foi atribuída nota nem inventado peso.** A equipe confirmou que a página 34 é o único enunciado disponível. O texto não informa pesos individuais nem exige modalidade remota de banco. Mapa, notificações push, API SOA e IoT real não foram implementados. A lista pesquisável e o mock são as decisões deste MVP; não são tratados como requisitos ausentes da entrega descrita nesse enunciado.

## Próxima execução humana

Siga [ANDROID-E-VIDEO.md](ANDROID-E-VIDEO.md). Preencha modelo/API do emulador, versão Expo Go/build, responsável, commit testado e resultado de cada passo. Não marque como aprovado apenas porque o bundle foi gerado. O vídeo web de 54,68 segundos foi escolhido pela equipe para a entrega e está vinculado no README. Não há nova gravação pendente; a execução nativa e os testes manuais Android permanecem pendentes.

O envio no Teams é responsabilidade de um integrante, até 19/11/2026 às 23h55, horário de São Paulo. Nenhum envio ao Teams foi realizado por esta automação.

## Correções da revisão

- A tela Pontos mantém a consulta dos relatos locais durante carregamento, erro e nova tentativa da fonte mock. A interface identifica consulta parcial e distingue ausência de relatos locais de indisponibilidade da base.
- O filtro de região informa o valor selecionado no nome acessível e expõe seu estado aberto/fechado na web e no modelo de acessibilidade nativo.
- Dois testes de regressão verificam esses comportamentos, inclusive busca e abertura de um relato salvo durante falha da fonte. Isso não substitui a conferência com TalkBack no Android.

## Conferência final da entrega — 19/11/2026

Referência conferida novamente: página 34 do PDF fornecido. Revisados código das telas, componentes, estado, serviço de dados, domínio, repositório SQLite, configuração Expo/Router e documentação. O código da aplicação corresponde ao commit `ca06a05`; as alterações desta revisão são de documentação e atualização das evidências.

- Lint e TypeScript executados novamente, sem erros.
- 8 testes de domínio/SQLite e 6 testes web aprovados, sem falhas, testes ignorados ou resultados instáveis.
- Exportação de web, Android e iOS concluída. A geração de bundles não equivale a executar um app nativo.
- Vídeo existente escolhido para a entrega: WebM/VP9, 390 × 844, 54,68 segundos, sem narração. Arquivo decodificado integralmente sem erros; quadros inspecionados confirmam a gravação do app. A página 34 não exige fala nem uma plataforma específica para a gravação.
- Repositório e link do vídeo responderam HTTP 200 em acesso sem autenticação. Links locais e imagens da documentação conferidos.
- Não foram identificadas falhas bloqueadoras nos fluxos exercitados. Mock e SQLite local atendem às modalidades permitidas pelo texto disponível. A revisão não atribui nota nem garante avaliação máxima.

**Pendências reais:** execução e acessibilidade nativas no Android Emulator (incluindo persistência após forçar parada), revisão da equipe e envio no Teams. O ambiente desta revisão não dispõe de Android SDK/ADB/emulador; por isso, esses resultados não foram declarados como aprovados. Pesquisa com cidadãos e medição do indicador continuam propostas, sem resultados alegados. Não há nova gravação de vídeo pendente.
