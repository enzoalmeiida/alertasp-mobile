import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CATEGORY_LABELS, REGIONS, formatDate, isStale, type Category, type Occurrence, type Region } from '../domain/model';
import { useApp } from '../state/AppContext';

export const colors = { ink: '#17333C', muted: '#50656D', teal: '#086C62', pale: '#E4F3ED', canvas: '#F3F6F5', line: '#D4DFDB', white: '#FFFFFF', red: '#9D2931', amber: '#755000' };
type IconName = ComponentProps<typeof Feather>['name'];
export function Icon({ name, size = 22, color = colors.teal }: { name: IconName; size?: number; color?: ComponentProps<typeof Feather>['color'] }) {
  return <Feather name={name} size={size} color={color} accessible={false} aria-hidden />;
}
export function AppText({ style, ...props }: TextProps) { return <Text {...props} style={[s.text, style]} />; }
export function Heading({ children }: { children: ReactNode }) { return <AppText accessibilityRole="header" style={s.heading}>{children}</AppText>; }
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return <View style={s.section}><AppText accessibilityRole="header" style={s.sectionTitle}>{title}</AppText>{children}</View>;
}
export function Screen({ children, brand = false }: { children: ReactNode; brand?: boolean }) {
  return <SafeAreaView style={s.safe} edges={brand ? ['top', 'left', 'right'] : ['left', 'right']}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.content}>
      {brand && <View style={s.brandRow}><View style={s.row}><View style={s.brandIcon}><Icon name="cloud-rain" color={colors.white} /></View><AppText style={s.brand}>AlertaSP</AppText></View>
        <Pressable accessibilityRole="button" accessibilityLabel="Sobre o AlertaSP e os dados" style={s.iconButton} onPress={() => router.push('/sobre')}><Icon name="info" color={colors.ink} /></Pressable>
      </View>}
      {children}
      <AppText style={s.footer}>Informação com contexto. Cuidado em cada caminho.</AppText>
    </ScrollView>
  </SafeAreaView>;
}
export function Button({ title, onPress, secondary = false, danger = false, disabled = false, busy = false, icon, label, expanded }: {
  title: string; onPress: () => void; secondary?: boolean; danger?: boolean; disabled?: boolean; busy?: boolean; icon?: IconName; label?: string; expanded?: boolean;
}) {
  const foreground = secondary ? (danger ? colors.red : colors.teal) : colors.white;
  return <Pressable accessibilityRole="button" accessibilityLabel={label ?? title} accessibilityState={{ disabled: disabled || busy, busy, expanded }} disabled={disabled || busy} onPress={onPress}
    style={({ pressed }) => [s.button, secondary ? s.secondary : s.primary, danger && !secondary && { backgroundColor: colors.red }, (disabled || busy) && { opacity: 0.55 }, pressed && { opacity: 0.8 }]}>
    {busy ? <ActivityIndicator accessibilityLabel="Processando solicitação" color={foreground} /> : icon && <Icon name={icon} color={foreground} size={20} />}
    <AppText style={[s.buttonText, { color: foreground }]}>{title}</AppText>
  </Pressable>;
}
export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={({ pressed }) => [s.chip, selected && s.selectedChip, pressed && { opacity: 0.75 }]}>
    <AppText style={[s.chipText, selected && { color: colors.white }]}>{label}</AppText>
  </Pressable>;
}
export function Notice({ title, children, tone = 'info' }: { title: string; children?: ReactNode; tone?: 'info' | 'warning' | 'error' }) {
  const toneColor = tone === 'error' ? colors.red : tone === 'warning' ? colors.amber : colors.teal;
  return <View style={[s.notice, { backgroundColor: tone === 'error' ? '#FFF0ED' : tone === 'warning' ? '#FFF5DC' : colors.pale }]}>
    <Icon name={tone === 'warning' ? 'alert-triangle' : tone === 'error' ? 'alert-circle' : 'info'} color={toneColor} size={19} />
    <View style={s.flex}><AppText style={[s.noticeTitle, { color: toneColor }]}>{title}</AppText>{children && <AppText style={s.small}>{children}</AppText>}</View>
  </View>;
}
export function DemoNotice() { return <Notice title="Demonstração · sem dados em tempo real">Ocorrências fictícias para conhecer o app. Não use esta base para decidir seu trajeto.</Notice>; }
export function EmptyState({ title, text }: { title: string; text: string }) {
  return <View style={s.empty}><Icon name="map-pin" size={28} /><AppText style={s.sectionTitle}>{title}</AppText><AppText style={[s.muted, { textAlign: 'center' }]}>{text}</AppText></View>;
}
export function DataState() {
  const { loading, dataError, reload } = useApp();
  if (loading) return <View style={s.loading} accessibilityLiveRegion="polite"><ActivityIndicator accessibilityLabel="Consultando pontos" color={colors.teal} /><AppText>Consultando o mock…</AppText></View>;
  if (dataError) return <View style={s.gap} accessibilityLiveRegion="polite"><Notice title="Não foi possível consultar" tone="error">{dataError}</Notice><Button secondary title="Tentar novamente" onPress={() => void reload()} icon="refresh-cw" /></View>;
  return null;
}
export function StorageState() {
  const { storageReady, storageError, refreshLocal } = useApp();
  if (storageReady) return null;
  if (!storageError) return <AppText accessibilityLiveRegion="polite" style={s.muted}>Abrindo os dados salvos…</AppText>;
  return <View style={s.gap}><Notice tone="error" title="Dados locais indisponíveis">{storageError}</Notice><Button secondary title="Tentar abrir dados salvos" onPress={() => void refreshLocal()} /></View>;
}
const categoryStyles: Record<Category, { color: string; background: string; icon: IconName }> = {
  active: { color: colors.red, background: '#FDEBE8', icon: 'alert-triangle' },
  historical: { color: '#435B69', background: '#EBF0F3', icon: 'clock' },
  pending: { color: colors.amber, background: '#FFF3D2', icon: 'message-circle' },
  sensor: { color: '#5C4384', background: '#F0EAFA', icon: 'radio' },
};
export function CategoryBadge({ category }: { category: Category }) {
  const config = categoryStyles[category];
  return <View style={[s.badge, { backgroundColor: config.background }]}><Icon name={config.icon} color={config.color} size={15} /><AppText style={[s.badgeText, { color: config.color }]}>{CATEGORY_LABELS[category]}</AppText></View>;
}
export function PointCard({ point }: { point: Occurrence }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`Ver detalhes de ${point.location}. ${CATEGORY_LABELS[point.category]}. ${REGIONS[point.region]}. ${point.source}. ${formatDate(point.updatedAt)}`}
    onPress={() => router.push({ pathname: '/ocorrencia/[id]', params: { id: point.id } })} style={({ pressed }) => [s.card, pressed && { backgroundColor: '#EAF1ED' }]}>
    <View style={s.wrapBetween}><CategoryBadge category={point.category} /><AppText style={s.small}>{REGIONS[point.region]}</AppText></View>
    <View style={s.row}><View style={s.flex}><AppText style={s.cardTitle}>{point.location}</AppText><AppText style={s.muted}>{point.neighborhood}</AppText></View><Icon name="arrow-up-right" size={22} /></View>
    <View style={s.cardMeta}><AppText style={s.small}>{point.origin === 'mock' ? 'Mock · exemplo fictício' : 'Relato salvo neste aparelho'}</AppText><AppText style={s.small}>{formatDate(point.updatedAt)} · BRT</AppText>
      {isStale(point.updatedAt) && <AppText style={[s.small, { color: colors.amber }]}>Registro antigo · confira o contexto</AppText>}
    </View>
  </Pressable>;
}
export function FavoriteButton({ region }: { region: Region }) {
  const { favorites, setFavorite, storageReady } = useApp();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const selected = favorites.some(item => item.region === region);
  async function toggle() {
    setBusy(true); setError('');
    try { await setFavorite(region, !selected); } catch { setError('Não foi possível salvar. Tente novamente.'); } finally { setBusy(false); }
  }
  return <View style={s.gap}><Button secondary={!selected} disabled={!storageReady} busy={busy} icon={selected ? 'check' : 'heart'} title={`${REGIONS[region]}${selected ? ' · salva' : ''}`}
    label={`${selected ? 'Remover' : 'Salvar'} ${REGIONS[region]} ${selected ? 'das' : 'nas'} favoritas`} onPress={() => void toggle()} />
    {!!error && <AppText accessibilityRole="alert" style={s.error}>{error}</AppText>}</View>;
}
export function Field({ label, value, onChangeText, error, multiline = false, maxLength, placeholder }: {
  label: string; value: string; onChangeText: (text: string) => void; error?: string; multiline?: boolean; maxLength: number; placeholder?: string;
}) {
  return <View style={s.gap}><AppText style={s.label}>{label}</AppText><TextInput accessibilityLabel={label} accessibilityHint={error || undefined} placeholder={placeholder} placeholderTextColor={colors.muted} value={value} onChangeText={onChangeText} maxLength={maxLength} multiline={multiline}
    style={[s.input, multiline && { minHeight: 120, textAlignVertical: 'top' }, !!error && { borderColor: colors.red }]} />
    {!!error && <AppText accessibilityRole="alert" style={s.error}>{error}</AppText>}</View>;
}
export const s = StyleSheet.create({
  text: { fontSize: 16, lineHeight: 24, color: colors.ink },
  safe: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: 20, paddingBottom: 36, gap: 20, width: '100%', maxWidth: 720, alignSelf: 'center' },
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 2 },
  brandIcon: { borderRadius: 13, padding: 10, backgroundColor: colors.teal },
  brand: { fontSize: 24, fontWeight: '800', letterSpacing: -0.8, lineHeight: 32 },
  iconButton: { minHeight: 48, minWidth: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  heading: { fontSize: 30, lineHeight: 38, fontWeight: '800', letterSpacing: -0.8 },
  section: { gap: 12 }, sectionTitle: { fontSize: 20, lineHeight: 28, fontWeight: '700', letterSpacing: -0.3 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  wrapBetween: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'space-between' },
  flex: { flex: 1, gap: 4 }, gap: { gap: 8 }, muted: { color: colors.muted },
  small: { fontSize: 13, lineHeight: 20, color: colors.muted },
  kicker: { fontSize: 12, lineHeight: 18, fontWeight: '700', color: colors.teal, letterSpacing: 1.1 },
  card: { backgroundColor: colors.white, borderRadius: 20, borderWidth: 1, borderColor: colors.line, padding: 18, gap: 16 },
  cardTitle: { fontSize: 20, fontWeight: '700', lineHeight: 28 },
  cardMeta: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10, gap: 2 },
  button: { minHeight: 52, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1 },
  primary: { backgroundColor: colors.teal, borderColor: colors.teal },
  secondary: { backgroundColor: colors.white, borderColor: colors.line },
  buttonText: { fontSize: 16, fontWeight: '700', textAlign: 'center', flexShrink: 1 },
  chip: { minHeight: 48, borderRadius: 24, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 16, paddingVertical: 12, justifyContent: 'center', backgroundColor: colors.white },
  selectedChip: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { fontSize: 14, lineHeight: 22, fontWeight: '600' },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: 14 },
  noticeTitle: { fontSize: 14, lineHeight: 21, fontWeight: '700' },
  empty: { padding: 26, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.line, borderRadius: 18, alignItems: 'center', gap: 12, backgroundColor: colors.white },
  loading: { padding: 24, flexDirection: 'row', gap: 10, justifyContent: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8, gap: 6, flexShrink: 1 },
  badgeText: { fontSize: 12, lineHeight: 18, fontWeight: '700', flexShrink: 1 },
  input: { backgroundColor: colors.white, borderWidth: 1, borderColor: '#829A90', borderRadius: 14, minHeight: 54, padding: 14, fontSize: 16, lineHeight: 24, color: colors.ink },
  label: { fontWeight: '700', fontSize: 15 },
  error: { color: colors.red, fontSize: 14, lineHeight: 21 },
  footer: { textAlign: 'center', fontSize: 12, lineHeight: 18, color: colors.muted, paddingTop: 12 },
});
