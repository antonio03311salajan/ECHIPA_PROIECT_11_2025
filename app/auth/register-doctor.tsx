import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


type DoctorForm = {
  firstName: string;
  lastName: string;
  stampCode: string;
  specialty: string;
  personalCode: string;
  unit: string;
  phone: string;
  email: string;
  password: string;
  gdpr: boolean;
};

export default function RegisterDoctor() {
  const { control, handleSubmit } = useForm<DoctorForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      stampCode: "",
      specialty: "",
      personalCode: "",
      unit: "",
      phone: "",
      email: "",
      password: "",
      gdpr: false,
    },
  });
  const router = useRouter();
  const [focused, setFocused] = useState<string | null>(null);

  const onSubmit = (data: DoctorForm) => {
    if (!data.gdpr) {
      Alert.alert("Consimțământ GDPR", "Trebuie să consimțiți pentru a continua.");
      return;
    }
    console.log("Register doctor:", data);
    Alert.alert("Înregistrare", "Medic înregistrat (simulat)");
    router.push("/");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Înregistrare Medic</Text>

            <Text style={styles.label}>Nume</Text>
            <Controller control={control} name="lastName" rules={{ required: true }} render={({ field: { onChange, value } }) => (
                <TextInput style={[styles.input, focused === "lastName" && styles.inputFocused]} onFocus={() => setFocused("lastName")} onBlur={() => setFocused(null)} onChangeText={onChange} value={value} />
            )} />

            <Text style={styles.label}>Prenume</Text>
            <Controller control={control} name="firstName" rules={{ required: true }} render={({ field: { onChange, value } }) => (
                <TextInput style={[styles.input, focused === "firstName" && styles.inputFocused]} onFocus={() => setFocused("firstName")} onBlur={() => setFocused(null)} onChangeText={onChange} value={value} />
            )} />

            <Text style={styles.label}>Cod de parafă</Text>
            <Controller control={control} name="stampCode" render={({ field: { onChange, value } }) => (
                <TextInput style={[styles.input, focused === "stampCode" && styles.inputFocused]} onFocus={() => setFocused("stampCode")} onBlur={() => setFocused(null)} onChangeText={onChange} value={value} />
            )} />

            <Text style={styles.label}>Specialitate</Text>
            <Controller control={control} name="specialty" render={({ field: { onChange, value } }) => (
                <TextInput style={[styles.input, focused === "specialty" && styles.inputFocused]} onFocus={() => setFocused("specialty")} onBlur={() => setFocused(null)} onChangeText={onChange} value={value} />
            )} />

            <Text style={styles.label}>Cod Numeric Personal</Text>
            <Controller control={control} name="personalCode" render={({ field: { onChange, value } }) => (
                <TextInput style={[styles.input, focused === "personalCode" && styles.inputFocused]} onFocus={() => setFocused("personalCode")} onBlur={() => setFocused(null)} onChangeText={onChange} value={value} />
            )} />

            <Text style={styles.label}>Unitate sanitară</Text>
            <Controller control={control} name="unit" render={({ field: { onChange, value } }) => (
                <TextInput style={[styles.input, focused === "unit" && styles.inputFocused]} onFocus={() => setFocused("unit")} onBlur={() => setFocused(null)} onChangeText={onChange} value={value} />
            )} />

            <Text style={styles.label}>Număr de telefon</Text>
            <Controller control={control} name="phone" render={({ field: { onChange, value } }) => (
                <TextInput keyboardType="phone-pad" style={[styles.input, focused === "phone" && styles.inputFocused]} onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)} onChangeText={onChange} value={value} />
            )} />

            <Text style={styles.label}>Email</Text>
            <Controller control={control} name="email" rules={{ required: true, pattern: /.+@.+\..+/ }} render={({ field: { onChange, value } }) => (
                <TextInput autoCapitalize="none" keyboardType="email-address" style={[styles.input, focused === "email" && styles.inputFocused]} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} onChangeText={onChange} value={value} />
            )} />

            <Text style={styles.label}>Parolă</Text>
            <Controller control={control} name="password" rules={{ required: true, minLength: 6 }} render={({ field: { onChange, value } }) => (
                <TextInput secureTextEntry style={[styles.input, focused === "password" && styles.inputFocused]} onFocus={() => setFocused("password")} onBlur={() => setFocused(null)} onChangeText={onChange} value={value} />
            )} />

            <View style={styles.switchRow}>
                <Text style={{ flex: 1 }}>Consimțământ GDPR</Text>
                <Controller control={control} name="gdpr" render={({ field: { onChange, value } }) => (
                <Switch value={value} onValueChange={onChange} />
                )} />
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.primaryButtonText}>Înregistrare Medic</Text>
            </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 12, textAlign: "center" },
  label: { marginTop: 10, marginBottom: 4 },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  inputFocused: {
    borderBottomWidth: 2,
    borderColor: "#007aff",
  },
  primaryButton: {
    backgroundColor: "#007aff",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 14,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "600" },
  switchRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
});
