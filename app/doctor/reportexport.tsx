import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReportExportScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleExport = (type: "PDF" | "Excel") => {
    setLoading(true);
    // Simulare generare raport medical (Sarcina 8)
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Succes",
        `Raportul medical ${type} a fost generat și salvat în arhiva clinicii pentru pacientul selectat.`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Export Rapoarte</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Sarcina 8: Generare Raport</Text>
          <Text style={styles.infoText}>
            Selectează formatul pentru a exporta istoricul medical complet al perioadei de monitorizare.
          </Text>
        </View>

        <View style={styles.optionsStack}>
          {/* Opțiune PDF */}
          <TouchableOpacity 
            style={styles.exportCard} 
            onPress={() => handleExport("PDF")}
            disabled={loading}
          >
            <View style={[styles.iconBox, { backgroundColor: "#fee2e2" }]}>
              <Ionicons name="file-tray-full" size={28} color="#ef4444" />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.cardTitle}>Format PDF (.pdf)</Text>
              <Text style={styles.cardSubtitle}>Ideal pentru printare și arhivă oficială</Text>
            </View>
            {loading ? <ActivityIndicator color="#0f172a" /> : <Ionicons name="download" size={20} color="#94a3b8" />}
          </TouchableOpacity>

          {/* Opțiune Excel */}
          <TouchableOpacity 
            style={styles.exportCard} 
            onPress={() => handleExport("Excel")}
            disabled={loading}
          >
            <View style={[styles.iconBox, { backgroundColor: "#dcfce7" }]}>
              <Ionicons name="grid" size={28} color="#22c55e" />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.cardTitle}>Format Excel (.xlsx)</Text>
              <Text style={styles.cardSubtitle}>Pentru analiză de date și tabele</Text>
            </View>
            {loading ? <ActivityIndicator color="#0f172a" /> : <Ionicons name="download" size={20} color="#94a3b8" />}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { 
    backgroundColor: "#0f172a", 
    padding: 20, 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 15 
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "800" },
  content: { padding: 20 },
  infoBox: { 
    backgroundColor: "#fff", 
    padding: 18, 
    borderRadius: 15, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0" 
  },
  infoTitle: { fontSize: 16, fontWeight: "800", color: "#0f172a", marginBottom: 5 },
  infoText: { color: "#64748b", lineHeight: 22 },
  optionsStack: { gap: 12 },
  exportCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    gap: 15,
    elevation: 2,
  },
  iconBox: { width: 50, height: 50, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  textWrap: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  cardSubtitle: { fontSize: 13, color: "#64748b" },
});