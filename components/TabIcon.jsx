import { View, Text, Image } from 'react-native'
import React from 'react'

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs w-full text-center`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

export default TabIcon