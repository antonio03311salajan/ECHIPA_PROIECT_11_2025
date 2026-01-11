import { Stack } from "expo-router";

export default function VitalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: "#007aff" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "600" },
      }}
    />
  );
}
