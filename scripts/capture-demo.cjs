// Real browser interaction and recording. This is Expo web, not an Android Emulator.
const { chromium, expect } = require('@playwright/test');
const fs = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const output = path.resolve('docs/evidencias');
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, recordVideo: { dir: path.join(output, 'raw-video'), size: { width: 390, height: 844 } } });
  const page = await context.newPage();
  const video = page.video();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const base = process.env.ALERTASP_URL || 'http://127.0.0.1:8081';
  const pause = () => page.waitForTimeout(3000); // Reading time in the demonstration, not a test wait.
  const shot = async name => { await page.screenshot({ path: path.join(output, `${name}.png`) }); };
  const button = name => page.getByRole('button', { name, exact: true });
  let completed = false;
  try {
    await page.goto(base, { waitUntil: 'networkidle' });
    await button('Consultar pontos').waitFor();
    await pause(); await shot('inicio'); await pause();
    await button('Consultar pontos').click();
    await page.getByRole('button', { name: /Ver detalhes de Av. do Estado/ }).waitFor();
    await shot('pontos-filtros'); await pause();
    await page.getByRole('button', { name: /^Região: .+\. Filtrar por região$/ }).click(); await button('Zona Leste').click();
    const aricanduva = page.getByRole('button', { name: /Ver detalhes de Av. Aricanduva/ });
    await aricanduva.scrollIntoViewIfNeeded(); await shot('pontos'); await pause();
    await aricanduva.click(); await pause(); await shot('detalhe');
    await page.getByText('Mock CitizenTech · ocorrência fictícia', { exact: true }).scrollIntoViewIfNeeded(); await pause();
    await button('Salvar Zona Leste nas favoritas').click();
    await expect(button('Remover Zona Leste das favoritas')).toBeVisible(); await pause();
    await button('Voltar para pontos').click();
    await page.getByRole('button', { name: /^Região: .+\. Filtrar por região$/ }).click(); await button('Todas').click();
    await button('Histórico').click();
    await page.getByRole('button', { name: /Ver detalhes de Av. Pompeia/ }).scrollIntoViewIfNeeded(); await shot('historico'); await pause();
    await button('Sensor').click();
    await page.getByRole('button', { name: /Ver detalhes de Estação didática/ }).click();
    await page.getByText('32 cm · nível simulado', { exact: true }).scrollIntoViewIfNeeded(); await pause();
    await button('Voltar para pontos').click();
    await page.getByRole('tab', { name: 'Regiões favoritas', exact: true }).click();
    await expect(button('Remover Zona Leste das favoritas')).toBeVisible(); await shot('favoritas'); await pause();
    await button('Registrar relato').click();
    await button('Boca de lobo obstruída').click(); await button('Zona Leste').click();
    await page.getByRole('textbox', { name: 'Local aproximado', exact: true }).fill('Praça fictícia da demonstração');
    await page.getByRole('textbox', { name: 'Descrição da situação', exact: true }).fill('Exemplo fictício de obstrução para demonstrar o registro local, sem dados pessoais.');
    await button('Salvar neste aparelho').scrollIntoViewIfNeeded(); await shot('relato'); await pause();
    await button('Salvar neste aparelho').click();
    await expect(button('Ver relato salvo')).toBeVisible(); await shot('relato-salvo'); await pause();
    await button('Ir para favoritas').click();
    await page.waitForURL('**/favoritas');
    await page.reload({ waitUntil: 'networkidle' });
    await expect(button('Remover Zona Leste das favoritas')).toBeVisible();
    await pause(); await shot('persistencia-favorita');
    const report = page.getByRole('button', { name: /Ver detalhes de Praça fictícia da demonstração/ });
    await report.scrollIntoViewIfNeeded(); await shot('persistencia-relato'); await pause();
    await report.click(); await page.getByText('Relato salvo somente neste aparelho', { exact: true }).waitFor(); await pause();
    if (errors.length) throw new Error(errors.join('\n'));
    completed = true;
  } finally {
    await context.close();
    try {
      if (completed) await video.saveAs(path.join(output, 'demo-web.webm'));
    } finally { await browser.close(); }
  }
  await fs.rm(path.join(output, 'raw-video'), { recursive: true, force: true });
  console.log('Prints e vídeo Expo web salvos em docs/evidencias. Não representam Android.');
})().catch(error => { console.error(error); process.exitCode = 1; });
