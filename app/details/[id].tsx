import { Link } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TaskDetails = () => {
  return (
    <SafeAreaView className={`flex-1 bg-background`}>
      <ScrollView>
        <View className="flex-1 h-screen items-center justify-center">
          <Link href={"/"} asChild>
            <TouchableOpacity>
              <Text className="text-primary font-bold text-2xl">
                {" "}
                TaskDetails Page
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TaskDetails;
