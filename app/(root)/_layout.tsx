import { useGlobalStore } from "@/lib/store";
import { Redirect, Slot } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AppLayout = () => {
  const {refetchUser, isLogged, loading} = useGlobalStore()

  useEffect(() => {
    refetchUser();
  }, []);

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
