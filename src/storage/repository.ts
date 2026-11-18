import { REGIONS, validateReport, type Favorite, type Region, type ReportDraft, type ReportRow } from '../domain/model.ts';

type Bind = string | number | null;
export interface Database {
  execAsync(sql: string): Promise<void>;
  getFirstAsync<T>(sql: string, ...params: Bind[]): Promise<T | null>;
  getAllAsync<T>(sql: string, ...params: Bind[]): Promise<T[]>;
  runAsync(sql: string, ...params: Bind[]): Promise<{ lastInsertRowId: number; changes: number }>;
}

export async function migrate(db: Database) {
  await db.execAsync('PRAGMA journal_mode = WAL;');
  const version = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  if ((version?.user_version ?? 0) > 1) throw new Error('Banco mais recente que esta versão do aplicativo.');
  if (version?.user_version === 1) return;
  try {
    await db.execAsync(`BEGIN TRANSACTION;
      CREATE TABLE IF NOT EXISTS favorites (
        region TEXT PRIMARY KEY NOT NULL CHECK(region IN ('centro','norte','sul','leste','oeste')),
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        region TEXT NOT NULL CHECK(region IN ('centro','norte','sul','leste','oeste')),
        kind TEXT NOT NULL CHECK(kind IN ('flood','drain')),
        location TEXT NOT NULL CHECK(length(trim(location)) BETWEEN 5 AND 120),
        description TEXT NOT NULL CHECK(length(trim(description)) BETWEEN 10 AND 280),
        created_at TEXT NOT NULL
      );
      PRAGMA user_version = 1;
      COMMIT;`);
  } catch (error) {
    await db.execAsync('ROLLBACK;').catch(() => undefined);
    throw error;
  }
}

export function createRepository(db: Database) {
  return {
    favorites: () => db.getAllAsync<Favorite>('SELECT * FROM favorites ORDER BY created_at, region'),
    reports: () => db.getAllAsync<ReportRow>('SELECT * FROM reports ORDER BY id DESC'),
    async setFavorite(region: Region, selected: boolean) {
      if (!Object.hasOwn(REGIONS, region)) throw new Error('Região inválida.');
      if (selected) await db.runAsync('INSERT OR IGNORE INTO favorites (region, created_at) VALUES (?, ?)', region, new Date().toISOString());
      else await db.runAsync('DELETE FROM favorites WHERE region = ?', region);
    },
    async addReport(input: ReportDraft) {
      const errors = validateReport(input);
      if (Object.keys(errors).length) throw new Error(Object.values(errors).join(' '));
      const result = await db.runAsync('INSERT INTO reports (region, kind, location, description, created_at) VALUES (?, ?, ?, ?, ?)',
        input.region, input.kind, input.location.trim(), input.description.trim(), new Date().toISOString());
      return result.lastInsertRowId;
    },
    async removeReport(id: number) {
      if (!Number.isSafeInteger(id) || id <= 0) throw new Error('Relato inválido.');
      await db.runAsync('DELETE FROM reports WHERE id = ?', id);
    },
  };
}
