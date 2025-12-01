import { TaskListItemProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "./icon";

const TaskListItem: React.FC<TaskListItemProps> = ({ task, onToggle }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      className={`flex-row bg-white p-4 rounded-xl mb-3 items-center justify-between shadow-sm shadow-gray-200`}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center flex-1 mr-4">
        <TouchableOpacity onPress={() => onToggle(task?.id)} className="mr-4">
          {task.completed ? (
            <Icon name="check-circle" size="text-3xl text-secondary" />
          ) : (
            <Icon name="circle" size="text-3xl text-textSecondary" />
          )}
        </TouchableOpacity>

        <Text
          className={`text-base flex-shrink ${task.completed ? `line-through text-textSecondary` : `text-textPrimary`}`}
          numberOfLines={1}
        >
          {task.text}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push(`/task/${task.id}`)}
        className="p-1"
      >
        <Ionicons name="menu" size={20} color={"#10B981"} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default TaskListItem;
