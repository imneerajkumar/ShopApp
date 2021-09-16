import React from 'react';
import { Platform } from 'react-native';
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";
import colors from '../../constants/colors';

function CustomHeaderButton(props) {
  return (
    <HeaderButton 
      {...props}
      IconComponent={Ionicons}
      iconSize={23}
      color={Platform.OS === "android" ? colors.white : colors.primary }
    />
  );
}

export default CustomHeaderButton;