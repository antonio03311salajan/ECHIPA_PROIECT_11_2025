import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STORAGE_KEY = "consultations";

type Consultation = {
  id: string;
  title: string;
  doctor: string;
  location: string;
  date: string; 
  time: string;
  notes?: string;
};

type FormState = {
  title: string;
  doctor: string;
  location: string;
  time: string;
  notes: string;
};

function formatDateKey(date: Date) {
  return date.toISOString().split("T")[0];
}

function buildId() {
  return `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const weekdayLabels = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sa", "Du"];

export default function ConsultationsScreen() {
  const router = useRouter();
  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [items, setItems] = useState<Consultation[]>([]);
  const [form, setForm] = useState<FormState>({
    title: "",
    doctor: "",
    location: "",
    time: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: Consultation[] = JSON.parse(stored);
          setItems(parsed);
        }
      } catch (e) {
        console.log("Failed to load consultations", e);
      }
    };
    load();
  }, []);

  const datesWithConsultations = useMemo(() => {
    return new Set(items.map(item => item.date));
  }, [items]);

  const selectedKey = formatDateKey(selectedDate);

  const monthLabel = useMemo(() => {
    return monthCursor.toLocaleString("ro-RO", { month: "long", year: "numeric" });
  }, [monthCursor]);

  const monthDays = useMemo(() => {
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const leading = (firstDay.getDay() + 6) % 7; // Monday as first day
    const totalDays = new Date(year, month + 1, 0).getDate();
    const cells: { day: number | null; dateKey?: string }[] = [];

    for (let i = 0; i < leading; i++) {
      cells.push({ day: null });
    }
    for (let d = 1; d <= totalDays; d++) {
      const dateKey = formatDateKey(new Date(year, month, d));
      cells.push({ day: d, dateKey });
    }
    return cells;
  }, [monthCursor]);

  const dayConsultations = useMemo(() => {
    return items.filter(item => item.date === selectedKey);
  }, [items, selectedKey]);

  const onChangeMonth = (delta: number) => {
    const next = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + delta, 1);
    setMonthCursor(next);
    setSelectedDate(prev => new Date(next.getFullYear(), next.getMonth(), Math.min(prev.getDate(), 28)));
  };

  const selectDay = (day: number, dateKey?: string) => {
    if (!dateKey) return;
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();
    setSelectedDate(new Date(year, month, day));
  };

  const updateForm = (key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const addConsultation = async () => {
    if (!form.title.trim()) {
      Alert.alert("Completeaza titlul consultatiei");
      return;
    }
    if (!form.time.trim()) {
      Alert.alert("Adauga ora consultatiei (HH:MM)");
      return;
    }

    const hasSameDay = items.some(item => item.date === selectedKey);
    if (hasSameDay) {
      Alert.alert("Zi deja ocupata", "Exista deja o consultatie in aceasta zi. Alege o alta data.");
      return;
    }

    const newItem: Consultation = {
      id: buildId(),
      title: form.title.trim(),
      doctor: form.doctor.trim(),
      location: form.location.trim(),
      time: form.time.trim(),
      notes: form.notes.trim(),
      date: selectedKey,
    };

    try {
      setSaving(true);
      const nextItems = [newItem, ...items].sort((a, b) => (a.date > b.date ? -1 : 1));
      setItems(nextItems);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
      setForm({ title: "", doctor: "", location: "", time: "", notes: "" });
    } catch (e) {
      Alert.alert("Eroare", "Nu am putut salva consultatia.");
      console.log("Save consultation failed", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
              <Ionicons name="arrow-back" size={22} color="#0f172a" />
            </TouchableOpacity>
            <Text style={styles.screenTitle}>Consultatii</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.monthRow}>
            <TouchableOpacity style={styles.iconButton} onPress={() => onChangeMonth(-1)}>
              <Ionicons name="chevron-back" size={20} color="#0f172a" />
            </TouchableOpacity>
            <Text style={styles.monthLabel}>{monthLabel}</Text>
            <TouchableOpacity style={styles.iconButton} onPress={() => onChangeMonth(1)}>
              <Ionicons name="chevron-forward" size={20} color="#0f172a" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.weekRow}>
            {weekdayLabels.map(label => (
              <Text key={label} style={styles.weekLabel}>{label}</Text>
            ))}
          </View>
          <View style={styles.daysGrid}>
            {monthDays.map((cell, idx) => {
              const isSelected = cell.dateKey === selectedKey;
              const hasConsult = cell.dateKey ? datesWithConsultations.has(cell.dateKey) : false;
              return (
                <TouchableOpacity
                  key={`${cell.dateKey || "blank"}-${idx}`}
                  style={[styles.dayCell, isSelected && styles.daySelected]}
                  activeOpacity={cell.day ? 0.8 : 1}
                  onPress={() => cell.day && selectDay(cell.day, cell.dateKey)}
                  disabled={!cell.day}
                >
                  {cell.day ? (
                    <>
                      <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>{cell.day}</Text>
                      {hasConsult && <View style={styles.dot} />}
                    </>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Consultatii in {selectedKey}</Text>
            <Text style={styles.sectionSubtitle}>{dayConsultations.length} inregistrari</Text>
          </View>

          {dayConsultations.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="calendar-outline" size={42} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>Nicio consultatie pentru aceasta zi</Text>
              <Text style={styles.emptyText}>Adauga o consultatie mai jos.</Text>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {dayConsultations.map(item => (
                <View key={item.id} style={styles.consultCard}>
                  <View style={styles.consultHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.consultTitle}>{item.title}</Text>
                      <Text style={styles.consultMeta}>{item.time} • {item.location || "Locatie nedefinita"}</Text>
                    </View>
                    <View style={styles.consultPill}>
                      <Ionicons name="person" size={14} color="#0f172a" />
                      <Text style={styles.consultPillText}>{item.doctor || "Fara doctor"}</Text>
                    </View>
                  </View>
                  {item.notes ? <Text style={styles.consultNotes}>{item.notes}</Text> : null}
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Adauga consultatie</Text>
          <View style={styles.formField}>
            <Text style={styles.label}>Titlu</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Control cardiologie"
              value={form.title}
              onChangeText={text => updateForm("title", text)}
            />
          </View>
          <View style={styles.rowFields}>
            <View style={[styles.formField, { flex: 1 }]}> 
              <Text style={styles.label}>Doctor</Text>
              <TextInput
                style={styles.input}
                placeholder="Dr. Ionescu"
                value={form.doctor}
                onChangeText={text => updateForm("doctor", text)}
              />
            </View>
            <View style={[styles.formField, { flex: 1 }]}> 
              <Text style={styles.label}>Ora</Text>
              <TextInput
                style={styles.input}
                placeholder="09:30"
                value={form.time}
                onChangeText={text => updateForm("time", text)}
                keyboardType="numbers-and-punctuation"
                maxLength={5}
              />
            </View>
          </View>
          <View style={styles.formField}>
            <Text style={styles.label}>Locatie</Text>
            <TextInput
              style={styles.input}
              placeholder="Clinica / Cabinet"
              value={form.location}
              onChangeText={text => updateForm("location", text)}
            />
          </View>
          <View style={styles.formField}>
            <Text style={styles.label}>Note</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              placeholder="Optional"
              value={form.notes}
              multiline
              onChangeText={text => updateForm("notes", text)}
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, saving && { opacity: 0.7 }]}
            onPress={addConsultation}
            disabled={saving}
          >
            <Ionicons name="add-circle" size={18} color="#fff" />
            <Text style={styles.primaryButtonText}>Salveaza consultatia</Text>
          </TouchableOpacity>
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
    gap: 14,
  },
  header: {
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 12,
  },
  monthLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  calendarCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  weekLabel: {
    width: `${100 / 7}%`,
    textAlign: "center",
    color: "#475569",
    fontWeight: "700",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    gap: 6,
    borderRadius: 10,
  },
  daySelected: {
    backgroundColor: "#e0f2fe",
  },
  dayText: {
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "700",
  },
  dayTextSelected: {
    color: "#0ea5e9",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22c55e",
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    gap: 10,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0f172a",
  },
  sectionSubtitle: {
    color: "#475569",
    fontSize: 13,
  },
  emptyBox: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  emptyText: {
    color: "#475569",
  },
  consultCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  consultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  consultTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0f172a",
  },
  consultMeta: {
    color: "#475569",
    marginTop: 2,
  },
  consultPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  consultPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0f172a",
  },
  consultNotes: {
    color: "#334155",
    lineHeight: 18,
  },
  formField: {
    gap: 6,
  },
  label: {
    color: "#475569",
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#f8fafc",
  },
  rowFields: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0ea5e9",
    paddingVertical: 14,
    borderRadius: 14,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
});
