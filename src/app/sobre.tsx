import { router } from 'expo-router';
import { View } from 'react-native';
import { AppText, Button, Chip, DemoNotice, Heading, Notice, Screen, Section, s } from '../components/ui';
import { type Scenario } from '../domain/model';
import { useApp } from '../state/AppContext';

export default function AboutScreen() {
  const { scenario, setScenario } = useApp();
  const options: { key: Scenario; label: string }[] = [{ key: 'normal', label: 'Normal' }, { key: 'empty', label: 'Sem dados' }, { key: 'error', label: 'Falha de consulta' }, { key: 'stale', label: 'Base antiga' }];
  return <Screen><AppText style={s.kicker}>CITIZENTECH · FIAP 2026.2</AppText><Heading>Informação que faz sentido.</Heading><AppText>O AlertaSP ajuda a consultar pontos de alagamento por região, entendendo de onde vem cada registro e quando ele foi atualizado.</AppText><DemoNotice />
    <Section title="Origem e período"><AppText>Mock CitizenTech com seis exemplos fictícios de 10 a 17/11/2026. Nomes de vias dão contexto à demonstração, sem afirmar ocorrências reais nesses locais.</AppText><AppText>Não consumimos dados oficiais do CGE ou do GeoSampa. Não há integração com sensores físicos, API SOA ou serviço de emergência.</AppText></Section>
    <Section title="Cada informação no seu lugar"><AppText>• Ativa: apenas no cenário fictício.{ '\n' }• Histórico: inativa, sem representar o presente.{ '\n' }• Relato: pendente e não validado.{ '\n' }• Sensor: leitura inteiramente simulada.</AppText></Section>
    <Section title="Sua privacidade"><AppText>Sem login, GPS, fotos ou contatos. Favoritas e relatos ficam em um banco SQLite neste aparelho. Não são transmitidos. Desinstalar o app ou apagar seus dados remove esses registros.</AppText><AppText>Na versão web, o banco fica no armazenamento deste navegador. Limpar os dados do site também remove as informações.</AppText></Section>
    <Section title="Explorar os estados da demonstração"><AppText style={s.muted}>Veja como o app se comporta com uma base vazia, falha ou dados antigos. Isso não altera suas favoritas nem relatos salvos.</AppText><View style={s.wrap}>{options.map(option => <Chip key={option.key} label={option.label} selected={scenario === option.key} onPress={() => setScenario(option.key)} />)}</View><AppText accessibilityLiveRegion="polite" style={s.small}>Cenário selecionado: {options.find(option => option.key === scenario)?.label}. A seleção vale até reiniciar o app.</AppText><Button title="Consultar cenário selecionado" onPress={() => router.push('/pontos')} /></Section>
    <Notice title="Consulta manual, sem promessas de segurança">A ausência de registro não significa rua segura. Não atravesse uma área alagada. As orientações oficiais têm prioridade.</Notice>
  </Screen>;
}
