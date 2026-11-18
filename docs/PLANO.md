# Plano de produto e evidências — antes da implementação

Base: PDF FIAP CitizenTech 2026.2, página 34 (Mobile), páginas 20–21 (Ficha e combinados). O PDF permite API **ou mock**, exige banco, mas não especifica local/remoto nem pesos. A rubrica completa do Teams não foi fornecida. SQLite local é a decisão técnica deste MVP, sujeita à confirmação do professor.

## Jornada escolhida

Uma pessoa vai se deslocar por São Paulo. Abre o resumo, busca uma via ou escolhe uma região manualmente, consulta uma ocorrência e confere categoria, origem e horário. Salva a região e volta aos avisos dela. Pode registrar um relato local não validado. Não pede GPS nem promete que uma rua está segura.

Todas as ocorrências incluídas são exemplos fictícios. Status “ativa” significa ativa **no cenário de demonstração**, nunca uma afirmação sobre a cidade agora. Histórico, relato pendente e sensor simulado ficam em categorias separadas.

## Wireframes

```text
INÍCIO                         PONTOS
AlertaSP              Sobre    Pontos de alagamento
São Paulo • consulta manual    [Buscar via ou bairro       ]
[DEMONSTRAÇÃO • sem tempo real] [Todas][Centro][Norte] ...
Como está seu caminho?         [Ativas][Histórico][Relatos][Sensor]
[2 ativas no cenário]          Fonte e período do mock
[Consultar pontos →]           [Categoria • região        ]
Avisos das suas regiões        [Via / local               ]
[Escolher favoritas]           [Origem + data + Ver detalhe]
[Orientação de cuidado]        [Carregando / vazio / erro / tentar]
Início | Pontos | Favoritas    Início | Pontos | Favoritas

DETALHE                        FAVORITAS
← Voltar                       Suas regiões
[Categoria escrita + ícone]    Salvas neste aparelho
Via / local                    [♡ Centro] [♥ Zona Leste] ...
Região                         Avisos das regiões salvas
Fonte explícita                [Ocorrência do mock →]
Data e período                 [Sem registro ≠ rua segura]
[Aviso de dado antigo]         Seus relatos locais
Descrição e limites            [Pendente / não enviado →]
[Favoritar região]             [Registrar relato]

RELATAR                        SOBRE / DEMONSTRAÇÃO
← Voltar                       Origem, período e limites
Não é canal de emergência      Fonte mock; sem GPS/push
[Tipo][Região]                 SQLite local
[Local aproximado]             Estados demonstráveis:
[Descrição sem dados pessoais] [Normal][Vazio][Erro][Antigo]
[Salvar neste aparelho]        Retornar à consulta
Erros por campo / confirmação
```

## Requisito → tela/fluxo → dado → evidência

| Critério / requisito | Tela ou fluxo | Dado e implementação | Evidência planejada |
|---|---|---|---|
| Expo + React Native + TypeScript | Aplicativo inteiro | SDK 58, tipos estritos | package.json, typecheck, bundle Android |
| Telas e navegação / Expo Router | Início → Pontos → Detalhe; Favoritas; Relato | Rotas por arquivo e parâmetros de ID | Jornada navegável, retorno, ID inválido |
| Consumo de dados | Resumo, lista e detalhe | JSON mock através de serviço assíncrono com validação | Fonte, período, loading, vazio, erro e retry |
| Banco de dados | Favoritar região, criar/consultar relato | SQLite: favorites e reports; migração versionada; SQL parametrizado | Inserir, consultar, fechar/reabrir e manter; testes com SQLite real |
| Acessibilidade | Todas as telas | Texto + ícone, contraste, alvos ≥48dp, fonte escalável, rótulos e erros | Testes automáticos possíveis + roteiro TalkBack/fonte grande no Android |
| Aderência ao problema | Localizar informação por via/região | Categorias separadas; data/fonte; sem promessa de segurança | Usuário localiza ocorrência e entende sua confiabilidade |
| Documentação | README e docs | Ficha, execução Android, versões, dados, limites, prints e vídeo | Links de evidência com plataforma identificada |

## Navegação e componentes

Expo Router: `src/app/(tabs)/index.tsx`, `pontos.tsx`, `favoritas.tsx`; `src/app/ocorrencia/[id].tsx`; `relatar.tsx`; `sobre.tsx`; `+not-found.tsx`. Stack para detalhes/formulário e três abas para consultas frequentes. Componentes de tela, cartão, categoria, botão, campo e estados ficam em `src/components`, fora das rotas.

## Dados e persistência

- `Occurrence`: id, local, bairro, região, categoria, origem, data, descrição; sensor tem valor/unidade demonstrativos.
- `favorites(region PRIMARY KEY, created_at)`: evita duplicação.
- `reports(id INTEGER PRIMARY KEY, region, kind, location, description, created_at)`: consulta persistida; status sempre pendente, sem envio público.
- Migração SQLite via `PRAGMA user_version`; escrita parametrizada; validação antes do INSERT; mensagens claras em falha de armazenamento. Não guardar GPS, identidade, contatos ou fotos.
- O mock pode ser trocado por um adaptador de API documentada. Não há API CGE/GeoSampa presumida. Nenhum dado deste app é oficial.

## Decisões de escopo

Lista pesquisável é o fluxo principal e a alternativa de contingência ao mapa. Não instalar mapa, não solicitar localização, não assumir gratuidade de Google Maps. Mapa geográfico, push, autenticação, backend, sensores reais e integração SOA ficam fora deste MVP. Caso o Teams exija mapa, a seleção de biblioteca e condições de chave/cobrança deverá ser validada antes da implementação. Avisos são consultas dentro do app, não notificações push.

O ambiente cloud permite navegador e bundles, mas não contém Android SDK/emulador/KVM. Prints e vídeo produzidos aqui serão rotulados **Expo web**, e não apresentados como Android. A verificação no Android Emulator da equipe continua obrigatória para comprovar a preferência de ambiente e os testes nativos.
