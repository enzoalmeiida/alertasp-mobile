import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, DataState, DemoNotice, EmptyState, Icon, Notice, PointCard, Screen, Section, colors, s } from '../../components/ui';
import { useApp } from '../../state/AppContext';

export default function HomeScreen() {
  const { data, favorites, dataError, loading } = useApp();
  const active = data.filter(point => point.category === 'active');
  const favoritesActive = active.filter(point => favorites.some(favorite => favorite.region === point.region));
  return <Screen brand>
    <AppText style={s.kicker}>SÃO PAULO · CONSULTA MANUAL</AppText>
    <View style={home.hero}>
      <View style={s.row}><Icon name="navigation" color="#8FE0CB" /><AppText style={home.heroLabel}>ANTES DE SAIR</AppText></View>
      <AppText accessibilityRole="header" style={home.title}>Como está{ '\n' }seu caminho?</AppText>
      <AppText style={home.subtitle}>Consulte pontos, confira a fonte e acompanhe suas regiões.</AppText>
      <View style={home.stat}><AppText style={home.number}>{loading || dataError ? '—' : active.length.toString().padStart(2, '0')}</AppText><AppText style={home.statLabel}>ocorrências ativas{ '\n' }no cenário fictício</AppText></View>
      <Button title="Consultar pontos" icon="arrow-right" onPress={() => router.push('/pontos')} />
    </View>
    <DemoNotice />
    <DataState />
    <Section title="Suas regiões, por perto">
      {!favorites.length ? <><EmptyState title="O que importa para você" text="Salve uma região para reunir os avisos dela. Não precisamos da sua localização." /><Button secondary title="Escolher regiões favoritas" icon="heart" onPress={() => router.push('/favoritas')} /></>
        : !loading && !dataError && (favoritesActive.length ? favoritesActive.map(point => <PointCard key={point.id} point={point} />) : <EmptyState title="Sem registros ativos nesta base" text="Isso não significa que as ruas estejam seguras. A base é limitada e demonstrativa." />)}
    </Section>
    <Notice title="Na dúvida, não atravesse" tone="warning">Não tente atravessar uma área alagada. Este protótipo não substitui orientações da Defesa Civil.</Notice>
    <Button secondary title="Registrar um relato local" icon="edit-3" onPress={() => router.push('/relatar')} />
  </Screen>;
}
const home = StyleSheet.create({
  hero: { backgroundColor: colors.ink, borderRadius: 26, padding: 24, gap: 18 },
  heroLabel: { color: '#B4D9D0', fontSize: 12, fontWeight: '700', letterSpacing: 1.4 },
  title: { fontSize: 36, lineHeight: 43, fontWeight: '800', color: colors.white, letterSpacing: -1.1 },
  subtitle: { color: '#D5E6E1', fontSize: 16, lineHeight: 25 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 16, borderTopColor: '#45636B', borderTopWidth: 1, paddingTop: 16 },
  number: { fontSize: 46, lineHeight: 54, color: '#A6E5CC', fontWeight: '700', letterSpacing: -1 },
  statLabel: { color: '#D5E6E1', fontSize: 14, lineHeight: 22, flex: 1 },
});
