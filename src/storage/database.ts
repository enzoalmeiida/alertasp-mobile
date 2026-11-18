import { openDatabaseAsync } from 'expo-sqlite';
import { createRepository, migrate } from './repository';

let pending: Promise<ReturnType<typeof createRepository>> | undefined;
export function getRepository() {
  if (!pending) {
    pending = openDatabaseAsync('alertasp.db').then(async db => {
      await migrate(db);
      return createRepository(db);
    }).catch(error => { pending = undefined; throw error; });
  }
  return pending;
}
