import { getCurrentUser, logout } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile: React.FC = () => {
  const { data: user } = useAppwrite({
    fn: getCurrentUser,
  });

  const getInitials = (user: any) => {
    if (!user) return null;
    const res = user?.name?.split(" ");
    const first = res[0]?.slice(0, 1);
    const second = res[1]?.slice(0, 1);
    return `${first}${second}`;
  };

  const handleLogout = async () => {
    const res = await logout();
    if (res) {
      router.replace("/sign-in");
    } else {
      Alert.alert("Error", "Failed to logout");
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 bg-background`}
      style={{ marginBottom: 70 }}
    >
      <ScrollView>
        <View className="flex-1 px-6 pt-4">
          <View className="h-64 bg-gray-300 rounded-xl items-center gap-2 justify-center">
            <View className="h-48 w-48 rounded-full bg-primary/10 items-center justify-center overflow-hidden">
              <Text className="text-[5rem] text-primary font-bold">
                {getInitials(user)}
              </Text>
            </View>
            <Text className="text-xl text-textPrimary font-semibold">
              {user?.name}
            </Text>
          </View>
          <View className="h-auto rounded-xl mt-12 bg-white border p-4 border-gray-300">
            <View className="gap-2 border-b border-gray-200 p-4">
              <Text className="font-bold text-textPrimary">Name</Text>
              <Text className="text-textSecondary text-sm">{user?.name}</Text>
            </View>
            <View className="gap-2 border-b border-gray-200 p-4">
              <Text className="font-bold text-textPrimary">Email</Text>
              <Text className="text-textSecondary text-sm">{user?.email}</Text>
            </View>
            <View className="gap-2 border-b border-gray-200 p-4">
              <Text className="font-bold text-textPrimary">Phone number</Text>
              <Text className="text-textSecondary text-sm">{user?.phone}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        className={`absolute h-16 left-6 bottom-3 rounded-full shadow-xl shadow-[#EF4444]/50`}
        onPress={handleLogout}
      >
        <View className="flex-row items-center gap-2">
          <FontAwesome name="sign-out" size={20} color="#EF4444" />

          <Text className="font-semibold text-xl text-danger">Log out</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Profile;
