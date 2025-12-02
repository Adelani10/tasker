import { deleteTask, getSingleTask, updateTask } from "@/lib/appwrite";
import { Task } from "@/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatDateTime = (isoDateString?: string) => {
  if (!isoDateString) return null;
  const date = new Date(isoDateString);
  if (isNaN(date.getTime())) return null;

  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (date.getHours() === 23 && date.getMinutes() >= 59) {
    return datePart;
  }

  return `${datePart} at ${timePart}`;
};

const TaskDetailScreen: React.FC = () => {
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const params = useLocalSearchParams();
  const id = params?.id as string;

  const fetchTask = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await getSingleTask({ taskId: id });
      if (data) {
        setTask(data as unknown as Task);
      }
    } catch (error) {
      console.error("Failed to fetch task details:", error);
      Alert.alert("Error", "Could not load task details.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const handleToggleCompleted = async () => {
    if (!task) return;
    setIsUpdating(true);
    try {
      const newCompletedState = !task.completed;

      const success = await updateTask(task.$id, {
        ...task,
        completed: newCompletedState,
      });

      if (success) {
        setTask((prev) =>
          prev ? { ...prev, completed: newCompletedState } : null
        );
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

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this task permanently?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!task) return;
            setIsDeleting(true);
            try {
              const success = await deleteTask(task.$id);

              if (success) {
                router.back();
              } else {
                Alert.alert("Error", "Failed to delete task.");
              }
            } catch (error) {
              console.error("Delete error:", error);
              Alert.alert(
                "Error",
                "An unexpected error occurred during deletion."
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="text-textSecondary mt-4">Loading Task...</Text>
      </SafeAreaView>
    );
  }

  if (!task) {
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

  const isOverdue = task.dueDate
    ? new Date(task.dueDate) < new Date() && !task.completed
    : false;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-100">
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <Text className="text-2xl text-textPrimary">←</Text>
          </TouchableOpacity>
          <Text className={`text-xl font-bold  text-textPrimary`}>
            Task Details
          </Text>
          <TouchableOpacity
            onPress={() => console.log("Editing")}
            className="p-1"
          >
            <Feather name={"edit-2"} size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-6">
          <Text
            className={`text-4xl font-extrabold mb-4 ${task.completed ? "line-through text-gray-400" : "text-textPrimary"}`}
          >
            {task.title}
          </Text>

          {task.dueDate && (
            <View className="flex-row items-center mb-4 bg-surface p-3 rounded-xl border border-gray-200">
              <View className={`mr-3`}>
                {task.completed ? (
                  <Ionicons name="checkmark" size={28} color="#10B981" />
                ) : isOverdue ? (
                  <Ionicons
                    name="alert-circle-sharp"
                    size={28}
                    color="#EF4444"
                  />
                ) : (
                  <Ionicons name="calendar" size={18} color="#6B7280" />
                )}
              </View>
              <View>
                <Text className="text-sm text-textSecondary font-medium">
                  {task.completed ? "Completed" : isOverdue ? "OVERDUE" : "Due"}
                </Text>
                <Text
                  className={`text-lg font-semibold ${isOverdue ? "text-danger" : "text-textPrimary"}`}
                >
                  {formatDateTime(task.dueDate)}
                </Text>
              </View>
            </View>
          )}

          {task?.tagId && task?.tagId.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-textPrimary mb-2">
                Tags
              </Text>
              <View className="flex-row flex-wrap">
                {task?.tagId?.map((tag, index) => (
                  <View
                    key={index}
                    className="px-3 py-1 rounded-full bg-gray-200 mr-2 mb-2"
                  >
                    <Text className="text-sm font-semibold text-textPrimary">
                      {tag?.tagName}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {task.note && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-textPrimary mb-2">
                Notes
              </Text>
              <View className="bg-surface p-4 rounded-xl border border-gray-200">
                <Text className="text-base text-textPrimary">{task.note}</Text>
              </View>
            </View>
          )}

          {task?.imageUri && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-textPrimary mb-2">
                Attached Image
              </Text>
              <View className="rounded-xl overflow-hidden border border-gray-200 aspect-video">
                <Image
                  source={{ uri: task?.imageUri }}
                  className="w-full h-full"
                  style={{ resizeMode: "cover" }}
                />
              </View>
            </View>
          )}
        </ScrollView>
        <View className="flex-row absolute bottom-6 px-6 justify-between ">
          <TouchableOpacity
            onPress={handleToggleCompleted}
            disabled={isUpdating}
            className={`flex-1 p-3 rounded-xl items-center justify-center mr-2 shadow-md ${!task?.completed ? "bg-secondary" : "bg-textSecondary"}`}
          >
            <Text className="text-lg font-bold text-surface">
              {isUpdating ? (
                <ActivityIndicator color="#fff" />
              ) : task.completed ? (
                "Mark Incomplete"
              ) : (
                "Mark Complete"
              )}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            disabled={isDeleting}
            className={`flex-1 p-3 rounded-xl items-center justify-center ml-2 bg-danger shadow-md`}
          >
            <Text className="text-lg font-bold text-white">
              {isDeleting ? <ActivityIndicator color="#fff" /> : "Delete Task"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TaskDetailScreen;
