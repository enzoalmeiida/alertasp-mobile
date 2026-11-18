import { Tabs } from 'expo-router';
import { Icon, colors } from '../../components/ui';

export default function TabsLayout() {
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.teal, tabBarInactiveTintColor: colors.muted, tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.line, minHeight: 70 }, tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginBottom: 6 }, tabBarItemStyle: { paddingTop: 6 } }}>
    <Tabs.Screen name="index" options={{ title: 'Início', tabBarAccessibilityLabel: 'Início', tabBarIcon: ({ focused }) => <Icon name="home" color={focused ? colors.teal : colors.muted} /> }} />
    <Tabs.Screen name="pontos" options={{ title: 'Pontos', tabBarAccessibilityLabel: 'Pontos de alagamento', tabBarIcon: ({ focused }) => <Icon name="map-pin" color={focused ? colors.teal : colors.muted} /> }} />
    <Tabs.Screen name="favoritas" options={{ title: 'Favoritas', tabBarAccessibilityLabel: 'Regiões favoritas', tabBarIcon: ({ focused }) => <Icon name="heart" color={focused ? colors.teal : colors.muted} /> }} />
  </Tabs>;
}
