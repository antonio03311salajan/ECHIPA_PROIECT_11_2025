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

type VitalOption = {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
  available: boolean;
};

const vitalOptions: VitalOption[] = [
  {
    id: "heart-rate",
    title: "Puls Cardiac",
    subtitle: "Măsoară pulsul folosind camera",
    icon: "heart",
    route: "/vitals/heart-rate",
    color: "#e74c3c",
    available: true,
  },
  {
    id: "spo2",
    title: "Saturație Oxigen (SpO2)",
    subtitle: "În curând disponibil",
    icon: "water",
    route: "/vitals/spo2",
    color: "#3498db",
    available: false,
  },
  {
    id: "stress",
    title: "Nivel Stres (HRV)",
    subtitle: "În curând disponibil",
    icon: "pulse",
    route: "/vitals/stress",
    color: "#9b59b6",
    available: false,
  },
  {
    id: "history",
    title: "Istoric Măsurători",
    subtitle: "Vezi măsurătorile anterioare",
    icon: "stats-chart",
    route: "/vitals/history",
    color: "#27ae60",
    available: false,
  },
];

export default function VitalsIndex() {
  const router = useRouter();

  const handlePress = (option: VitalOption) => {
    if (option.available) {
      router.push(option.route as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#007aff" />
          </TouchableOpacity>
          <Text style={styles.title}>Funcții Vitale</Text>
          <Text style={styles.subtitle}>
            Monitorizează-ți sănătatea folosind camera telefonului
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {vitalOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                !option.available && styles.optionCardDisabled,
              ]}
              onPress={() => handlePress(option)}
              disabled={!option.available}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: option.color + "20" },
                ]}
              >
                <Ionicons
                  name={option.icon}
                  size={32}
                  color={option.available ? option.color : "#aaa"}
                />
              </View>
              <View style={styles.optionTextContainer}>
                <Text
                  style={[
                    styles.optionTitle,
                    !option.available && styles.textDisabled,
                  ]}
                >
                  {option.title}
                </Text>
                <Text
                  style={[
                    styles.optionSubtitle,
                    !option.available && styles.textDisabled,
                  ]}
                >
                  {option.subtitle}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={option.available ? "#ccc" : "#ddd"}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color="#007aff" />
          <Text style={styles.infoText}>
            Pentru măsurarea pulsului, plasează degetul pe camera din spate și
            ține-l nemișcat timp de 15-30 secunde.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionCardDisabled: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  textDisabled: {
    color: "#aaa",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#e3f2fd",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#1565c0",
    lineHeight: 20,
  },
});
