import { Stack } from "expo-router";

export default function TaskLayout() {
  return (
    <Stack>
      <Stack.Screen name="newTask" options={{ headerShown: false }} />
      <Stack.Screen name="taskList" options={{ headerShown: false }} />
    </Stack>
  );
}
