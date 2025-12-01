import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface DatePickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  currentDate?: Date;
}

const getMockDates = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from(
    { length: daysInMonth },
    (_, i) => new Date(year, month, i + 1)
  );
};

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isVisible,
  onClose,
  onSelectDate,
  currentDate,
}) => {
  const [dateState, setDateState] = useState(currentDate || new Date());
  const mockDates = getMockDates(dateState);

  const formattedMonth = dateState.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleDaySelect = (dayDate: Date) => {
    onSelectDate(dayDate);
    onClose();
  };

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View
          className={`bg-white rounded-xl w-11/12 max-w-sm p-4 shadow-xl shadow-black/20`}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-xl font-bold text-textPrimary`}>
              Select Date
            </Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Ionicons name="close" size={28} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity
              onPress={() => console.log("Previous Month")}
              className="p-2"
            >
              <FontAwesome
                name="chevron-left"
                size={12}
                color="#1F2937"
                className="text-xl text-textPrimary"
              />
            </TouchableOpacity>
            <Text className={`text-lg font-semibold text-textPrimary`}>
              {formattedMonth}
            </Text>
            <TouchableOpacity
              onPress={() => console.log("Next Month")}
              className="p-2"
            >
              <FontAwesome
                name="chevron-right"
                size={12}
                color="#1F2937"
                className="text-xl text-textPrimary"
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-around mb-2">
            {dayNames.map((day, index) => (
              <View key={index} className="w-8 items-center">
                <Text className={`text-sm font-bold text-textSecondary`}>
                  {day}
                </Text>
              </View>
            ))}
          </View>

          <View className="flex-row flex-wrap justify-around">
            {mockDates.map((dateObj, index) => {
              const dateKey = dateObj.toISOString().split("T")[0];
              const isSelected =
                currentDate &&
                dateObj.toDateString() === currentDate.toDateString();
              const isToday = dateObj.toDateString() === today.toDateString();

              return (
                <TouchableOpacity
                  key={dateKey}
                  className={`w-8 h-8 rounded-full justify-center items-center m-1 ${isSelected ? `bg-primary` : isToday ? "border-2 border-gray-400" : ""}`}
                  onPress={() => handleDaySelect(dateObj)}
                  style={{ width: "12%" }}
                >
                  <Text
                    className={`text-base ${isSelected ? "text-white font-bold" : `text-textPrimary`}`}
                  >
                    {dateObj.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            className={`bg-gray-200 p-3 rounded-xl items-center mt-5`}
            onPress={onClose}
          >
            <Text className={`text-base font-semibold text-textPrimary`}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
