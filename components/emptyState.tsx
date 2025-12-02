import { EmptyStateProps } from "@/types";
import React from "react";
import { Image, Text, View } from "react-native";

const EmptyState: React.FC<EmptyStateProps> = ({
  message = "Nothing here yet!",
  imageSource,
}) => {
  return (
    <View className="flex-1 justify-center items-center p-5">
      {imageSource && (
        <Image
          source={imageSource}
          className="w-64 h-64 mb-5"
          resizeMode="contain"
        />
      )}
      <Text className=" text-textPrimary -mt-12 font-semibold text-2xl text-center">
        {message}
      </Text>
    </View>
  );
};

export default EmptyState;
