import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { filterOccurrences, isStale, parseOccurrences, reportToOccurrence, validateReport } from '../src/domain/model.ts';

const fixture = JSON.parse(readFileSync(new URL('../src/data/occurrences.json', import.meta.url), 'utf8'));
const points = parseOccurrences(fixture);

test('active query excludes history, pending reports and simulated sensors', () => {
  assert.deepEqual(filterOccurrences(points, 'active').map(point => point.id), ['demo-1', 'demo-2']);
  assert.equal(filterOccurrences(points, 'historical').length, 2);
  assert.equal(filterOccurrences(points, 'pending').length, 1);
  assert.equal(filterOccurrences(points, 'sensor').length, 1);
});
test('manual search ignores case/accents and combines region and category', () => {
  assert.equal(filterOccurrences(points, 'active', 'leste', 'ARICANDUVA')[0].id, 'demo-2');
  assert.equal(filterOccurrences(points, 'historical', 'oeste', 'pompéia')[0].id, 'demo-3');
  assert.equal(filterOccurrences(points, 'active', 'centro', 'Aricanduva').length, 0);
  assert.equal(filterOccurrences(points, 'active', 'all', 'nada encontrado').length, 0);
});
test('mock adapter rejects malformed dates, duplicate ids and misleading origins', () => {
  assert.throws(() => parseOccurrences([{ ...fixture[0], updatedAt: 'invalid' }]));
  assert.throws(() => parseOccurrences([fixture[0], fixture[0]]));
  assert.throws(() => parseOccurrences([{ ...fixture[0], origin: 'official' }]));
  assert.throws(() => parseOccurrences([{ ...fixture[0], region: 'elsewhere' }]));
});
test('freshness uses the original timestamp, including future/invalid data', () => {
  const now = Date.parse('2026-11-17T18:00:00Z');
  assert.equal(isStale('2026-11-17T17:30:00Z', now), false);
  assert.equal(isStale('2026-11-17T16:59:59Z', now), true);
  assert.equal(isStale('2026-11-18T18:00:00Z', now), true);
  assert.equal(isStale('invalid', now), true);
});
test('form validation returns understandable errors before persistence', () => {
  assert.equal(Object.keys(validateReport({ kind: '', region: '', location: ' ', description: ' ' })).length, 4);
  assert.deepEqual(validateReport({ kind: 'drain', region: 'centro', location: 'Praça fictícia', description: 'Obstrução fictícia para teste.' }), {});
});
test('local reports remain pending and are never counted as active alerts', () => {
  const point = reportToOccurrence({ id: 1, region: 'centro', kind: 'flood', location: 'Praça de teste', description: 'Descrição de exemplo.', created_at: new Date().toISOString() });
  assert.equal(point.origin, 'local-report');
  assert.equal(point.category, 'pending');
  assert.equal(filterOccurrences([point], 'active').length, 0);
  assert.match(point.source, /não validado nem enviado/);
});
