import { Stack } from "expo-router";

export default function MessagesLayout() {
  return (
    <Stack>
      <Stack.Screen name="chat" options={{ title: "Conversație cu Medicul" }} />
    </Stack>
  );
}