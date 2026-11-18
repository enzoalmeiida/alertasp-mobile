import fixture from '../data/occurrences.json';
import { parseOccurrences, type Scenario } from '../domain/model';

export async function loadOccurrences(scenario: Scenario) {
  // A local asynchronous adapter: no undocumented endpoint or live-data claim.
  await new Promise(resolve => setTimeout(resolve, 450));
  if (scenario === 'error') throw new Error('Falha de consulta simulada. Selecione “Normal” em Sobre para recuperar a base.');
  const items = parseOccurrences(fixture);
  if (scenario === 'empty') return [];
  return scenario === 'stale' ? items.map(item => ({ ...item, updatedAt: '2020-01-01T12:00:00-03:00' })) : items;
}
