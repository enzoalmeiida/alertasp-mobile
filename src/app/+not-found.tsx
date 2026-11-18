import { router } from 'expo-router';
import { Button, EmptyState, Screen } from '../components/ui';
export default function NotFound() {
  return <Screen><EmptyState title="Esta página não existe" text="Volte ao início para consultar os pontos e suas regiões favoritas." /><Button title="Voltar ao início" onPress={() => router.replace('/')} /></Screen>;
}
