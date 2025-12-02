import { TaskListItemProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  onToggle,
  onDetail,
}) => {
  return (
    <TouchableOpacity
      className={`flex-row bg-white p-4 rounded-xl flex-shrink mb-3 items-center justify-between shadow-sm shadow-gray-200`}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center flex-1 mr-4">
        <TouchableOpacity onPress={() => onToggle(task)} className="mr-4">
          {task.completed ? (
            <Ionicons name="checkmark" size={18} color="#10B981" />
          ) : (
            <Ionicons name={"radio-button-off"} size={18} color="#6B7280" />
          )}
        </TouchableOpacity>

        <Text
          className={`text-base flex-shrink ${task.completed ? `line-through text-textSecondary` : `text-textPrimary`}`}
          numberOfLines={1}
        >
          {task.title}
        </Text>
      </View>

      <TouchableOpacity onPress={() => onDetail(task?.$id)} className="p-1">
        <Ionicons name="menu" size={20} color={"#10B981"} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default TaskListItem;
