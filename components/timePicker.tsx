import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface TimePickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectTime: (time: Date) => void;
  currentTime?: Date;
}

const generateScrollValues = (start: number, end: number, step: number = 1) => {
  const values = [];
  for (let i = start; i <= end; i += step) {
    values.push(i);
  }
  return values;
};

const hours = generateScrollValues(1, 12);
const minutes = generateScrollValues(0, 59, 5);
const periods = ["AM", "PM"];

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  isVisible,
  onClose,
  onSelectTime,
  currentTime,
}) => {
  const initialDate = currentTime || new Date();

  let initialHour = initialDate.getHours();
  let initialPeriod = initialHour >= 12 ? "PM" : "AM";
  initialHour = initialHour % 12;
  initialHour = initialHour ? initialHour : 12;

  const [selectedHour, setSelectedHour] = useState(initialHour);
  const [selectedMinute, setSelectedMinute] = useState(
    Math.round(initialDate.getMinutes() / 5) * 5
  );
  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod);

  const handleDone = () => {
    let hour24 = selectedHour;
    if (selectedPeriod === "PM" && selectedHour !== 12) {
      hour24 += 12;
    } else if (selectedPeriod === "AM" && selectedHour === 12) {
      hour24 = 0;
    }

    const newTime = new Date();
    newTime.setHours(hour24, selectedMinute, 0, 0);

    onSelectTime(newTime);
    onClose();
  };

  const TimeWheel: React.FC<{
    values: number[];
    selectedValue: number;
    onValueChange: (v: number) => void;
  }> = ({ values, selectedValue, onValueChange }) => {
    const itemHeight = 40;
    const scrollViewRef = useRef<ScrollView>(null);

    const renderItem = (value: number) => (
      <TouchableOpacity
        key={value}
        className={`h-[${itemHeight}px] justify-center items-center`}
        onPress={() => onValueChange(value)}
      >
        <Text
          className={`text-3xl font-light ${value === selectedValue ? `text-primary font-bold` : `text-textSecondary opacity-50`}`}
        >
          {String(value).padStart(2, "0")}
        </Text>
      </TouchableOpacity>
    );

    return (
      <View className="h-40 overflow-hidden w-20">
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={itemHeight}
          decelerationRate="fast"
          className="py-16"
        >
          {values.map(renderItem)}
        </ScrollView>
        <View
          className={`absolute h-[${itemHeight}px] w-full top-[80px] border-y-2 border-gray-300 pointer-events-none`}
        />
      </View>
    );
  };

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
              Select Time
            </Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Ionicons name="close" size={28} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center items-center my-6">
            <TimeWheel
              values={hours}
              selectedValue={selectedHour}
              onValueChange={setSelectedHour}
            />
            <Text className={`text-3xl font-bold mx-2 text-textPrimary`}>
              :
            </Text>
            <TimeWheel
              values={minutes}
              selectedValue={selectedMinute}
              onValueChange={setSelectedMinute}
            />

            <View className="ml-4 flex-col justify-center items-center h-40">
              {periods.map((p) => (
                <TouchableOpacity
                  key={p}
                  className={`w-16 h-[40px] justify-center items-center rounded-lg my-1 ${selectedPeriod === p ? `bg-primary` : "bg-gray-200"}`}
                  onPress={() => setSelectedPeriod(p)}
                >
                  <Text
                    className={`text-xl font-semibold ${selectedPeriod === p ? "text-white" : `text-textPrimary`}`}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="flex-row justify-end mt-4">
            <TouchableOpacity
              className={`bg-gray-200 px-4 py-2 rounded-xl mr-3`}
              onPress={onClose}
            >
              <Text className={`text-base font-semibold text-textPrimary`}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`bg-primary px-4 py-2 rounded-xl`}
              onPress={handleDone}
            >
              <Text className={`text-base font-semibold text-white`}>
                Set Time
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
