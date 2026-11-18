import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { reportToOccurrence, type Favorite, type Occurrence, type Region, type ReportDraft, type ReportRow, type Scenario } from '../domain/model';
import { loadOccurrences } from '../services/occurrences';
import { getRepository } from '../storage/database';

function useAppState() {
  const [data, setData] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState('');
  const [scenario, setScenario] = useState<Scenario>('normal');
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [requestVersion, setRequestVersion] = useState(0);
  const [storageVersion, setStorageVersion] = useState(0);

  useEffect(() => {
    let current = true;
    loadOccurrences(scenario).then(result => {
      if (current) { setData(result); setLoading(false); }
    }).catch(error => {
      if (current) {
        setData([]); setLoading(false);
        setDataError(error instanceof Error ? error.message : 'Não foi possível consultar os pontos.');
      }
    });
    return () => { current = false; };
  }, [scenario, requestVersion]);

  useEffect(() => {
    let current = true;
    getRepository().then(async repo => {
      const [savedFavorites, savedReports] = await Promise.all([repo.favorites(), repo.reports()]);
      if (current) { setFavorites(savedFavorites); setReports(savedReports); setStorageError(''); setStorageReady(true); }
    }).catch(() => {
      if (current) { setStorageReady(false); setStorageError('Não foi possível abrir os dados salvos. Tente novamente; não limpe os dados do aplicativo.'); }
    });
    return () => { current = false; };
  }, [storageVersion]);

  function reload() { setLoading(true); setDataError(''); setRequestVersion(value => value + 1); }
  function changeScenario(value: Scenario) { setScenario(value); reload(); }
  function refreshLocal() { setStorageReady(false); setStorageError(''); setStorageVersion(value => value + 1); }

  async function setFavorite(region: Region, selected: boolean) {
    const repo = await getRepository();
    await repo.setFavorite(region, selected);
    setFavorites(await repo.favorites());
  }
  async function addReport(input: ReportDraft) {
    const repo = await getRepository();
    const id = await repo.addReport(input);
    setReports(await repo.reports());
    return id;
  }
  async function removeReport(id: number) {
    const repo = await getRepository();
    await repo.removeReport(id);
    setReports(await repo.reports());
  }
  const points = useMemo(() => [...data, ...reports.map(reportToOccurrence)], [data, reports]);
  return { data, points, loading, dataError, reload, scenario, setScenario: changeScenario, favorites, reports, storageReady, storageError, refreshLocal, setFavorite, addReport, removeReport };
}

const AppContext = createContext<ReturnType<typeof useAppState> | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const state = useAppState();
  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
}
export function useApp() {
  const state = useContext(AppContext);
  if (!state) throw new Error('AppProvider não encontrado.');
  return state;
}
