# Relatório de validação e limites da entrega

Ambiente verificado: Linux cloud, Node 24.22.1, npm 11.9.0, Expo SDK 58 e Chromium do sistema. As evidências visuais são **Expo web**, viewport 390 × 844. O navegador não é um Android Emulator.

## Verificações executadas

| Verificação | Resultado | O que demonstra |
|---|---|---|
| `npm ci --engine-strict --no-audit --no-fund` | Passou | Instalação reproduzível pelo lockfile |
| `npm run typecheck` | Passou | Tipos TypeScript da aplicação e testes |
| `npm run lint` | Passou | Regras estáticas do projeto |
| `npm test` | 8 passaram; 0 falharam ou ignorados | Filtros, categorias, datas, validação, SQLite real e persistência após reabrir arquivo |
| `npm run test:e2e` | 4 passaram; 0 falharam ou ignorados | Jornada web, persistência com expo-sqlite, estados de falha e acessibilidade |
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
| Consumo de dados | Mock documentado, fonte/data/status e estados de consulta | Confirmar eventuais exigências extras no Teams; não há API oficial |
| Banco | SQLite real e persistência demonstrada nos caminhos testados | Confirmar aceitação de banco local e repetir encerramento/reabertura no Android |
| Acessibilidade | Rótulos, contraste verificado, alvos, mensagens e scanner web | TalkBack e fonte/tamanho de exibição ampliados no Android |
| Aderência ao problema | Consulta manual por via/região com informação contextualizada | Pesquisa com cidadãos, recorte territorial e indicador ainda não medidos |
| Documentação | Ficha, nomes/RMs, fontes, arquitetura, prints, vídeo, prompts e roteiro | Conferir acesso do avaliador aos links, acrescentar evidências Android e enviar no Teams |

**Não foi atribuída nota nem inventado peso.** O PDF não detalha os pesos ou a modalidade de banco aceita; a rubrica completa do Teams não foi fornecida. Mapa, notificações push, API SOA e IoT real não foram implementados. A lista pesquisável e o mock são as decisões deste MVP; requisitos adicionais do professor precisam ser conferidos.

## Próxima execução humana

Siga [ANDROID-E-VIDEO.md](ANDROID-E-VIDEO.md). Preencha modelo/API do emulador, versão Expo Go/build, responsável, commit testado e resultado de cada passo. Não marque como aprovado apenas porque o bundle foi gerado. O vídeo web é complementar; para demonstrar a preferência da equipe, grave também a jornada real no Android em até 3 minutos.

O envio no Teams é responsabilidade de um integrante, até 19/11/2026 às 23h55, horário de São Paulo. Nenhum envio ao Teams foi realizado por esta automação.
