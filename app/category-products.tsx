import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";

// 🔥 OCULTA EL HEADER AUTOMÁTICO DE EXPO ROUTER
export const unstable_settings = {
  headerShown: false,
};

export default function CategoryProducts() {
  const { category } = useLocalSearchParams();
  const router = useRouter();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        paddingHorizontal: 20,
        paddingTop: 60, // espacio para notch
      }}
    >
      {/* 🔙 Flecha personalizada */}
      <IconButton
        icon="arrow-left"
        size={28}
        iconColor={theme.tint}
        onPress={() => router.back()}
        style={{
          alignSelf: "flex-start",
          marginBottom: 10,
          backgroundColor: "#fff",
          borderRadius: 30,
          elevation: 2,
        }}
      />

      {/* 🏷️ Título de categoría */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: theme.tint,
            fontSize: 26,
            fontWeight: "bold",
            marginBottom: 8,
          }}
        >
          {category}
        </Text>

        <Text style={{ color: theme.text, fontSize: 16, textAlign: "center" }}>
          Aquí se mostrarán los productos de la categoría seleccionada.
        </Text>
      </View>
    </View>
  );
}
