import { router } from 'expo-router';
import { AppText, Button, DataState, EmptyState, FavoriteButton, Heading, Notice, PointCard, Screen, Section, StorageState, s } from '../../components/ui';
import { REGIONS, reportToOccurrence, type Region } from '../../domain/model';
import { useApp } from '../../state/AppContext';

export default function FavoritesScreen() {
  const { favorites, reports, data, loading, dataError, storageReady } = useApp();
  const notices = data.filter(point => point.category === 'active' && favorites.some(favorite => favorite.region === point.region));
  return <Screen brand><AppText style={s.kicker}>SEU DIA, SUAS REGIÕES</AppText><Heading>Regiões favoritas</Heading>
    <AppText style={s.muted}>Suas escolhas ficam salvas neste aparelho, mesmo depois de fechar o aplicativo.</AppText><StorageState />
    <Section title="Escolha o que acompanhar">{(Object.keys(REGIONS) as Region[]).map(region => <FavoriteButton key={region} region={region} />)}</Section>
    {storageReady && <AppText accessibilityLiveRegion="polite" style={s.small}>{favorites.length} {favorites.length === 1 ? 'região salva' : 'regiões salvas'} neste aparelho.</AppText>}
    <Section title="Avisos das suas regiões"><Notice title="Avisos dentro do app">Esta consulta usa o mock. Não enviamos notificações push nem alertas em tempo real.</Notice><DataState />
      {storageReady && !loading && !dataError && (notices.length ? notices.map(point => <PointCard key={point.id} point={point} />) : <EmptyState title={favorites.length ? 'Sem avisos ativos nesta base' : 'Escolha uma região acima'} text={favorites.length ? 'Ausência de registros não garante segurança. Confira sempre o contexto e a fonte.' : 'Os avisos demonstrativos da região aparecerão aqui.'} />)}
    </Section>
    <Section title="Seus relatos locais"><AppText style={s.muted}>Não validados e não enviados a um serviço público.</AppText>
      {storageReady && (reports.length ? reports.map(row => <PointCard key={row.id} point={reportToOccurrence(row)} />) : <EmptyState title="Nenhum relato salvo" text="Você pode registrar um exemplo de alagamento ou obstrução sem informar dados pessoais." />)}
      <Button title="Registrar relato" icon="edit-3" onPress={() => router.push('/relatar')} />
    </Section>
  </Screen>;
}
