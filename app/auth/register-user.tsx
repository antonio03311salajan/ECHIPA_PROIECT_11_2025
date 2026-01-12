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


const UserSchema = z.object({
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
    personalCode: z
        .string()
        .min(1, "CNP-ul este obligatoriu")
        .length(13, "CNP-ul trebuie sa aiba exact 13 cifre")
        .regex(/^[1-9]\d{12}$/, "CNP invalid"),
    dob: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Data invalida (format: YYYY-MM-DD)")
        .refine((val) => {
            if (!val) return true;
            const date = new Date(val);
            const now = new Date();
            const age = now.getFullYear() - date.getFullYear();
            return age >= 0 && age <= 120;
        }, {
            message: "Data nasterii invalida",
        })
        .optional()
        .or(z.literal("")),
    gender: z
        .string()
        .regex(/^(M|F|m|f|Alt|alt)?$/, "Gen invalid (M/F/Alt)")
        .optional()
        .or(z.literal("")),
    email: z
        .string()
        .min(1, "Email-ul este obligatoriu")
        .email("Email invalid")
        .max(100, "Email-ul este prea lung"),
    phone: z
        .string()
        .regex(/^((\+4|0)?[7]\d{8})?$/, "Numar de telefon invalid (ex: 0712345678)")
        .optional()
        .or(z.literal("")),
    address: z
        .string()
        .min(10, "Adresa este prea scurta")
        .max(200, "Adresa este prea lunga")
        .optional()
        .or(z.literal("")),
    password: z
        .string()
        .min(6, "Parola trebuie sa aiba minim 6 caractere")
        .max(100, "Parola este prea lunga")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Parola trebuie sa contina litere mari, mici si cifre"),
    bloodType: z
        .string()
        .regex(/^((A|B|AB|O)[+-]?)?$/, "Grupa sanguina invalida (ex: A+, B-, O+)")
        .optional()
        .or(z.literal("")),
    allergies: z
        .string()
        .max(500, "Textul este prea lung")
        .optional()
        .or(z.literal("")),
    chronic: z
        .string()
        .max(500, "Textul este prea lung")
        .optional()
        .or(z.literal("")),
    weight: z
        .string()
        .regex(/^(\d{2,3}(\.\d{1,2})?)?$/, "Greutate invalida (ex: 70, 75.5)")
        .refine((val) => !val || (parseFloat(val) >= 20 && parseFloat(val) <= 300), {
            message: "Greutatea trebuie sa fie intre 20-300 kg",
        })
        .optional()
        .or(z.literal("")),
    height: z
        .string()
        .regex(/^(\d{2,3})?$/, "Inaltime invalida (ex: 175)")
        .refine((val) => !val || (parseInt(val) >= 50 && parseInt(val) <= 250), {
            message: "Inaltimea trebuie sa fie intre 50-250 cm",
        })
        .optional()
        .or(z.literal("")),
    gdpr: z.boolean().refine((val) => val === true, {
        message: "Trebuie sa accepti termenii si conditiile",
    }),
});

type UserForm = z.infer<typeof UserSchema>;

