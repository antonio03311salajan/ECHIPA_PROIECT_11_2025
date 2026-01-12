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
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";


const DoctorSchema = z.object({
  firstName: z
    .string()
    .min(1, "Prenumele este obligatoriu")
    .min(2, "Prenumele trebuie sa aiba minim 2 caractere")
    .max(50, "Prenumele este prea lung")
    .regex(/^[a-zA-Z\u0103\u00e2\u00ee\u0219\u021b\u0102\u00c2\u00ce\u0218\u021a\s-]+$/, "Prenumele contine caractere invalide"),
  lastName: z
    .string()
    .min(1, "Numele este obligatoriu")
    .min(2, "Numele trebuie sa aiba minim 2 caractere")
    .max(50, "Numele este prea lung")
    .regex(/^[a-zA-Z\u0103\u00e2\u00ee\u0219\u021b\u0102\u00c2\u00ce\u0218\u021a\s-]+$/, "Numele contine caractere invalide"),
  stampCode: z
    .string()
    .regex(/^(\d{6,10})?$/, "Codul de parafa trebuie sa aiba intre 6-10 cifre")
    .optional()
    .or(z.literal("")),
  specialty: z
    .string()
    .min(3, "Specialitatea trebuie sa aiba minim 3 caractere")
    .max(100, "Specialitatea este prea lunga")
    .optional()
    .or(z.literal("")),
  personalCode: z
    .string()
    .regex(/^([1-9]\d{12})?$/, "CNP invalid")
    .optional()
    .or(z.literal("")),
  unit: z
    .string()
    .min(3, "Unitatea trebuie sa aiba minim 3 caractere")
    .max(150, "Unitatea este prea lunga")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^((\+4|0)?[7]\d{8})?$/, "Numar de telefon invalid (ex: 0712345678)")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .min(1, "Email-ul este obligatoriu")
    .email("Email invalid")
    .max(100, "Email-ul este prea lung"),
  password: z
    .string()
    .min(6, "Parola trebuie sa aiba minim 6 caractere")
    .max(100, "Parola este prea lunga")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Parola trebuie sa contina litere mari, mici si cifre"),
  gdpr: z.boolean().refine((val) => val === true, {
    message: "Trebuie sa accepti termenii si conditiile",
  }),
});

type DoctorForm = z.infer<typeof DoctorSchema>;

export default function RegisterDoctor() {
  const { control, handleSubmit, formState: { errors } } = useForm<DoctorForm>({
    resolver: zodResolver(DoctorSchema),
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
                <TextInput style={[styles.input, focused === "lastName" && styles.inputFocused, errors.lastName && styles.inputError]} onFocus={() => setFocused("lastName")} onBlur={() => setFocused(null)} onChangeText={onChange} value={value} />
            )} />
            {errors.lastName && <Text style={styles.errorText}>{errors.lastName.message}</Text>}

            <Text style={styles.label}>Prenume</Text>
            <Controller control={control} name="firstName" rules={{ required: true }} render={({ field: { onChange, value } }) => (
                <TextInput style={[styles.input, focused === "firstName" && styles.inputFocused, errors.firstName && styles.inputError]} onFocus={() => setFocused("firstName")} onBlur={() => setFocused(null)} onChangeText={onChange} value={value} />
            )} />
            {errors.firstName && <Text style={styles.errorText}>{errors.firstName.message}</Text>}

            <Text style={styles.label}>Cod de parafă</Text>
            <Controller control={control} name="stampCode" render={({ field: { onChange, value } }) => (
                <TextInput style={[styles.input, focused === "stampCode" && styles.inputFocused, errors.stampCode && styles.inputError]} onFocus={() => setFocused("stampCode")} onBlur={() => setFocused(null)} onChangeText={onChange} value={value} />
            )} />
            {errors.stampCode && <Text style={styles.errorText}>{errors.stampCode.message}</Text>}

            <Text style={styles.label}>Specialitate</Text>
            <Controller control={control} name="specialty" render={({ field: { onChange, value } }) => (
                <TextInput style={[styles.input, focused === "specialty" && styles.inputFocused, errors.specialty && styles.inputError]} onFocus={() => setFocused("specialty")} onBlur={() => setFocused(null)} onChangeText={onChange} value={value} />
            )} />
            {errors.specialty && <Text style={styles.errorText}>{errors.specialty.message}</Text>}

            <Text style={styles.label}>Cod Numeric Personal</Text>
            <Controller control={control} name="personalCode" render={({ field: { onChange, value } }) => (
                <TextInput style={[styles.input, focused === "personalCode" && styles.inputFocused, errors.personalCode && styles.inputError]} onFocus={() => setFocused("personalCode")} onBlur={() => setFocused(null)} onChangeText={onChange} value={value} />
            )} />
            {errors.personalCode && <Text style={styles.errorText}>{errors.personalCode.message}</Text>}

            <Text style={styles.label}>Unitate sanitară</Text>
            <Controller control={control} name="unit" render={({ field: { onChange, value } }) => (
                <TextInput style={[styles.input, focused === "unit" && styles.inputFocused, errors.unit && styles.inputError]} onFocus={() => setFocused("unit")} onBlur={() => setFocused(null)} onChangeText={onChange} value={value} />
            )} />
            {errors.unit && <Text style={styles.errorText}>{errors.unit.message}</Text>}

            <Text style={styles.label}>Număr de telefon</Text>
            <Controller control={control} name="phone" render={({ field: { onChange, value } }) => (
                <TextInput keyboardType="phone-pad" style={[styles.input, focused === "phone" && styles.inputFocused, errors.phone && styles.inputError]} onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)} onChangeText={onChange} value={value} />
            )} />
            {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

            <Text style={styles.label}>Email</Text>
            <Controller control={control} name="email" rules={{ required: true, pattern: /.+@.+\..+/ }} render={({ field: { onChange, value } }) => (
                <TextInput autoCapitalize="none" keyboardType="email-address" style={[styles.input, focused === "email" && styles.inputFocused, errors.email && styles.inputError]} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} onChangeText={onChange} value={value} />
            )} />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

            <Text style={styles.label}>Parolă</Text>
            <Controller control={control} name="password" rules={{ required: true, minLength: 6 }} render={({ field: { onChange, value } }) => (
                <TextInput secureTextEntry style={[styles.input, focused === "password" && styles.inputFocused, errors.password && styles.inputError]} onFocus={() => setFocused("password")} onBlur={() => setFocused(null)} onChangeText={onChange} value={value} />
            )} />
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

            <View style={styles.switchRow}>
                <Text style={{ flex: 1 }}>Consimțământ GDPR</Text>
                <Controller control={control} name="gdpr" render={({ field: { onChange, value } }) => (
                <Switch value={value} onValueChange={onChange} />
                )} />
            </View>
            {errors.gdpr && <Text style={styles.errorText}>{errors.gdpr.message}</Text>}

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
  switchRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
});
