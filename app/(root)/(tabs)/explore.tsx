import { Link, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// import { getTasks } from "@/lib/appwrite";
import { SafeAreaView } from "react-native-safe-area-context";

const Explore = () => {
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  return (
    <SafeAreaView className="h-full bg-white" style={{ marginBottom: 70 }}>
      <ScrollView className="px-6 py-4 ">
        <Text className="">Explore page</Text>
        <View className="flex-1 h-screen items-center justify-center">
          <Link href={"/"} asChild>
            <TouchableOpacity>
              <Text className="text-primary font-bold text-2xl">
                {" "}
                Coming soon
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Explore;
