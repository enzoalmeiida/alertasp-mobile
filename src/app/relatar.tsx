import { router } from 'expo-router';
import { useState } from 'react';
import { AccessibilityInfo, View } from 'react-native';
import { AppText, Button, Chip, Field, Heading, Notice, Screen, Section, StorageState, s } from '../components/ui';
import { REGIONS, validateReport, type ReportDraft } from '../domain/model';
import { useApp } from '../state/AppContext';

export default function ReportScreen() {
  const { storageReady, addReport } = useApp();
  const [draft, setDraft] = useState<ReportDraft>({ region: '', kind: '', location: '', description: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof ReportDraft, string>>>({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [savedId, setSavedId] = useState<number>();
  function update(key: keyof ReportDraft, value: string) { setDraft(previous => ({ ...previous, [key]: value })); setErrors(previous => ({ ...previous, [key]: undefined })); }
  async function save() {
    const validation = validateReport(draft);
    setErrors(validation); setError('');
    if (Object.keys(validation).length) { AccessibilityInfo.announceForAccessibility('Revise os campos indicados antes de salvar.'); return; }
    setBusy(true);
    try { setSavedId(await addReport(draft)); AccessibilityInfo.announceForAccessibility('Relato salvo neste aparelho.'); }
    catch { setError('Não foi possível salvar o relato. Seus campos foram mantidos. Tente novamente.'); }
    finally { setBusy(false); }
  }
  if (savedId !== undefined) return <Screen><Notice title="Relato salvo neste aparelho">O registro permanece após fechar o app. Ele continua pendente e não foi enviado a nenhum serviço.</Notice>
    <Heading>Obrigado por registrar.</Heading><AppText>Você pode consultar ou excluir o relato em Favoritas.</AppText>
    <Button title="Ver relato salvo" onPress={() => router.replace({ pathname: '/ocorrencia/[id]', params: { id: `local-${savedId}` } })} />
    <Button secondary title="Ir para favoritas" onPress={() => router.replace('/favoritas')} /></Screen>;
  return <Screen><Heading>O que você observou?</Heading><Notice title="Um registro local, sem envio público" tone="warning">Use somente exemplos fictícios nesta demonstração. Não informe nomes, telefones, endereço residencial ou outros dados pessoais. Este não é um canal de emergência.</Notice><StorageState />
    <Section title="Tipo de situação"><View style={s.wrap}><Chip label="Alagamento" selected={draft.kind === 'flood'} onPress={() => update('kind', 'flood')} /><Chip label="Boca de lobo obstruída" selected={draft.kind === 'drain'} onPress={() => update('kind', 'drain')} /></View>{errors.kind && <AppText accessibilityRole="alert" style={s.error}>{errors.kind}</AppText>}</Section>
    <Section title="Região"><View style={s.wrap}>{Object.entries(REGIONS).map(([key, label]) => <Chip key={key} label={label} selected={draft.region === key} onPress={() => update('region', key)} />)}</View>{errors.region && <AppText accessibilityRole="alert" style={s.error}>{errors.region}</AppText>}</Section>
    <Field label="Local aproximado" placeholder="Ex.: Praça fictícia, perto do ponto de ônibus" value={draft.location} onChangeText={value => update('location', value)} error={errors.location} maxLength={120} />
    <Field label="Descrição da situação" placeholder="Descreva um exemplo sem dados pessoais." value={draft.description} onChangeText={value => update('description', value)} error={errors.description} multiline maxLength={280} />
    <AppText style={s.small}>{draft.description.length}/280 caracteres · sem coleta de GPS</AppText>
    {Object.keys(errors).some(key => errors[key as keyof ReportDraft]) && <AppText accessibilityRole="alert" style={s.error}>Revise os campos indicados antes de salvar.</AppText>}
    {!!error && <AppText accessibilityRole="alert" style={s.error}>{error}</AppText>}
    <Button title="Salvar neste aparelho" icon="save" busy={busy} disabled={!storageReady} onPress={() => void save()} />
  </Screen>;
}
