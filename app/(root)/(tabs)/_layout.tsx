import Home from "@/assets/icons/home.png";
import Profile from "@/assets/icons/person.png";
import Explore from "@/assets/icons/search.png";
import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, Text, View } from "react-native";

const TabIcon = ({
  title,
  icon,
  focused,
}: {
  title: string;
  icon: ImageSourcePropType;
  focused: boolean;
}) => {
  return (
    <View className="flex-col mt-6 w-12 items-center gap-y-1">
      <Image source={icon} className="h-5 w-5" />
      {focused && <Text className="text-primary text-xs">{title}</Text>}
    </View>
  );
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          position: "absolute",
          borderTopColor: "#0061FF1A",
          borderTopWidth: 1,
          minHeight: 70,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon title={"Home"} icon={Home} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon title={"Explore"} icon={Explore} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon title={"Profile"} icon={Profile} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
