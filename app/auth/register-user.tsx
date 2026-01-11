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


type UserForm = {
  firstName: string;
  lastName: string;
  personalCode: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  bloodType?: string;
  allergies?: string;
  chronic?: string;
  weight?: string;
  height?: string;
  gdpr: boolean;
};

export default function RegisterUser() {
  const { control, handleSubmit } = useForm<UserForm>({
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
                    style={[styles.input, focused === "lastName" && styles.inputFocused]}
                    onFocus={() => setFocused("lastName")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                />
                )}
            />

            <Text style={styles.label}>Prenume</Text>
            <Controller
                control={control}
                name="firstName"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                <TextInput
                    style={[styles.input, focused === "firstName" && styles.inputFocused]}
                    onFocus={() => setFocused("firstName")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                />
                )}
            />

            <Text style={styles.label}>Cod Numeric Personal</Text>
            <Controller
                control={control}
                name="personalCode"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                <TextInput
                    style={[styles.input, focused === "personalCode" && styles.inputFocused]}
                    onFocus={() => setFocused("personalCode")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                />
                )}
            />

            <Text style={styles.label}>Data nașterii</Text>
            <Controller
                control={control}
                name="dob"
                render={({ field: { onChange, value } }) => (
                <TextInput
                    placeholder="YYYY-MM-DD"
                    style={[styles.input, focused === "dob" && styles.inputFocused]}
                    onFocus={() => setFocused("dob")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                />
                )}
            />

            <Text style={styles.label}>Gen</Text>
            <Controller
                control={control}
                name="gender"
                render={({ field: { onChange, value } }) => (
                <TextInput
                    placeholder="M/F/Alt"
                    style={[styles.input, focused === "gender" && styles.inputFocused]}
                    onFocus={() => setFocused("gender")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                />
                )}
            />

            <Text style={styles.label}>Email</Text>
            <Controller
                control={control}
                name="email"
                rules={{ required: true, pattern: /.+@.+\..+/ }}
                render={({ field: { onChange, value } }) => (
                <TextInput
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={[styles.input, focused === "email" && styles.inputFocused]}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                />
                )}
            />

            <Text style={styles.label}>Număr de telefon</Text>
            <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                <TextInput
                    keyboardType="phone-pad"
                    style={[styles.input, focused === "phone" && styles.inputFocused]}
                    onFocus={() => setFocused("phone")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                />
                )}
            />

            <Text style={styles.label}>Adresă domiciliu</Text>
            <Controller
                control={control}
                name="address"
                render={({ field: { onChange, value } }) => (
                <TextInput
                    style={[styles.input, focused === "address" && styles.inputFocused]}
                    onFocus={() => setFocused("address")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                />
                )}
            />

            <Text style={styles.label}>Parolă</Text>
            <Controller
                control={control}
                name="password"
                rules={{ required: true, minLength: 6 }}
                render={({ field: { onChange, value } }) => (
                <TextInput
                    secureTextEntry
                    style={[styles.input, focused === "password" && styles.inputFocused]}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                />
                )}
            />

            <Text style={styles.label}>Grupă sanguină</Text>
            <Controller
                control={control}
                name="bloodType"
                render={({ field: { onChange, value } }) => (
                <TextInput
                    style={[styles.input, focused === "bloodType" && styles.inputFocused]}
                    onFocus={() => setFocused("bloodType")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Ex: A+, O-"
                />
                )}
            />

            <Text style={styles.label}>Alergii</Text>
            <Controller
                control={control}
                name="allergies"
                render={({ field: { onChange, value } }) => (
                <TextInput
                    style={[styles.input, focused === "allergies" && styles.inputFocused]}
                    onFocus={() => setFocused("allergies")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Listă, separate prin virgula"
                />
                )}
            />

            <Text style={styles.label}>Afecțiuni cronice</Text>
            <Controller
                control={control}
                name="chronic"
                render={({ field: { onChange, value } }) => (
                <TextInput
                    style={[styles.input, focused === "chronic" && styles.inputFocused]}
                    onFocus={() => setFocused("chronic")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Descriere scurtă"
                />
                )}
            />

            <Text style={styles.label}>Greutate (kg)</Text>
            <Controller
                control={control}
                name="weight"
                render={({ field: { onChange, value } }) => (
                <TextInput
                    keyboardType="numeric"
                    style={[styles.input, focused === "weight" && styles.inputFocused]}
                    onFocus={() => setFocused("weight")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                />
                )}
            />

            <Text style={styles.label}>Înălțime (cm)</Text>
            <Controller
                control={control}
                name="height"
                render={({ field: { onChange, value } }) => (
                <TextInput
                    keyboardType="numeric"
                    style={[styles.input, focused === "height" && styles.inputFocused]}
                    onFocus={() => setFocused("height")}
                    onBlur={() => setFocused(null)}
                    onChangeText={onChange}
                    value={value}
                />
                )}
            />

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
