import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type VitalMeasurement = {
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  temperature: number;
  timestamp: string;
};

type Patient = {
  id: string;
  name: string;
  age: number;
  condition: string;
  lastMeasurement?: VitalMeasurement;
  status: "normal" | "warning" | "critical";
  avatar: string;
  isPriority?: boolean;
};

// Date demo pentru pacienți
const MOCK_PATIENTS: Patient[] = [
  {
    id: "p1",
    name: "Ion Popescu",
    age: 65,
    condition: "Hipertensiune",
    lastMeasurement: {
      heartRate: 85,
      bloodPressure: { systolic: 145, diastolic: 92 },
      temperature: 36.8,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    status: "warning",
    avatar: "👨",
  },
  {
    id: "p2",
    name: "Maria Ionescu",
    age: 58,
    condition: "Diabet tip 2",
    lastMeasurement: {
      heartRate: 72,
      bloodPressure: { systolic: 128, diastolic: 82 },
      temperature: 36.6,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    status: "normal",
    avatar: "👩",
  },
  {
    id: "p3",
    name: "George Dumitrescu",
    age: 72,
    condition: "Aritmie",
    lastMeasurement: {
      heartRate: 115,
      bloodPressure: { systolic: 168, diastolic: 105 },
      temperature: 37.2,
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    status: "critical",
    avatar: "👴",
  },
  {
    id: "p4",
    name: "Elena Vasilescu",
    age: 45,
    condition: "Post-COVID",
    lastMeasurement: {
      heartRate: 68,
      bloodPressure: { systolic: 118, diastolic: 75 },
      temperature: 36.5,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    status: "normal",
    avatar: "👩‍🦰",
  },
  {
    id: "p5",
    name: "Andrei Marin",
    age: 53,
    condition: "Hipertensiune",
    lastMeasurement: {
      heartRate: 78,
      bloodPressure: { systolic: 135, diastolic: 88 },
      temperature: 36.7,
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    status: "warning",
    avatar: "👨‍🦱",
  },
];

export default function DoctorDashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "critical" | "warning" | "normal">("all");

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    // Simulăm încărcarea datelor
    setPatients(MOCK_PATIENTS);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPatients();
    setRefreshing(false);
  };

  const filteredPatients = patients.filter(p => 
    selectedFilter === "all" ? true : p.status === selectedFilter
  ).sort((a, b) => {
    // Prioritarii întotdeauna mai sus
    if (a.isPriority && !b.isPriority) return -1;
    if (!a.isPriority && b.isPriority) return 1;
    
    // Apoi sortare după severitate
    const severityOrder = { critical: 0, warning: 1, normal: 2 };
    const severityDiff = severityOrder[a.status] - severityOrder[b.status];
    if (severityDiff !== 0) return severityDiff;
    
    // Apoi alfabetic
    return a.name.localeCompare(b.name);
  });

  const criticalCount = patients.filter(p => p.status === "critical").length;
  const warningCount = patients.filter(p => p.status === "warning").length;
  const normalCount = patients.filter(p => p.status === "normal").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "#ef4444";
      case "warning": return "#f59e0b";
      case "normal": return "#22c55e";
      default: return "#94a3b8";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "critical": return "Critic";
      case "warning": return "Atenție";
      case "normal": return "Normal";
      default: return "Necunoscut";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `acum ${diffMins} min`;
    }
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `acum ${diffHours}h`;
    }
    return date.toLocaleDateString("ro-RO");
  };

  const viewPatientDetails = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient && patient.lastMeasurement) {
      Alert.alert(
        `${patient.name} - Detalii complete`,
        `Vârstă: ${patient.age} ani\n` +
        `Condiție: ${patient.condition}\n\n` +
        `📊 Ultima măsurătoare:\n` +
        `❤️ Puls: ${patient.lastMeasurement.heartRate} bpm\n` +
        `🩸 Tensiune: ${patient.lastMeasurement.bloodPressure.systolic}/${patient.lastMeasurement.bloodPressure.diastolic} mmHg\n` +
        `🌡️ Temperatură: ${patient.lastMeasurement.temperature}°C\n` +
        `🕐 ${formatTimestamp(patient.lastMeasurement.timestamp)}`,
        [{ text: "OK" }]
      );
    }
  };

  const togglePriority = (patientId: string) => {
    setPatients(prev => 
      prev.map(p => 
        p.id === patientId ? { ...p, isPriority: !p.isPriority } : p
      )
    );
  };

  const changePatientStatus = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    const statusOptions = [
      { text: "🔴 Critic", onPress: () => updateStatus(patientId, "critical") },
      { text: "🟡 Atenție", onPress: () => updateStatus(patientId, "warning") },
      { text: "🟢 Normal", onPress: () => updateStatus(patientId, "normal") },
      { text: "Anulare", style: "cancel" as const },
    ];

    Alert.alert(
      `Schimbă statusul pentru ${patient.name}`,
      `Status actual: ${getStatusText(patient.status)}`,
      statusOptions
    );
  };

  const updateStatus = (patientId: string, newStatus: "normal" | "warning" | "critical") => {
    setPatients(prev => 
      prev.map(p => 
        p.id === patientId ? { ...p, status: newStatus } : p
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Bună ziua, Dr. Demo</Text>
              <Text style={styles.subtitle}>Monitorizare pacienți activi</Text>
            </View>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={() => router.replace("/auth/login")}
            >
              <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>

          {/* Statistici rapide */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { borderLeftColor: "#ef4444" }]}>
              <Text style={styles.statNumber}>{criticalCount}</Text>
              <Text style={styles.statLabel}>Critici</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: "#f59e0b" }]}>
              <Text style={styles.statNumber}>{warningCount}</Text>
              <Text style={styles.statLabel}>Atenție</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: "#22c55e" }]}>
              <Text style={styles.statNumber}>{normalCount}</Text>
              <Text style={styles.statLabel}>Normali</Text>
            </View>
          </View>
        </View>

        {/* Filtre */}
        <View style={styles.filtersRow}>
          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === "all" && styles.filterChipActive]}
            onPress={() => setSelectedFilter("all")}
          >
            <Text style={[styles.filterText, selectedFilter === "all" && styles.filterTextActive]}>
              Toți ({patients.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === "critical" && styles.filterChipActive]}
            onPress={() => setSelectedFilter("critical")}
          >
            <Text style={[styles.filterText, selectedFilter === "critical" && styles.filterTextActive]}>
              Critici ({criticalCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === "warning" && styles.filterChipActive]}
            onPress={() => setSelectedFilter("warning")}
          >
            <Text style={[styles.filterText, selectedFilter === "warning" && styles.filterTextActive]}>
              Atenție ({warningCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === "normal" && styles.filterChipActive]}
            onPress={() => setSelectedFilter("normal")}
          >
            <Text style={[styles.filterText, selectedFilter === "normal" && styles.filterTextActive]}>
              Normali ({normalCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista pacienți */}
        <View style={styles.patientsSection}>
          <Text style={styles.sectionTitle}>
            Pacienți monitorizați ({filteredPatients.length})
          </Text>

          {filteredPatients.map((patient) => (
            <View
              key={patient.id}
              style={[
                styles.patientCard,
                patient.isPriority && styles.patientCardPriority
              ]}
            >
              {patient.isPriority && (
                <View style={styles.priorityBanner}>
                  <Ionicons name="alert-circle" size={16} color="#fff" />
                  <Text style={styles.priorityText}>PACIENT PRIORITAR</Text>
                </View>
              )}
              
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => viewPatientDetails(patient.id)}
              >
                <View style={styles.patientHeader}>
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientAvatar}>{patient.avatar}</Text>
                    <View style={styles.patientDetails}>
                      <Text style={styles.patientName}>{patient.name}</Text>
                      <Text style={styles.patientMeta}>
                        {patient.age} ani • {patient.condition}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(patient.status) + "20" }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(patient.status) }]}>
                      {getStatusText(patient.status)}
                    </Text>
                  </View>
                </View>

                {patient.lastMeasurement && (
                  <View style={styles.vitalsRow}>
                    <View style={styles.vitalItem}>
                      <Ionicons name="heart" size={16} color="#ef4444" />
                      <Text style={styles.vitalValue}>{patient.lastMeasurement.heartRate}</Text>
                      <Text style={styles.vitalUnit}>bpm</Text>
                    </View>
                    <View style={styles.vitalItem}>
                      <Ionicons name="fitness" size={16} color="#3b82f6" />
                      <Text style={styles.vitalValue}>
                        {patient.lastMeasurement.bloodPressure.systolic}/
                        {patient.lastMeasurement.bloodPressure.diastolic}
                      </Text>
                      <Text style={styles.vitalUnit}>mmHg</Text>
                    </View>
                    <View style={styles.vitalItem}>
                      <Ionicons name="thermometer" size={16} color="#f59e0b" />
                      <Text style={styles.vitalValue}>{patient.lastMeasurement.temperature}</Text>
                      <Text style={styles.vitalUnit}>°C</Text>
                    </View>
                  </View>
                )}

                {patient.lastMeasurement && (
                  <View style={styles.timestampRow}>
                    <Ionicons name="time-outline" size={14} color="#94a3b8" />
                    <Text style={styles.timestamp}>
                      Ultima măsurătoare: {formatTimestamp(patient.lastMeasurement.timestamp)}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Butoane de acțiuni */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.actionButton, patient.isPriority && styles.actionButtonActive]}
                  onPress={() => togglePriority(patient.id)}
                >
                  <Ionicons 
                    name={patient.isPriority ? "pin" : "pin-outline"} 
                    size={18} 
                    color={patient.isPriority ? "#dc2626" : "#64748b"} 
                  />
                  <Text style={[styles.actionText, patient.isPriority && styles.actionTextActive]}>
                    {patient.isPriority ? "Prioritar" : "Marchează prioritar"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => changePatientStatus(patient.id)}
                >
                  <Ionicons name="create-outline" size={18} color="#64748b" />
                  <Text style={styles.actionText}>Schimbă status</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Footer info */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#3b82f6" />
          <Text style={styles.infoText}>
            Pacienții prioritari apar întotdeauna în partea de sus. Folosește butoanele pentru a marca pacienți ca prioritari sau pentru a schimba statusul lor. Trageți în jos pentru a reîmprospăta datele.
          </Text>
        </View>
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
    padding: 16,
    gap: 16,
  },
  header: {
    backgroundColor: "#0f172a",
    borderRadius: 20,
    padding: 18,
    gap: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    color: "#cbd5e1",
    marginTop: 4,
    fontSize: 14,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderLeftWidth: 4,
  },
  statNumber: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  statLabel: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 2,
  },
  filtersRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#e2e8f0",
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  filterChipActive: {
    backgroundColor: "#0ea5e9",
    borderColor: "#0ea5e9",
  },
  filterText: {
    color: "#475569",
    fontWeight: "700",
    fontSize: 13,
  },
  filterTextActive: {
    color: "#fff",
  },
  patientsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },
  patientCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    gap: 12,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  patientCardPriority: {
    borderWidth: 2,
    borderColor: "#dc2626",
    shadowColor: "#dc2626",
    shadowOpacity: 0.15,
  },
  priorityBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#dc2626",
    marginHorizontal: -14,
    marginTop: -14,
    marginBottom: 8,
    paddingVertical: 6,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  priorityText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  patientHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  patientInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  patientAvatar: {
    fontSize: 32,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
  },
  patientMeta: {
    color: "#475569",
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
  },
  vitalsRow: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  vitalItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 10,
  },
  vitalValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0f172a",
  },
  vitalUnit: {
    fontSize: 11,
    color: "#64748b",
  },
  timestampRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timestamp: {
    fontSize: 12,
    color: "#64748b",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#f8fafc",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  actionButtonActive: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
  },
  actionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
  },
  actionTextActive: {
    color: "#dc2626",
  },
  infoBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#dbeafe",
    padding: 14,
    borderRadius: 12,
    alignItems: "flex-start",
  },
  infoText: {
    flex: 1,
    color: "#1e40af",
    fontSize: 13,
    lineHeight: 18,
  },
});
