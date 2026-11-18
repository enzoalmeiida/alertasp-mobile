import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../components/ui';
import { AppProvider } from '../state/AppContext';

export default function RootLayout() {
  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = 'pt-BR';
  }, []);
  return <SafeAreaProvider><AppProvider><StatusBar style="dark" /><Stack screenOptions={{ headerStyle: { backgroundColor: colors.canvas }, headerTintColor: colors.ink, headerShadowVisible: false, contentStyle: { backgroundColor: colors.canvas } }}>
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    <Stack.Screen name="ocorrencia/[id]" options={{ title: 'Detalhes do ponto' }} />
    <Stack.Screen name="relatar" options={{ title: 'Registrar relato' }} />
    <Stack.Screen name="sobre" options={{ title: 'Sobre o AlertaSP' }} />
    <Stack.Screen name="+not-found" options={{ title: 'Página não encontrada' }} />
  </Stack></AppProvider></SafeAreaProvider>;
}