export default function RegisterUser() {
    const { control, handleSubmit, formState: { errors } } = useForm<UserForm>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
      firstName: "",
      lastName: "",
      personalCode: "",
      dob: "",
      gender: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      bloodType: "",
      allergies: "",
      chronic: "",
      weight: "",
      height: "",
      gdpr: false,
    },
  });
  const router = useRouter();
  const [focused, setFocused] = useState<string | null>(null);

  const onSubmit = (data: UserForm) => {
    if (!data.gdpr) {
      Alert.alert("Consimțământ GDPR", "Trebuie să consimțiți pentru a continua.");
      return;
    }
    console.log("Register user:", data);
    Alert.alert("Înregistrare", "Utilizator înregistrat (simulat)");
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
            <Text style={styles.title}>Înregistrare Utilizator</Text>

            <Text style={styles.label}>Nume</Text>
            <Controller
                control={control}
                name="lastName"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                <TextInput
                    style={[styles.input, focused === "lastName" && styles.inputFocused, errors.lastName && styles.inputError]}
                    onFocus={() => setFocused("lastName")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                />
                )}
            />
            {errors.lastName && <Text style={styles.errorText}>{errors.lastName.message}</Text>}

            <Text style={styles.label}>Prenume</Text>
            <Controller
                control={control}
                name="firstName"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                <TextInput
                    style={[styles.input, focused === "firstName" && styles.inputFocused, errors.firstName && styles.inputError]}
                    onFocus={() => setFocused("firstName")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                />
                )}
            />
            {errors.firstName && <Text style={styles.errorText}>{errors.firstName.message}</Text>}

            <Text style={styles.label}>Cod Numeric Personal</Text>
            <Controller
                control={control}
                name="personalCode"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                <TextInput
                    style={[styles.input, focused === "personalCode" && styles.inputFocused, errors.personalCode && styles.inputError]}
                    onFocus={() => setFocused("personalCode")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                />
                )}
            />
            {errors.personalCode && <Text style={styles.errorText}>{errors.personalCode.message}</Text>}

            <Text style={styles.label}>Data nașterii</Text>
            <Controller
                control={control}
                name="dob"
                render={({ field: { onChange, value } }) => (
                <TextInput
                    placeholder="YYYY-MM-DD"
                    style={[styles.input, focused === "dob" && styles.inputFocused, errors.dob && styles.inputError]}
                    onFocus={() => setFocused("dob")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                />
                )}
            />
            {errors.dob && <Text style={styles.errorText}>{errors.dob.message}</Text>}

            <Text style={styles.label}>Gen</Text>
            <Controller
                control={control}
                name="gender"
                render={({ field: { onChange, value } }) => (
                <TextInput
                    placeholder="M/F/Alt"
                    style={[styles.input, focused === "gender" && styles.inputFocused, errors.gender && styles.inputError]}
                    onFocus={() => setFocused("gender")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                />
                )}
            />
            {errors.gender && <Text style={styles.errorText}>{errors.gender.message}</Text>}

            <Text style={styles.label}>Email</Text>
            <Controller
                control={control}
                name="email"
                rules={{ required: true, pattern: /.+@.+\..+/ }}
                render={({ field: { onChange, value } }) => (
                <TextInput
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={[styles.input, focused === "email" && styles.inputFocused, errors.email && styles.inputError]}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                />
                )}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

            <Text style={styles.label}>Număr de telefon</Text>
            <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                <TextInput
                    keyboardType="phone-pad"
                    style={[styles.input, focused === "phone" && styles.inputFocused, errors.phone && styles.inputError]}
                    onFocus={() => setFocused("phone")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                />
                )}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

            <Text style={styles.label}>Adresă domiciliu</Text>
            <Controller
                control={control}
                name="address"
                render={({ field: { onChange, value } }) => (
                <TextInput
                    style={[styles.input, focused === "address" && styles.inputFocused, errors.address && styles.inputError]}
                    onFocus={() => setFocused("address")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                />
                )}
            />
            {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}

            <Text style={styles.label}>Parolă</Text>
            <Controller
                control={control}
                name="password"
                rules={{ required: true, minLength: 6 }}
                render={({ field: { onChange, value } }) => (
                <TextInput
                    secureTextEntry
                    style={[styles.input, focused === "password" && styles.inputFocused, errors.password && styles.inputError]}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                />
                )}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

            <Text style={styles.label}>Grupă sanguină</Text>
            <Controller
                control={control}
                name="bloodType"
                render={({ field: { onChange, value } }) => (
                <TextInput
                    style={[styles.input, focused === "bloodType" && styles.inputFocused, errors.bloodType && styles.inputError]}
                    onFocus={() => setFocused("bloodType")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Ex: A+, O-"
                />
                )}
            />
            {errors.bloodType && <Text style={styles.errorText}>{errors.bloodType.message}</Text>}

            <Text style={styles.label}>Alergii</Text>
            <Controller
                control={control}
                name="allergies"
                render={({ field: { onChange, value } }) => (
                <TextInput
                    style={[styles.input, focused === "allergies" && styles.inputFocused, errors.allergies && styles.inputError]}
                    onFocus={() => setFocused("allergies")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Listă, separate prin virgula"
                />
                )}
            />
            {errors.allergies && <Text style={styles.errorText}>{errors.allergies.message}</Text>}

            <Text style={styles.label}>Afecțiuni cronice</Text>
            <Controller
                control={control}
                name="chronic"
                render={({ field: { onChange, value } }) => (
                <TextInput
                    style={[styles.input, focused === "chronic" && styles.inputFocused, errors.chronic && styles.inputError]}
                    onFocus={() => setFocused("chronic")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Descriere scurtă"
                />
                )}
            />
            {errors.chronic && <Text style={styles.errorText}>{errors.chronic.message}</Text>}

            <Text style={styles.label}>Greutate (kg)</Text>
            <Controller
                control={control}
                name="weight"
                render={({ field: { onChange, value } }) => (
                <TextInput
                    keyboardType="numeric"
                    style={[styles.input, focused === "weight" && styles.inputFocused, errors.weight && styles.inputError]}
                    onFocus={() => setFocused("weight")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                />
                )}
            />
            {errors.weight && <Text style={styles.errorText}>{errors.weight.message}</Text>}

            <Text style={styles.label}>Înălțime (cm)</Text>
            <Controller
                control={control}
                name="height"
                render={({ field: { onChange, value } }) => (
                <TextInput
                    keyboardType="numeric"
                    style={[styles.input, focused === "height" && styles.inputFocused, errors.height && styles.inputError]}
                    onFocus={() => setFocused("height")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                />
                )}
            />
            {errors.height && <Text style={styles.errorText}>{errors.height.message}</Text>}

            <View style={styles.switchRow}>
                <Text style={{ flex: 1 }}>Consimțământ GDPR</Text>
                <Controller
                control={control}
                name="gdpr"
                render={({ field: { onChange, value } }) => (
                    <Switch value={value} onValueChange={onChange} />
                )}
                />
            </View>
            {errors.gdpr && <Text style={styles.errorText}>{errors.gdpr.message}</Text>}

            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.primaryButtonText}>Înregistrare</Text>
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
