import google from "@/assets/icons/google.png";
import logo from "@/assets/images/to-do-logo.png";
import { login } from "@/lib/appwrite";
import { useGlobalStore } from "@/lib/store";
import { Redirect } from "expo-router";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  const { loading, isLogged, refetchUser } = useGlobalStore();

  if (!loading && isLogged) return <Redirect href={"/"} />;

  const handleLogin = async () => {
    const res = await login();
    if (res) {
      refetchUser();
    } else {
      Alert.alert("Error", "Failed to login");
    }
  };

  return (
    <SafeAreaView className={`flex-1 bg-background`}>
      <View className="flex-1 p-6 justify-between pt-12 pb-8">
        <View className="flex-1 justify-center items-center">
          <Image
            source={logo}
            className="w-60 h-auto object-cover"
            resizeMode="cover"
          />

          <Text className={`text-4xl -mt-32 font-extrabold text-textPrimary mb-2`}>
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
            onPress={handleLogin}
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
