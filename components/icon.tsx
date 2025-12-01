import React from "react";
import { Text } from "react-native";

const Icon : React.FC<{
  name: string;
  size?: string;
  className?: string;
}> = ({ name, size = "text-2xl", className }) => {
  let content = "";
  switch (name) {
    case "check-circle":
      content = "✓";
      break;
    case "person":
      content = "👤";
      break;
    case "plus":
      content = "+";
      break;
    case "circle":
      content = "○";
      break;
    case "menu":
      content = "≡";
      break;
    case "google":
      content = "G";
      break;
    default:
      content = "";
  }

  return (
    <Text className={`${size} ${className || ""}`}>
      {content}
    </Text>
  );
};

export default Icon
