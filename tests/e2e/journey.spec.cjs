const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

async function openPoints(page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Consultar pontos', exact: true }).click();
  await expect(page.getByRole('button', { name: /Ver detalhes de Av. Aricanduva/ })).toBeVisible();
}

test('main journey: source, category separation, manual search and invalid detail', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openPoints(page);
  await page.getByRole('textbox', { name: 'Buscar via ou bairro' }).fill('aricanduva');
  await expect(page.getByRole('button', { name: /Ver detalhes de Av. do Estado/ })).toHaveCount(0);
  await page.getByRole('button', { name: /Ver detalhes de Av. Aricanduva/ }).click();
  await expect(page.getByText('Mock CitizenTech · ocorrência fictícia', { exact: true })).toBeVisible();
  await expect(page.getByText('17/11/2026, 14:45 · São Paulo', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Voltar para pontos', exact: true }).click();
  await page.getByRole('textbox', { name: 'Buscar via ou bairro' }).fill('');
  await page.getByRole('button', { name: 'Histórico', exact: true }).click();
  await expect(page.getByRole('button', { name: /Ver detalhes de Av. Pompeia/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Ver detalhes de Av. Aricanduva/ })).toHaveCount(0);
  await page.getByRole('button', { name: 'Sensor', exact: true }).click();
  await page.getByRole('button', { name: /Ver detalhes de Estação didática/ }).click();
  await expect(page.getByText('32 cm · nível simulado', { exact: true })).toBeVisible();
  await page.goto('/ocorrencia/inexistente');
  await expect(page.getByText('Ponto não encontrado', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('SQLite persists favorites and reports after closing and reopening the page', async ({ page, context }) => {
  await page.goto('/favoritas');
  const favorite = page.getByRole('button', { name: 'Salvar Zona Leste nas favoritas', exact: true });
  await expect(favorite).toBeEnabled();
  await favorite.click();
  await expect(page.getByRole('button', { name: 'Remover Zona Leste das favoritas', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Registrar relato', exact: true }).click();
  await page.getByRole('button', { name: 'Salvar neste aparelho', exact: true }).click();
  await expect(page.getByText('Revise os campos indicados antes de salvar.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Boca de lobo obstruída', exact: true }).click();
  await page.getByRole('button', { name: 'Zona Leste', exact: true }).click();
  await page.getByRole('textbox', { name: 'Local aproximado', exact: true }).fill('Praça fictícia de teste');
  await page.getByRole('textbox', { name: 'Descrição da situação', exact: true }).fill('Obstrução fictícia usada apenas para testar a persistência.');
  await page.getByRole('button', { name: 'Salvar neste aparelho', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Ver relato salvo', exact: true })).toBeVisible();
  await page.close();
  const reopened = await context.newPage();
  await reopened.goto('/favoritas');
  await expect(reopened.getByRole('button', { name: 'Remover Zona Leste das favoritas', exact: true })).toBeVisible();
  await reopened.getByRole('button', { name: /Ver detalhes de Praça fictícia de teste/ }).click();
  await expect(reopened.getByText('Relato salvo somente neste aparelho', { exact: true })).toBeVisible();
  await reopened.getByRole('button', { name: 'Excluir este relato local', exact: true }).click();
  await reopened.getByRole('button', { name: 'Confirmar exclusão', exact: true }).click();
  await expect(reopened.getByText('Nenhum relato salvo', { exact: true }).filter({ visible: true })).toBeVisible();
  await reopened.reload();
  await expect(reopened.getByText('Nenhum relato salvo', { exact: true }).filter({ visible: true })).toBeVisible();
});

test('empty, error, retry, recovery and stale data are explicit', async ({ page }) => {
  await page.goto('/sobre');
  for (const [scenario, expected] of [['Sem dados', 'Nenhum ponto nesta consulta'], ['Falha de consulta', 'Não foi possível consultar']]) {
    await page.getByRole('button', { name: scenario, exact: true }).click();
    await page.getByRole('button', { name: 'Consultar cenário selecionado', exact: true }).click();
    await expect(page.getByText(expected, { exact: true }).filter({ visible: true })).toBeVisible();
    if (scenario === 'Falha de consulta') {
      await page.getByRole('button', { name: 'Tentar novamente', exact: true }).click();
      await expect(page.getByText('Não foi possível consultar', { exact: true }).filter({ visible: true })).toBeVisible();
    }
    await page.getByRole('button', { name: 'Sobre o AlertaSP e os dados', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Base antiga', exact: true }).click();
  await page.getByRole('button', { name: 'Consultar cenário selecionado', exact: true }).click();
  await page.getByRole('button', { name: /Ver detalhes de Av. do Estado/ }).click();
  await expect(page.getByText('Registro antigo ou fora do período atual', { exact: true })).toBeVisible();
  await page.goto('/sobre'); // A full restart resets only the demonstration scenario.
  await page.getByRole('button', { name: 'Normal', exact: true }).click();
  await page.getByRole('button', { name: 'Consultar cenário selecionado', exact: true }).click();
  await expect(page.getByRole('button', { name: /Ver detalhes de Av. Aricanduva/ })).toBeVisible();
});

test('WCAG A/AA browser checks and narrow viewport on all main screens', async ({ page }) => {
  for (const route of ['/', '/pontos', '/favoritas', '/relatar', '/sobre', '/ocorrencia/demo-1']) {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations, `${route}: ${JSON.stringify(results.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })))}`).toEqual([]);
    await page.setViewportSize({ width: 320, height: 640 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});
