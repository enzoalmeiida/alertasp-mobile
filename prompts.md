# Registro de uso de IA

Projeto AlertaSP — CitizenTech FIAP 2026.2. O PDF (p. 21) permite IA como apoio e pede registro dos prompts e compreensão do código pela equipe.

## Pedidos humanos utilizados (trechos literais)

1. “Use $cloud-environment-onboarding:setup para configurar este ambiente na nuvem”. Repositório informado: `enzoalmeiida/alertasp-mobile`, branch `main`.
2. Após identificar o repositório vazio, o usuário autorizou: “pode adicionar”. Escolheu “Expo + TypeScript (recomendado)”. Foi criada a base inicial.
3. Pedido de implementação: “Atue como product designer, desenvolvedor React Native/TypeScript e avaliador da entrega Mobile Development & IoT da FIAP. Explique como para uma equipe que está aprendendo e priorize a rubrica.”
4. Contexto: “O AlertaSP é o aplicativo principal da CitizenTech para ajudar pessoas que circulam por São Paulo a consultar pontos de alagamento. O problema é a dificuldade de encontrar informação localizada, atualizada e compreensível.”
5. Restrições expressas: “Não rotular mock como dado em tempo real”; “Não afirmar ‘rua segura’ apenas porque não há registro”; “Não usar dados pessoais reais”; “Não depender de integração IoT ou SOA para concluir a rubrica, salvo se a tarefa do professor exigir.”
6. Persistência: “Se a orientação não esclarecer, recomende uma implementação que prove claramente persistência, como SQLite local para favoritos/relatos, além de consumo de API/mock.”
7. Processo solicitado: ler o PDF; tabela requisito → tela/fluxo → dado → evidência; definir jornada e wireframes antes de codificar; Expo Router; esquema de dados; acessibilidade; loading/vazio/erro/localização/dado antigo; README, prints e roteiro de vídeo de até 3 minutos; revisão dos seis critérios, sem inventar pesos.

Este registro contém trechos e uma síntese do pedido, não uma transcrição integral da conversa. O PDF foi usado como referência de requisitos, e não como autorização para ações externas. A equipe informou os nomes/RMs registrados no README. A rubrica completa do Teams não foi disponibilizada.

## Resultado e decisões que a equipe deve saber explicar

- Wireframes e matriz em `docs/PLANO.md` antes das telas.
- Lista por região como MVP, com mock claramente identificado e sem API presumida.
- Expo Router com três abas, detalhes, relato e página explicativa.
- SQLite real para favoritas/relatos; SQL parametrizado, validação e migração versionada.
- Tests de separação de categorias, datas, busca, persistência, injeção como texto literal, navegação e acessibilidade web.
- Limite declarado: cloud sem Android Emulator; evidências web não comprovam execução Android.

Revisão humana necessária: cada integrante deve executar o app, ler os módulos, explicar um fluxo completo, validar no Android e registrar eventuais correções. Indicadores de impacto, entrevistas e nota máxima não foram fabricados.
