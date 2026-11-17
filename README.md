# AlertaSP Mobile

Base inicial em Expo SDK 58, React Native e TypeScript. Inclui uma tela de boas-vindas e suporte a Android, iOS e web. Ainda não há serviços externos, autenticação ou funcionalidades de alertas.

## Requisitos

- Node.js 24.22.1 (fixado em `.nvmrc`) e npm 11.9.0.
- Para testar no celular: Expo Go compatível com o SDK 58 ou uma development build.
- O fluxo web não exige contas, chaves ou variáveis de ambiente.

## Desenvolvimento

```bash
npm ci
npm start
```

Use `npm run web` para o navegador. `npm run android` e `npm run ios` abrem um emulador/simulador instalado; o simulador iOS exige macOS. A conexão de um celular ao servidor depende da acessibilidade da rede.

## Validação

```bash
npm run typecheck
npm run lint
npm run build:web -- --max-workers 2
```

O build web gera `dist/`. Para verificar a compatibilidade de dependências, execute `npx expo install --check`. Ainda não existe suíte de testes de funcionalidades; a validação inicial cobre tipos, lint, bundles e carregamento da tela no navegador.

Para instalar novas dependências, use `npx expo install <pacote>` e mantenha `package-lock.json` versionado. Não versione credenciais nem arquivos locais de ambiente.

## Ambiente Codex na nuvem

O checkout fica em `/workspace/alertasp-mobile`. Cada tarefa já é isolada; use o checkout existente, sem criar worktrees.

```bash
cd /workspace/alertasp-mobile
export npm_config_cache=/workspace/.cache/npm
export XDG_CACHE_HOME=/workspace/.cache
export EXPO_NO_TELEMETRY=1
export EXPO_OFFLINE=1
npm ci --no-audit --no-fund
npm run typecheck
npm run lint
npm run build:web -- --max-workers 2
CI=0 BROWSER=none npm run web -- --localhost --port 8081 --max-workers 2
```

O modo offline usa os metadados incluídos no SDK e dispensa chamadas à API do Expo. A instalação npm ainda precisa de acesso a `registry.npmjs.org`. `docs.expo.dev` fornece a documentação e `api.expo.dev` permite verificações online adicionais quando liberados na configuração de rede.

Valide o servidor com uma requisição HTTP local e confira o carregamento de “AlertaSP” no navegador. Um processo ativo ou uma porta aberta, isoladamente, não validam o aplicativo. Processos não são preservados entre tarefas; reinicie o servidor quando necessário. Não há configuração de EAS Build nem validação em dispositivos físicos nesta base.
