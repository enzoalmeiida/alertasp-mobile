import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { AppText, Button, Chip, DataState, EmptyState, Field, Heading, Notice, PointCard, Screen, Section, StorageState, s } from '../../components/ui';
import { CATEGORIES, REGIONS, filterOccurrences, type Category, type Region } from '../../domain/model';
import { useApp } from '../../state/AppContext';

const filterLabels: Record<Category, string> = { active: 'Ativas', historical: 'Histórico', pending: 'Relatos', sensor: 'Sensor' };
export default function PointsScreen() {
  const params = useLocalSearchParams<{ region?: string }>();
  const [region, setRegion] = useState(params.region && Object.hasOwn(REGIONS, params.region) ? params.region : 'all');
  const [category, setCategory] = useState<Category>('active');
  const [query, setQuery] = useState('');
  const [showRegions, setShowRegions] = useState(false);
  const { points, loading, dataError, reload, storageReady } = useApp();
  const localOnly = category === 'pending' && (loading || !!dataError);
  const availablePoints = localOnly ? points.filter(point => point.origin === 'local-report') : points;
  const selected = filterOccurrences(availablePoints, category, region, query);
  const canShowResults = category === 'pending' ? storageReady : !loading && !dataError;
  const regionLabel = region === 'all' ? 'Todas' : REGIONS[region as Region];
  return <Screen brand>
    <View style={s.gap}><AppText style={s.kicker}>INFORMAÇÃO LOCALIZADA</AppText><Heading>Pontos de alagamento</Heading><AppText style={s.muted}>Encontre uma via ou escolha uma região. A localização é manual, sem GPS.</AppText></View>
    <Field label="Buscar via ou bairro" value={query} onChangeText={setQuery} maxLength={120} placeholder="Ex.: Aricanduva ou Cambuci" />
    <View style={s.gap}><Button secondary title={`Região: ${regionLabel}`} label={`Região: ${regionLabel}. Filtrar por região`} icon="sliders" expanded={showRegions} onPress={() => setShowRegions(value => !value)} />
      {showRegions && <View style={s.wrap}><Chip label="Todas" selected={region === 'all'} onPress={() => { setRegion('all'); setShowRegions(false); }} />{Object.entries(REGIONS).map(([key, label]) => <Chip key={key} label={label} selected={region === key} onPress={() => { setRegion(key); setShowRegions(false); }} />)}</View>}
    </View>
    <Section title="Tipo de informação"><View style={s.wrap}>{CATEGORIES.map(key => <Chip key={key} label={filterLabels[key]} selected={category === key} onPress={() => setCategory(key)} />)}</View></Section>
    <Notice title="Mock · dados fictícios">Base de 10 a 17/11/2026, sem tempo real. Não use para decidir seu trajeto.</Notice>
    <View style={s.gap}><AppText style={s.sectionTitle}>{category === 'active' ? 'Ativas no cenário' : category === 'historical' ? 'Histórico · não são alertas atuais' : category === 'pending' ? 'Relatos · ainda não validados' : 'Sensor · leitura demonstrativa'}</AppText>
      <AppText style={s.small}>Mock CitizenTech · período de 10 a 17/11/2026. Datas dos registros no horário de São Paulo.</AppText></View>
    <DataState />
    {category === 'pending' && <StorageState />}
    {localOnly && <Notice title="Consulta parcial · relatos deste aparelho">A base demonstrativa está indisponível ou carregando. Você pode continuar consultando os relatos salvos neste aparelho.</Notice>}
    {canShowResults && <><AppText accessibilityLiveRegion="polite" style={s.small}>{selected.length} {selected.length === 1 ? 'registro encontrado' : 'registros encontrados'}{localOnly ? ' · somente relatos locais' : ''}</AppText>
      {selected.length ? selected.map(point => <PointCard key={point.id} point={point} />) : <EmptyState title={localOnly ? 'Nenhum relato local nesta consulta' : 'Nenhum ponto nesta consulta'} text={localOnly ? 'Não há relatos locais para esses filtros. Os registros da base demonstrativa ainda não estão disponíveis.' : 'Tente outra região ou busca. Não encontrar registros não significa que o local esteja seguro.'} />}</>}
    <Button secondary disabled={loading} title="Atualizar consulta ao mock" icon="refresh-cw" onPress={() => void reload()} />
  </Screen>;
}
