import empty from "@/assets/images/emptyState.png";
import EmptyState from "@/components/emptyState";
import TaskListItem from "@/components/taskListItem";
import { getUserTasks } from "@/lib/appwrite";
import { useGlobalStore } from "@/lib/store";
import { useAppwrite } from "@/lib/useAppwrite";
import { TaskListScreenProps } from "@/types";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const dummyPeriod: string[] = [
  "All",
  "Today",
  "Tomorrow",
  "Upcoming",
  "Overdue",
  "Completed",
];

// Helper functions
const isToday = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isTomorrow = (dateStr: string) => {
  const date = new Date(dateStr);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
};

const isOverdue = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  return date < now && !isToday(dateStr);
};

const isUpcoming = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return date > tomorrow;
};

const TaskList: React.FC<TaskListScreenProps> = () => {
  const [filter, setFilter] = useState<string>("All");
  const router = useRouter();

  const { user } = useGlobalStore();

  const { data } = useAppwrite({
    fn: getUserTasks,
    params: { userId: user?.$id },
  });

  if (!data) return <EmptyState />;

  console.log(data);

  const todayTasks = data?.filter((t) => isToday(t.dueDate));
  const tomorrowTasks = data?.filter((t) => isTomorrow(t.dueDate));
  const overdueTasks = data?.filter(
    (t) => isOverdue(t.dueDate) && !t.completed
  );
  const upcomingTasks = data?.filter((t) => isUpcoming(t.dueDate));
  const completedTasks = data?.filter((t) => t.completed);

  const handleToggle = (taskId: string, isCompleted: boolean) => {
    // Call APi to update task
  };

  const handleSelection = (filter: string) => {
    const arr =
      filter === "All"
        ? data
        : filter === "Today"
          ? todayTasks
          : filter === "Upcoming"
            ? upcomingTasks
            : filter === "Tomorrow"
              ? tomorrowTasks
              : filter === "Overdue"
                ? overdueTasks
                : completedTasks;
    return arr;
  };

  return (
    <SafeAreaView
      className={`flex-1 bg-background`}
      style={{ marginBottom: 70 }}
    >
      <View className="flex-1 px-6 pt-4">
        <View className="flex-row justify-between items-center py-4">
          <Text className={`text-3xl font-extrabold text-textPrimary`}>
            My Tasks
          </Text>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <Ionicons name="person" size={28} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <ScrollView
          bounces={false}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-5 max-h-12 "
        >
          <View className="flex-row items-center">
            {dummyPeriod?.map((item, i) => (
              <TouchableOpacity
                key={i}
                className={`px-4 py-2 rounded-full mr-3 ${item === filter ? `bg-primary` : `bg-gray-200`}`}
                onPress={() => setFilter(item)}
              >
                <Text
                  className={`text-sm font-semibold ${item === filter ? "text-white" : "text-textPrimary"}`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View className="flex-1">
          {handleSelection(filter)?.length > 0 ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              {handleSelection(filter).map((task) => (
                <TaskListItem
                  key={task.$id}
                  task={task}
                  onToggle={handleToggle}
                />
              ))}

              <View className="h-20" />
            </ScrollView>
          ) : (
            <EmptyState imageSource={empty} />
          )}
        </View>
      </View>

      <TouchableOpacity
        className={`absolute w-16 h-16 items-center justify-center right-6 bottom-12 bg-danger rounded-full shadow-xl shadow-[#EF4444]/50`}
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
