import { DatePickerModal } from "@/components/datePicker";
import { TimePickerModal } from "@/components/timePicker";
import { CreateTaskScreenProps, TaskTag } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({ onSaveTask }) => {
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskNotes, setTaskNotes] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [dueTime, setDueTime] = useState<Date | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<TaskTag[]>([]);
  const [taskImageUri, setTaskImageUri] = useState<string | undefined>(
    undefined
  );
  const router = useRouter();

  const availableTags: TaskTag[] = [
    "Personal",
    "Work",
    "Groceries",
    "Health",
    "Study",
    "Other",
  ];

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const toggleTag = (tag: TaskTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handlePickImage = async () => {
    try {
      // 1. Request Camera Permissions
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Denied",
          "Permission to access the camera is required to take a picture for the task."
        );
        return;
      }

      // 2. Launch the Camera
      const pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      // 3. Process Result
      if (
        !pickerResult.canceled &&
        pickerResult.assets &&
        pickerResult.assets.length > 0
      ) {
        setTaskImageUri(pickerResult.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      // Fallback for unexpected errors during camera use
      Alert.alert(
        "Camera Error",
        "An error occurred while trying to capture the image. Please try again."
      );
    }
  };

  const handleSelectDate = (date: Date) => {
    setDueDate(date);
    setDatePickerVisible(false);
  };

  const handleSelectTime = (time: Date) => {
    setDueTime(time);
    setTimePickerVisible(false);
  };

  const getDueDateString = () => {
    if (!dueDate) return "Due Date";
    return dueDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDueTimeString = () => {
    if (!dueTime) return "Set Time";
    return dueTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleCreateTask = () => {
    if (!taskTitle.trim()) {
      Alert.alert("Missing Title", "Please enter a title for your task.");
      return;
    }

    let finalDueDate: Date | undefined = dueDate;
    if (finalDueDate && dueTime) {
      finalDueDate.setHours(dueTime.getHours(), dueTime.getMinutes(), 0, 0);
    } else if (finalDueDate) {
      // If only date is set, set time to EOD (23:59)
      finalDueDate.setHours(23, 59, 0, 0);
    }

    onSaveTask({
      text: taskTitle.trim(),
      notes: taskNotes.trim() || undefined,
      dueDate: finalDueDate,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      imageUri: taskImageUri,
    });
    router.back();
  };

  return (
    <SafeAreaView className={`flex-1 bg-background`}>
      {/* <StatusBar barStyle="dark-content" className="bg-background" /> */}
      <View className="flex-1 px-6 pt-4">
        <View className="flex-row justify-between items-center py-4 mb-8">
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <Ionicons name="close" size={28} color="#6B7280" />
          </TouchableOpacity>
          <Text className={`text-2xl font-bold text-textPrimary`}>
            New Task
          </Text>
          <View className="w-6" />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <TextInput
            className={`bg-white p-4 rounded-xl text-lg text-textPrimary mb-6 border border-gray-200`}
            placeholder="What needs to be done?"
            placeholderTextColor={"#6B7280"}
            value={taskTitle}
            onChangeText={setTaskTitle}
          />

          <TextInput
            className={`bg-white p-4 rounded-xl text-base text-textPrimary mb-6 border border-gray-200 h-24`}
            placeholder="Notes"
            placeholderTextColor={"#6B7280"}
            value={taskNotes}
            onChangeText={setTaskNotes}
            multiline
            textAlignVertical="top"
          />

          <View className="flex-row justify-between mb-4">
            <TouchableOpacity
              className={`flex-row items-center bg-surface p-3 rounded-xl flex-1 mr-2 border border-gray-200`}
              onPress={() => setDatePickerVisible(true)}
            >
              <Ionicons name="calendar" size={18} color="#6B7280" />
              <Text
                className={`text-base ml-2 ${dueDate ? `text-textPrimary font-semibold` : `text-textSecondary`}`}
              >
                {getDueDateString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-row items-center bg-surface p-3 rounded-xl flex-1 ml-2 border border-gray-200`}
              onPress={() => setTimePickerVisible(true)}
            >
              <Ionicons name="time" size={18} color="#6B7280" />
              <Text
                className={`text-base ml-2 ${dueTime ? `text-textPrimary font-semibold` : `text-textSecondary`}`}
              >
                {getDueTimeString()}
              </Text>
            </TouchableOpacity>
          </View>

          <Text className={`text-lg font-bold text-textPrimary mb-3`}>
            Tags
          </Text>
          <View className="flex-row flex-wrap mb-6">
            {availableTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                className={`px-4 py-2 rounded-full mr-2 mb-2 ${selectedTags.includes(tag) ? `bg-primary` : "bg-gray-200"}`}
                onPress={() => toggleTag(tag)}
              >
                <Text
                  className={`text-sm font-semibold ${selectedTags.includes(tag) ? "text-white" : `text-textPrimary`}`}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className={`text-lg font-bold text-textPrimary mb-3`}>
            Add Activity Picture
          </Text>
          <TouchableOpacity
            className={`flex-row items-center justify-center bg-white p-4 rounded-xl border-2 border-dashed border-gray-300 mb-6 ${taskImageUri ? "h-52" : "h-44"}`}
            onPress={handlePickImage}
          >
            {taskImageUri ? (
              <Image
                source={{ uri: taskImageUri }}
                className="w-full h-full rounded-xl resize-cover absolute"
              />
            ) : (
              <>
                <Ionicons name="camera" size={28} color="#6B7280" />
                <Text className={`text-base ml-3 text-textSecondary`}>
                  Tap to take a picture
                </Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity
          className={`bg-primary p-4 rounded-xl items-center justify-center mt-4 mb-4 shadow-lg shadow-[#4F46E5]/40 ${!taskTitle.trim() ? "opacity-50" : ""}`}
          onPress={handleCreateTask}
          disabled={!taskTitle.trim()}
        >
          <Text className={`text-lg font-bold text-surface`}>Create Task</Text>
        </TouchableOpacity>
      </View>

      <DatePickerModal
        isVisible={isDatePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        onSelectDate={handleSelectDate}
        currentDate={dueDate}
      />

      <TimePickerModal
        isVisible={isTimePickerVisible}
        onClose={() => setTimePickerVisible(false)}
        onSelectTime={handleSelectTime}
        currentTime={dueTime}
      />
    </SafeAreaView>
  );
};

export default CreateTaskScreen;
