import { DatePickerModal } from "@/components/datePicker";
import { TimePickerModal } from "@/components/timePicker";
import { createTask, getTags, uploadFile } from "@/lib/appwrite";
import { useGlobalStore } from "@/lib/store";
import { useAppwrite } from "@/lib/useAppwrite";
import { CreateTaskData } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateTaskScreen: React.FC = () => {
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskNotes, setTaskNotes] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [dueTime, setDueTime] = useState<Date | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Image related
  const [taskImageUri, setTaskImageUri] = useState<string | undefined>(
    undefined
  );
  const [taskImageMimeType, setTaskImageMimeType] = useState<
    string | undefined
  >(undefined);

  const router = useRouter();

  // Modal State
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const { user } = useGlobalStore();

  const { data: tags } = useAppwrite({
    fn: getTags,
  });

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
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
        const asset = pickerResult.assets[0];
        const mimeType = asset.mimeType || "image/jpeg";
        setTaskImageUri(asset.uri);
        setTaskImageMimeType(mimeType);
      }
    } catch (error) {
      console.error("Error picking image:", error);
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

  const handleDueDateFormat = () => {
    let mainDueDate: Date | undefined = undefined;

    if (dueDate) {
      mainDueDate = new Date(dueDate);

      if (dueTime) {
        mainDueDate.setHours(dueTime.getHours());
        mainDueDate.setMinutes(dueTime.getMinutes());
        mainDueDate.setSeconds(0);
        mainDueDate.setMilliseconds(0);
      } else {
        mainDueDate.setHours(23, 59, 59, 999);
      }
    }

    const dueDateForAppwrite = mainDueDate
      ? mainDueDate.toISOString()
      : undefined;

    return dueDateForAppwrite;
  };

  const handleCreateTask = async () => {
    if (!taskTitle.trim()) {
      Alert.alert("Missing Title", "Please enter a title for your task.");
      return;
    }
    if (!user?.$id) {
      Alert.alert("Error", "User not found");
      return;
    }

    setIsSaving(true);
    let appwriteFileId: string | null = null;

    try {
      if (taskImageUri && user?.$id && taskImageMimeType) {
        appwriteFileId = await uploadFile(
          taskImageUri,
          taskImageMimeType,
          user.$id
        );

        if (!appwriteFileId) {
          Alert.alert(
            "Upload Error",
            "Failed to upload image. Task not saved."
          );
          setIsSaving(false);
          return;
        }
      }

      const date = handleDueDateFormat();

      const payload: CreateTaskData = {
        title: taskTitle.trim(),
        note: taskNotes.trim() || "",
        dueDate: date || "",
        completed: false,
        imageUri: appwriteFileId,
        userId: user?.$id,
        tagId: selectedTags.length > 0 ? selectedTags : [],
      };

      await createTask(payload);

      router.back();
    } catch (error) {
      console.error("Task creation failed:", error);
      Alert.alert("Error", "Could not create task. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 bg-background`}>
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
            {tags?.map((tag) => (
              <TouchableOpacity
                key={tag?.$id}
                className={`px-4 py-2 rounded-full mr-2 mb-2 ${selectedTags.includes(tag?.$id) ? `bg-primary` : "bg-gray-200"}`}
                onPress={() => toggleTag(tag?.$id)}
              >
                <Text
                  className={`text-sm font-semibold ${selectedTags.includes(tag?.$id) ? "text-white" : `text-textPrimary`}`}
                >
                  {tag?.tagName}
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
          disabled={!taskTitle.trim() || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator className="text-surface" size={"small"} />
          ) : (
            <Text className={`text-lg font-bold text-surface`}>
              Create Task
            </Text>
          )}
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
