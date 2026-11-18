# Validação manual no Android e roteiro de vídeo

**Status: execução no Android Emulator pendente.** Esta máquina cloud não fornece SDK, AVD ou KVM. Os testes e capturas web são evidências complementares, não equivalentes a executar o app no Android. Não marque itens abaixo sem executá-los.

## Preparar o computador da equipe

1. Instale Node 24.22.1 e npm 11.9.0. Instale Android Studio, Android SDK Platform Tools e um AVD com Google APIs (por exemplo Pixel com Android 15/API 35). Essa é uma sugestão de AVD, não uma versão já testada.
2. Inicie o AVD pelo Device Manager e aguarde a tela inicial. Confirme `adb devices` com o emulador no estado `device`.
3. Na raiz deste repositório, execute `npm ci`, depois `npm run android`. O Expo deve abrir o projeto no emulador. Se necessário, use `npx expo start --android --localhost` e verifique a conexão pelo adb.
4. O projeto usa **Expo SDK 58**. Use Expo Go compatível com esse SDK; confira a versão em [expo.dev/go](https://expo.dev/go). Não faça downgrade aleatório de dependências para acomodar um Expo Go antigo. Expo Router e expo-sqlite constam na documentação do SDK; os bundles passaram, mas a compatibilidade do binário do Expo Go no computador ainda precisa ser confirmada.
5. Se o professor pedir development build ou o Expo Go disponível não suportar o SDK, siga a documentação versionada do Expo para `npx expo run:android`. Isso gera projetos nativos ignorados pelo Git e exige toolchain Android compatível. EAS Build e credenciais não são necessários para o fluxo demonstrativo escolhido.

O app **não solicita localização**. A busca manual por região é a alternativa permanente, portanto negar ou não conceder GPS não bloqueia a jornada. Não há chave de mapa, assinatura ou serviço SOA/IoT necessário para iniciar.

## Checklist com evidências

Registre computador/OS, versão Android/API, modelo AVD, versão Expo Go/build, SHA testado, data e responsável. Use apenas exemplos fictícios.

| Passo | Ação | Resultado esperado | Evidência / estado |
|---|---|---|---|
| 1 | Abrir o app | Início identifica demonstração e resume somente ativas do mock | Pendente Android |
| 2 | Consultar Pontos, buscar Aricanduva e escolher Zona Leste | Lista compatível com busca/região, sem GPS | Pendente Android |
| 3 | Abrir detalhe | Via, categoria, fonte e data originais legíveis | Pendente Android |
| 4 | Navegar em Histórico, Relatos e Sensor | Nenhum dos três aparece como ocorrência ativa confirmada | Pendente Android |
| 5 | Salvar Zona Leste | Botão indica região salva; aviso do mock é mostrado | Pendente Android |
| 6 | Tentar relato vazio | Mensagens por campo; nada salvo | Pendente Android |
| 7 | Registrar relato fictício válido | Confirmação, detalhe pendente, origem local | Pendente Android |
| 8 | Encerrar e reabrir o app de verdade | Favorita e relato continuam disponíveis | Pendente Android |
| 9 | Excluir relato e reabrir | Registro permanece excluído | Pendente Android |
| 10 | Sobre → Sem dados, Falha, Base antiga, Normal | Vazio claro, erro com retry, aviso de antiguidade e recuperação | Pendente Android |
| 11 | Aumentar fonte/tamanho de exibição nas Configurações | Texto legível, botões alcançáveis, formulário rolável com teclado | Pendente Android |
| 12 | Ativar TalkBack e navegar por gestos | Ordem coerente, botão/aba rotulados, seleção e erros compreensíveis | Pendente Android |
| 13 | Voltar com botão/gesto Android em detalhe e formulário | Retorno previsível; sem travamento | Pendente Android |

Para provar persistência, **não** apague os dados nem desinstale. Em Expo Go, encerre-o por Configurações → Apps → Expo Go → Forçar parada (ou `adb shell am force-stop host.exp.exponent`) e reabra o mesmo projeto. Fast Refresh sozinho não demonstra persistência após encerramento. Desinstalar/limpar dados apaga o banco local por definição.

## Roteiro de vídeo final — 2min50s

| Tempo | Mostrar | Explicar com suas palavras |
|---|---|---|
| 0:00–0:20 | Início no Android Emulator | Pessoa beneficiada, dificuldade de consultar informação localizada, app Expo/TypeScript/Router |
| 0:20–0:50 | Busca, região e detalhe | Mock explícito; fonte, data e cuidado com dado desatualizado |
| 0:50–1:15 | Histórico, relato e sensor | Diferença entre ativo fictício, inativo, pendente e leitura simulada |
| 1:15–1:35 | Favoritar região e consultar avisos | Avisos internos, não push; SQLite local |
| 1:35–2:05 | Criar relato fictício e fechar/reabrir app | Mostrar gravação, consulta e manutenção após reinício, sem dados pessoais |
| 2:05–2:30 | Fonte grande/TalkBack; estado vazio ou erro | Acessibilidade e recuperação de falhas |
| 2:30–2:50 | README e limitações | Arquitetura, testes, prints, ausência de integração real, link do GitHub |

Grave o emulador pelo recurso de gravação do Android Studio ou OBS. Como alternativa, `adb shell screenrecord --time-limit 170 /sdcard/alertasp-demo.mp4`, execute a jornada e depois `adb pull /sdcard/alertasp-demo.mp4`. Confira duração, legibilidade e ausência de informações pessoais. Se usar Expo Go, não deixe projetos privados ou notificações pessoais visíveis.

O arquivo `docs/evidencias/demo-web.webm`, quando gerado pelo script do repositório, é uma demonstração complementar de **Expo web**. Não o renomeie como captura Android. Para a entrega final, prefira substituir/complementar o link no README por uma gravação real no Android de até 3 minutos, conforme solicitado à equipe. Teste o acesso do professor ao link.

## Antes de enviar

- Conferir a rubrica completa na tarefa do Teams: pesos, banco local/remoto e eventual exigência adicional de mapa/integração. O PDF não resolve essas perguntas.
- Completar os passos Android e documentar falhas encontradas; não afirmar que o checklist passou sem execução.
- Confirmar Ficha e recorte territorial com a pesquisa real da equipe. Entrevistas e indicadores ainda não foram medidos pelo app.
- Um integrante envia o link do repositório no Teams até **19/11/2026, 23h55 (horário de São Paulo)**. Esta automação não realiza o envio.
