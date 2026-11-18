import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { test } from 'node:test';
import { createRepository, migrate, type Database } from '../src/storage/repository.ts';

function adapter(connection: DatabaseSync): Database {
  return {
    async execAsync(sql) { connection.exec(sql); },
    async getFirstAsync<T>(sql: string, ...params: (string | number | null)[]) { return (connection.prepare(sql).get(...params) as T) ?? null; },
    async getAllAsync<T>(sql: string, ...params: (string | number | null)[]) { return connection.prepare(sql).all(...params) as T[]; },
    async runAsync(sql, ...params) { const result = connection.prepare(sql).run(...params); return { lastInsertRowId: Number(result.lastInsertRowid), changes: Number(result.changes) }; },
  };
}
test('real SQLite: insert, query, close, reopen, remove, and reopen again', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'alertasp-sqlite-'));
  const path = join(directory, 'test.db');
  let connection = new DatabaseSync(path);
  try {
    await migrate(adapter(connection));
    await migrate(adapter(connection)); // repeat initialization without erasing data
    let repo = createRepository(adapter(connection));
    await repo.setFavorite('leste', true);
    await repo.setFavorite('leste', true);
    const location = "Praça fictícia d'água; DROP TABLE favorites; --";
    const id = await repo.addReport({ region: 'leste', kind: 'drain', location, description: 'Obstrução fictícia, apenas para testar persistência.' });
    assert.equal((await repo.favorites()).length, 1);
    connection.close();
    connection = new DatabaseSync(path);
    await migrate(adapter(connection));
    repo = createRepository(adapter(connection));
    assert.equal((await repo.favorites())[0].region, 'leste');
    assert.equal((await repo.reports())[0].location, location);
    assert.equal((await repo.reports())[0].id, id);
    await repo.removeReport(id);
    await repo.setFavorite('leste', false);
    connection.close();
    connection = new DatabaseSync(path);
    repo = createRepository(adapter(connection));
    assert.deepEqual(await repo.favorites(), []);
    assert.deepEqual(await repo.reports(), []);
  } finally { connection.close(); rmSync(directory, { recursive: true, force: true }); }
});
test('invalid report cannot reach the database; future schema is not overwritten', async () => {
  const connection = new DatabaseSync(':memory:');
  try {
    const db = adapter(connection);
    await migrate(db);
    const repo = createRepository(db);
    await assert.rejects(repo.addReport({ region: 'centro', kind: 'flood', location: '', description: '' }));
    assert.deepEqual(await repo.reports(), []);
    connection.exec('PRAGMA user_version = 2');
    await assert.rejects(migrate(db), /mais recente/);
    assert.equal((await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version'))?.user_version, 2);
  } finally { connection.close(); }
});
