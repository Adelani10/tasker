import TaskListItem from "@/components/taskListItem";
import { dummyPeriod, dummyTasks } from "@/data";
import { Task, TaskListScreenProps } from "@/types";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TaskList: React.FC<TaskListScreenProps> = () => {
  const [tasks, setTasks] = useState<Task[]>(dummyTasks);
  const [filter, setFilter] = useState<string>("Today");

  const todayTasks = tasks.filter((t) => t.isToday);
  const upcomingTasks = tasks.filter((t) => !t.isToday);
  const router = useRouter();

  const handleToggle = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <SafeAreaView className={`flex-1 bg-background`}>
      <View className="flex-1 px-6 pt-4">
        <View className="flex-row justify-between items-center py-4">
          <Text className={`text-3xl font-extrabold text-textPrimary`}>
            My Tasks
          </Text>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <Ionicons name="person" size={28} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <View className="flex-row mb-5">
          {dummyPeriod?.map((item, i) => (
            <TouchableOpacity
              key={i}
              className={`px-4 py-2 rounded-full mr-3 ${item === filter ? `bg-danger` : `bg-textSecondary`}`}
              onPress={() => setFilter(item)}
            >
              <Text className={`text-sm font-semibold text-white`}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {filter === "Today" &&
            todayTasks.map((task) => (
              <TaskListItem key={task.id} task={task} onToggle={handleToggle} />
            ))}
          {filter === "Upcoming" &&
            upcomingTasks.map((task) => (
              <TaskListItem key={task.id} task={task} onToggle={handleToggle} />
            ))}
          <View className="h-20" />
        </ScrollView>
      </View>

      <TouchableOpacity
        className={`absolute w-16 h-16 items-center justify-center right-6 bottom-32 bg-danger rounded-full shadow-xl shadow-[#EF4444]/50`}
        onPress={() => router.push("/task/create")}
      >
        <FontAwesome
          name="plus"
          size={24}
          color="#fff"
          className="text-xl text-surface"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default TaskList;
