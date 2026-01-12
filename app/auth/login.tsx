import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";


const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email-ul este obligatoriu")
    .email("Email invalid"),
  password: z
    .string()
    .min(6, "Parola trebuie sa aiba minim 6 caractere")
    .max(100, "Parola este prea lunga"),
  role: z.enum(["user", "doctor"], {
    required_error: "Selecteaza un rol",
    invalid_type_error: "Rol invalid",
  }),
});

type FormData = z.infer<typeof LoginSchema>;

export default function Login() {
  const { control, handleSubmit, setValue, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "", role: "user" },
  });
  const router = useRouter();
  const [focused, setFocused] = useState<string | null>(null);

  const MOCK_EMAIL = "demo@health.test";
  const MOCK_PASSWORD = "demo1234";
  const MOCK_DOCTOR_EMAIL = "doctor@health.test";
  const MOCK_DOCTOR_PASSWORD = "doctor1234";

  const onSubmit = (data: FormData) => {
    const payload = { ...data };
    console.log("Login submit:", payload);

    if (payload.email === MOCK_EMAIL && payload.password === MOCK_PASSWORD) {
      router.replace("/home");
      return;
    }

    if (payload.email === MOCK_DOCTOR_EMAIL && payload.password === MOCK_DOCTOR_PASSWORD) {
      router.replace("/doctor/dashboard");
      return;
    }

    Alert.alert("Autentificare", `Email: ${payload.email}\nRol: ${payload.role}`);
    router.push("/");
  };

  const loginAsMockUser = () => {
    setValue("email", MOCK_EMAIL);
    setValue("password", MOCK_PASSWORD);
    handleSubmit(onSubmit)();
  };

  const loginAsMockDoctor = () => {
    setValue("email", MOCK_DOCTOR_EMAIL);
    setValue("password", MOCK_DOCTOR_PASSWORD);
    handleSubmit(onSubmit)();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
        <Text style={styles.title}>Autentificare</Text>
        <Text style={styles.label}>Email</Text>
        <Controller
            control={control}
            name="email"
            rules={{ required: true, pattern: /.+@.+\..+/ }}
            render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
                style={[styles.input, focused === "email" && styles.inputFocused, errors.email && styles.inputError]}
                autoCapitalize="none"
                keyboardType="email-address"
                onBlur={() => {
                onBlur();
                setFocused(null);
                }}
                onFocus={() => setFocused("email")}
                onChangeText={onChange}
                value={value}
                placeholder="adresa@exemplu.com"
            />
            )}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

        <Text style={styles.label}>Parolă</Text>
        <Controller
            control={control}
            name="password"
            rules={{ required: true, minLength: 6 }}
            render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
                style={[styles.input, focused === "password" && styles.inputFocused, errors.password && styles.inputError]}
                secureTextEntry
                onBlur={() => {
                onBlur();
                setFocused(null);
                }}
                onFocus={() => setFocused("password")}
                onChangeText={onChange}
                value={value}
                placeholder="Parola"
            />
            )}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

        <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.primaryButtonText}>Autentificare</Text>
        </TouchableOpacity>

    <TouchableOpacity style={styles.mockButton} onPress={loginAsMockUser}>
      <Text style={styles.mockButtonText}>Autentificare utilizator demo</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.doctorButton} onPress={loginAsMockDoctor}>
      <Text style={styles.doctorButtonText}>🩺 Conectare ca medic demo</Text>
    </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => router.push("/auth/register-user")}>
            <Text style={styles.linkText}>Mergi la creare cont</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.vitalsButton} onPress={() => router.push("/vitals/heart-rate")}>
            <Text style={styles.vitalsButtonText}>🩺 Monitorizare Funcții Vitale</Text>
        </TouchableOpacity> */}
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 12, textAlign: "center" },
  label: { marginTop: 8, marginBottom: 4 },
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
  inputError: {
    borderBottomColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: "#007aff",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 14,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "600" },
  mockButton: {
    backgroundColor: "#0f172a",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  mockButtonText: { color: "#fff", fontWeight: "700" },
  doctorButton: {
    backgroundColor: "#10b981",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  doctorButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  linkButton: { marginTop: 10, alignItems: "center" },
  linkText: { color: "#007aff" },
  roleRow: { flexDirection: "row", marginBottom: 12, justifyContent: "center" },
  rolePill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginHorizontal: 6,
  },
  rolePillActive: { backgroundColor: "#007aff", borderColor: "#007aff" },
  roleText: { color: "#333" },
  roleTextActive: { color: "#fff", fontWeight: "600" },
  vitalsButton: {
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#e74c3c",
    alignItems: "center",
  },
  vitalsButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
