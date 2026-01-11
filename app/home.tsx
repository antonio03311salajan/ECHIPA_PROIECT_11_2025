import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type NavCard = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
};

const vitalsCards: NavCard[] = [
  {
    title: "Monitorizeaza pulsul",
    subtitle: "Foloseste camera pentru masurare rapida",
    icon: "heart",
    route: "/vitals/heart-rate",
    color: "#ef4444",
  },
  {
    title: "Istoric masuratori",
    subtitle: "Vezi ultimele rezultate salvate",
    icon: "stats-chart",
    route: "/vitals/history",
    color: "#22c55e",
  },
  {
    title: "Hub functii vitale",
    subtitle: "Navigheaza catre toate optiunile",
    icon: "pulse",
    route: "/vitals",
    color: "#3b82f6",
  },
];

const planningCards: NavCard[] = [
  {
    title: "Consultatii",
    subtitle: "Adauga si vezi programarile in calendar",
    icon: "calendar",
    route: "/consultations",
    color: "#f59e0b",
  },
];

export default function HomeHub() {
  const router = useRouter();

  const renderCard = (card: NavCard) => (
    <TouchableOpacity
      key={card.route}
      style={[styles.card, { borderLeftColor: card.color }]}
      activeOpacity={0.85}
      onPress={() => router.push(card.route as any)}
    >
      <View style={[styles.iconWrap, { backgroundColor: card.color + "20" }]}> 
        <Ionicons name={card.icon} size={28} color={card.color} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.cardTitle}>{card.title}</Text>
        <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>Navigare rapida</Text>
            <Text style={styles.title}>Panou principal</Text>
            <Text style={styles.subtitle}>
              Alege mai jos zona in care vrei sa continui dupa autentificare.
            </Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={18} color="#0f172a" />
            <Text style={styles.badgeText}>Ses. activa</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Monitorizare</Text>
        <View style={styles.stack}>{vitalsCards.map(renderCard)}</View>

        <Text style={styles.sectionLabel}>Programari</Text>
        <View style={styles.stack}>{planningCards.map(renderCard)}</View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 20,
    gap: 14,
  },
  header: {
    backgroundColor: "#0f172a",
    borderRadius: 20,
    padding: 18,
    gap: 10,
    position: "relative",
  },
  kicker: {
    color: "#cbd5e1",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    color: "#e2e8f0",
    marginTop: 4,
    lineHeight: 20,
  },
  badge: {
    position: "absolute",
    right: 14,
    top: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontWeight: "700",
    color: "#0f172a",
    fontSize: 12,
  },
  sectionLabel: {
    marginTop: 6,
    marginBottom: 4,
    color: "#334155",
    fontWeight: "700",
    fontSize: 13,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  stack: {
    gap: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderLeftWidth: 4,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
  },
  cardSubtitle: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 18,
  },
});
