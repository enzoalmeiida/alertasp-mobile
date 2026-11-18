import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { AppText, Button, CategoryBadge, DataState, DemoNotice, EmptyState, FavoriteButton, Heading, Notice, Screen, Section, StorageState, s } from '../../components/ui';
import { REGIONS, formatDate, isStale } from '../../domain/model';
import { useApp } from '../../state/AppContext';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { points, loading, dataError, storageReady, removeReport } = useApp();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const point = points.find(item => item.id === id);
  if (!point) return <Screen><DataState />{id?.startsWith('local-') && <StorageState />}{!loading && !dataError && (!id?.startsWith('local-') || storageReady) && <EmptyState title="Ponto não encontrado" text="O registro não existe nesta base ou foi removido. Volte para consultar outros pontos." />}<Button title="Voltar para pontos" onPress={() => router.replace('/pontos')} /></Screen>;
  async function remove() {
    setBusy(true); setError('');
    try { await removeReport(Number(id.replace('local-', ''))); router.replace('/favoritas'); }
    catch { setError('Não foi possível excluir o relato. Tente novamente.'); setBusy(false); }
  }
  return <Screen>
    <CategoryBadge category={point.category} /><Heading>{point.location}</Heading><AppText style={s.muted}>{point.neighborhood} · {REGIONS[point.region]}</AppText>
    {point.origin === 'mock' ? <DemoNotice /> : <Notice title="Relato salvo somente neste aparelho" tone="warning">Não validado, não enviado e não confirmado por uma autoridade. Não é um chamado de emergência.</Notice>}
    <View style={s.card}><Section title="De onde vem a informação"><AppText>{point.source}</AppText><AppText style={s.label}>{point.origin === 'local-report' ? 'Registrado em' : 'Data do registro fictício'}</AppText><AppText>{formatDate(point.updatedAt)} · São Paulo</AppText>
      <AppText style={s.small}>{point.origin === 'mock' ? 'Período do mock: 10 a 17/11/2026. Consultar novamente não altera a data original.' : 'A data indica a gravação local, não uma validação da ocorrência.'}</AppText>
    </Section></View>
    {isStale(point.updatedAt) && <Notice title="Registro antigo ou fora do período atual" tone="warning">Este registro tem mais de uma hora ou uma data futura. Não representa condições atuais. O limite de uma hora é uma regra didática.</Notice>}
    <Section title="Entenda este registro"><AppText>{point.description}</AppText>{point.sensorReading && <Notice title={point.sensorReading}>Sem sensor físico. Esta leitura não confirma alagamento.</Notice>}</Section>
    <Notice title="A ausência de registro não garante segurança">Não atravesse áreas alagadas. Considere orientações oficiais e condições visíveis no local.</Notice>
    <Section title="Acompanhar esta região"><StorageState /><FavoriteButton region={point.region} /></Section>
    {point.origin === 'local-report' && <View style={s.gap}>
      {!confirm ? <Button secondary danger title="Excluir este relato local" onPress={() => setConfirm(true)} /> : <><Notice title="Excluir definitivamente?" tone="warning">O relato será removido deste aparelho.</Notice><Button danger busy={busy} title="Confirmar exclusão" onPress={() => void remove()} /><Button secondary disabled={busy} title="Cancelar exclusão" onPress={() => setConfirm(false)} /></>}
      {!!error && <AppText accessibilityRole="alert" style={s.error}>{error}</AppText>}
    </View>}
    <Button secondary title="Voltar para pontos" onPress={() => router.replace('/pontos')} />
  </Screen>;
}
