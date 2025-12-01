import { getCurrentUser } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { Redirect, Slot } from "expo-router";
import React from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AppLayout = () => {
  const { data: user, loading } = useAppwrite({
    fn: getCurrentUser,
  });

  const isLogged = !!user;

  if (loading) {
    return (
      <SafeAreaView className="flex justify-center bg-white h-full items-center">
        <ActivityIndicator className="text-primary" size={"large"} />
      </SafeAreaView>
    );
  }

  if (!isLogged) {
    return <Redirect href={"/sign-in"} />;
  }

  return <Slot />;
};

export default AppLayout;
