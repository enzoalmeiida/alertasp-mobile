export const REGIONS = {
  centro: 'Centro',
  norte: 'Zona Norte',
  sul: 'Zona Sul',
  leste: 'Zona Leste',
  oeste: 'Zona Oeste',
} as const;
export type Region = keyof typeof REGIONS;
export const CATEGORIES = ['active', 'historical', 'pending', 'sensor'] as const;
export type Category = (typeof CATEGORIES)[number];
export const CATEGORY_LABELS: Record<Category, string> = {
  active: 'Ativa no cenário', historical: 'Histórico', pending: 'Relato pendente', sensor: 'Sensor simulado',
};
export interface Occurrence {
  id: string;
  location: string;
  neighborhood: string;
  region: Region;
  category: Category;
  origin: 'mock' | 'local-report';
  source: string;
  updatedAt: string;
  description: string;
  sensorReading?: string;
}
export type Scenario = 'normal' | 'empty' | 'error' | 'stale';
export interface ReportDraft {
  region: string;
  kind: string;
  location: string;
  description: string;
}
export interface ReportRow {
  id: number;
  region: Region;
  kind: 'flood' | 'drain';
  location: string;
  description: string;
  created_at: string;
}
export interface Favorite { region: Region; created_at: string }

export function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function filterOccurrences(items: Occurrence[], category: Category, region = 'all', query = '') {
  const search = normalizeSearch(query);
  return items.filter(item => item.category === category && (region === 'all' || item.region === region)
    && normalizeSearch(`${item.location} ${item.neighborhood} ${REGIONS[item.region]}`).includes(search));
}

export function isStale(timestamp: string, now = Date.now()) {
  const time = Date.parse(timestamp);
  return !Number.isFinite(time) || now - time > 60 * 60 * 1000 || time > now;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(new Date(value));
}

export function validateReport(input: ReportDraft) {
  const errors: Partial<Record<keyof ReportDraft, string>> = {};
  if (!Object.hasOwn(REGIONS, input.region)) errors.region = 'Escolha uma região.';
  if (!['flood', 'drain'].includes(input.kind)) errors.kind = 'Escolha o tipo de relato.';
  if (input.location.trim().length < 5 || input.location.trim().length > 120) errors.location = 'Informe um local com 5 a 120 caracteres.';
  if (input.description.trim().length < 10 || input.description.trim().length > 280) errors.description = 'Descreva a situação com 10 a 280 caracteres.';
  return errors;
}

export function reportToOccurrence(row: ReportRow): Occurrence {
  return {
    id: `local-${row.id}`, location: row.location, neighborhood: row.kind === 'flood' ? 'Relato de alagamento' : 'Boca de lobo obstruída',
    region: row.region, category: 'pending', origin: 'local-report', source: 'Relato local · não validado nem enviado',
    updatedAt: row.created_at, description: row.description,
  };
}

// Validate the boundary even for a bundled mock, before replacing it with a real API.
export function parseOccurrences(value: unknown): Occurrence[] {
  if (!Array.isArray(value)) throw new Error('Formato de dados inválido.');
  const ids = new Set<string>();
  return value.map(item => {
    if (!item || typeof item !== 'object') throw new Error('Registro inválido.');
    for (const key of ['id', 'location', 'neighborhood', 'source', 'updatedAt', 'description']) {
      if (typeof item[key] !== 'string' || !item[key].trim()) throw new Error(`Campo inválido: ${key}.`);
    }
    if (!Object.hasOwn(REGIONS, item.region) || !CATEGORIES.includes(item.category) || item.origin !== 'mock'
      || !Number.isFinite(Date.parse(item.updatedAt)) || ids.has(item.id)) throw new Error('Registro incompatível com o mock.');
    if (item.sensorReading !== undefined && typeof item.sensorReading !== 'string') throw new Error('Leitura de sensor inválida.');
    ids.add(item.id);
    return { ...item } as Occurrence;
  });
}
