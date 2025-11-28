import google from "@/assets/icons/google.png";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "./components/icon";

export default function Index() {
  const router = useRouter();
  return (
    <SafeAreaView className={`flex-1 bg-background`}>
      <View className="flex-1 p-6 justify-between pt-12 pb-8">
        <View className="flex-1 justify-center items-center">
          <View
            className={`w-24 h-24 rounded-full bg-primary justify-center items-center mb-8 shadow-lg shadow-black/20`}
          >
            <Icon
              name="check-circle"
              size="text-5xl"
              className="text-surface"
            />
          </View>

          <Text className={`text-4xl font-extrabold text-textPrimary mb-2`}>
            Get Organized
          </Text>
          <Text
            className={`text-base text-textSecondary text-center max-w-xs mb-12`}
          >
            Manage your tasks and boost your productivity
          </Text>
        </View>

        <View className="pb-4">
          <TouchableOpacity
            className={`flex-row bg-primary/10 p-4 rounded-xl items-center justify-center shadow-lg shadow-[#4F46E5]/40`}
            onPress={() => router.push("/(tasks)/taskList")}
          >
            <View className="flex flex-row items-center justify-center">
              <Image source={google} className="w-5 h-5" resizeMode="contain" />
              <Text className="text-lg font-rubik-medium text-black-300 ml-2">
                Continue with Google
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
