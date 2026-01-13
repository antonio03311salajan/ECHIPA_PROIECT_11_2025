import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UnifiedRecommendationScreen() {
  const router = useRouter();
  const [role, setRole] = useState<"doctor" | "patient">("doctor");
  const [text, setText] = useState("");
  const [savedRecommendation, setSavedRecommendation] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      const stored = await AsyncStorage.getItem("latest_recommendation");
      if (stored) setSavedRecommendation(stored);
    };
    loadData();
  }, [role]);

  const handleSend = async () => {
    if (text.trim().length < 5) {
      Alert.alert("Eroare", "Scrie o recomandare mai lungă.");
      return;
    }
    await AsyncStorage.setItem("latest_recommendation", text);
    Alert.alert("Trimis!", "Pacientul poate vedea acum mesajul.", [
      { text: "OK", onPress: () => setRole("patient") }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconPad}>
            <Ionicons name="arrow-back" size={26} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {role === "doctor" ? "SARCINA MEDIC" : "SARCINA PACIENT"}
          </Text>
        </View>

        <TouchableOpacity 
          activeOpacity={0.7}
          style={[styles.switchButton, { backgroundColor: "white" }]} 
          onPress={() => setRole(role === "doctor" ? "patient" : "doctor")}
        >
          <Ionicons name="swap-horizontal" size={20} color="#0369a1" />
          <Text style={styles.switchText}>SCHIMBĂ ROL</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {role === "doctor" ? (
          <View style={styles.viewContainer}>
            <Text style={styles.mainTitle}>Trimitere Recomandare</Text>
            <View style={styles.card}>
              <Text style={styles.label}>Instrucțiuni pentru pacient:</Text>
              <TextInput
                style={styles.input}
                placeholder="Scrie tratamentul aici..."
                multiline
                value={text}
                onChangeText={setText}
                textAlignVertical="top"
              />
              <TouchableOpacity style={styles.primaryBtn} onPress={handleSend}>
                <Text style={styles.primaryBtnText}>Trimite la Pacient</Text>
                <Ionicons name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.viewContainer}>
            <Text style={styles.mainTitle}>Mesaje primite</Text>
            <View style={styles.patientCard}>
              <Text style={styles.doctorLabel}>Medic: Dr. Andrei Ionescu</Text>
              <View style={styles.divider} />
              <Text style={styles.messageText}>
                {savedRecommendation || "Nu sunt mesaje noi."}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: "#f8fafc",
    paddingTop: Platform.OS === 'android' ? 10 : 0 
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0"
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  iconPad: {
    padding: 5
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#64748b"
  },
  switchButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 8,
  },
  switchText: {
    color: "#0369a1",
    fontSize: 12,
    fontWeight: "bold"
  },
  scrollContent: {
    padding: 20
  },
  viewContainer: {
    flex: 1
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 20
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0"
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 12
  },
  input: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 150,
    color: "#1e293b"
  },
  primaryBtn: {
    backgroundColor: "#22c55e",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
    borderRadius: 15,
    marginTop: 20,
    gap: 10
  },
  primaryBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  },
  patientCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    borderLeftWidth: 8,
    borderLeftColor: "#f59e0b",
    elevation: 2
  },
  doctorLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b"
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 15
  },
  messageText: {
    fontSize: 18,
    lineHeight: 28,
    color: "#1e293b"
  }
});