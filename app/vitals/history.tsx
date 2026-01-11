import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { HeartRateEntry } from "./heart-rate";

const STORAGE_KEY = "heartRateHistory";

export default function HeartRateHistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<HeartRateEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadHistory = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed: HeartRateEntry[] = stored ? JSON.parse(stored) : [];
      setHistory(parsed);
    } catch {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const chartData = useMemo(() => {
    return [...history].slice(0, 10).reverse();
  }, [history]);

  const chartStats = useMemo(() => {
    if (!chartData.length) {
      return { max: 120, min: 50, range: 70 };
    }
    const max = Math.max(...chartData.map(e => e.bpm));
    const min = Math.min(...chartData.map(e => e.bpm));
    const range = Math.max(1, max - min);
    return { max, min, range };
  }, [chartData]);

  const renderItem = ({ item }: { item: HeartRateEntry }) => {
    const date = new Date(item.timestamp);
    return (
      <View style={styles.listRow}>
        <View style={styles.rowLeft}>
          <Text style={styles.rowBPM}>{item.bpm} BPM</Text>
          <Text style={styles.rowMeta}>
            {date.toLocaleDateString("ro-RO")} · {date.toLocaleTimeString("ro-RO")}
          </Text>
        </View>
        <View style={styles.chip}>
          <Ionicons name="pulse" size={14} color="#0f172a" />
          <Text style={styles.chipText}>{item.quality}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Istoric puls</Text>
          <TouchableOpacity
            onPress={() => router.push("/vitals/heart-rate")}
            style={styles.headerAction}
          >
            <Ionicons name="pulse" size={22} color="#0f172a" />
          </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loaderText}>Se încarcă istoricul...</Text>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={64} color="#cbd5e1" />
          <Text style={styles.emptyTitle}>Nicio măsurătoare salvată</Text>
          <Text style={styles.emptyText}>
            Salvează rezultatele măsurătorilor pentru a vedea evoluția în timp.
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>Grafic ultime măsurători</Text>
                <Text style={styles.cardSubtitle}>Primele 10 valori salvate</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={styles.legend}>
                  <View style={[styles.legendDot, { backgroundColor: "#3b82f6" }]} />
                  <Text style={styles.legendText}>BPM</Text>
                </View>
              </View>
            </View>
            <View style={styles.chartBox}>
              <View style={styles.chartGrid}>
                {[0.25, 0.5, 0.75].map(level => (
                  <View key={level} style={[styles.gridLine, { top: level * 220 }]} />
                ))}
              </View>
              <View style={styles.barsRow}>
                {chartData.map((entry, idx) => {
                  const normalized = (entry.bpm - chartStats.min) / chartStats.range;
                  const height = 50 + normalized * 120;
                  return (
                    <View key={entry.id || idx.toString()} style={styles.barWrapper}>
                      <View style={[styles.bar, { height }]} />
                      <Text style={styles.barLabel}>{entry.bpm}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Detalii măsurători</Text>
              <Text style={styles.cardSubtitle}>{history.length} înregistrări</Text>
            </View>
            <FlatList
              data={history}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={{ paddingVertical: 6 }}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  headerAction: {
    padding: 8,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loaderText: {
    fontSize: 15,
    color: "#475569",
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
  },
  emptyText: {
    textAlign: "center",
    color: "#475569",
    fontSize: 15,
    lineHeight: 22,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0f172a",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "600",
  },
  monitorButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  monitorButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },
  chartBox: {
    height: 220,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingTop: 10,
    overflow: "hidden",
  },
  chartGrid: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    top: undefined,
  },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 10,
    height: "100%",
  },
  barWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
  },
  bar: {
    width: "100%",
    maxWidth: 26,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
  },
  barLabel: {
    fontSize: 12,
    color: "#0f172a",
    fontWeight: "700",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  rowLeft: {
    gap: 4,
  },
  rowBPM: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0f172a",
  },
  rowMeta: {
    fontSize: 13,
    color: "#475569",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#e2e8f0",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0f172a",
    textTransform: "capitalize",
  },
  separator: {
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    elevation: 4,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});
