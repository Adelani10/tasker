import empty from "@/assets/images/emptyState.png";
import EmptyState from "@/components/emptyState";
import TaskListItem from "@/components/taskListItem";
import { getUserTasks, updateTask } from "@/lib/appwrite";
import { useGlobalStore } from "@/lib/store";
import { useAppwrite } from "@/lib/useAppwrite";
import { Task, TaskListScreenProps } from "@/types";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  const [isUpdating, setIsUpdating] = useState(false);

  const { user } = useGlobalStore();

  const { data, loading } = useAppwrite({
    fn: getUserTasks,
    params: { userId: user?.$id },
  });

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (data) {
      setTasks(data as unknown as Task[]);
    }
  }, [data]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="text-textSecondary mt-4">Loading Tasks...</Text>
      </SafeAreaView>
    );
  }

  if (!tasks) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-background">
        <Text className="text-textPrimary text-xl font-semibold">
          Task Not Found
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 p-2">
          <Text className="text-primary text-base">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const todayTasks = tasks?.filter((t) => isToday(t.dueDate));
  const tomorrowTasks = tasks?.filter((t) => isTomorrow(t.dueDate));
  const overdueTasks = tasks?.filter(
    (t) => isOverdue(t.dueDate) && !t.completed
  );
  const upcomingTasks = tasks?.filter((t) => isUpcoming(t.dueDate));
  const completedTasks = tasks?.filter((t) => t.completed);

  const handleNavigateToDetails = (taskId?: string) => {
    if (!taskId) {
      console.warn("navigate to task missing id", taskId);
      return;
    }

    router.push(`/task/${taskId}`);
  };

  const handleToggleCompleted = async (task: Task) => {
    if (!task) return;
    setIsUpdating(true);
    try {
      const newCompletedState = !task.completed;

      const success = await updateTask(task.$id, {
        ...task,
        completed: newCompletedState,
      });

      if (success) {
        const res = await getUserTasks({ userId: user?.$id });
        setTasks(res as unknown as Task[]);
      } else {
        Alert.alert("Error", "Failed to update task completion status.");
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "An unexpected error occurred during update.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggle = (taskId: string, isCompleted: boolean) => {
    // Call APi to update task
  };

  const handleSelection = (filter: string) => {
    const arr =
      filter === "All"
        ? tasks
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
                  onToggle={handleToggleCompleted}
                  onDetail={handleNavigateToDetails}
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
