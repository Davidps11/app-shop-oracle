import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const RED = "#EA0040";

export default function CatalogScreen() {
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState("");

  // 📦 CATEGORÍAS COMPLETAS (ESTILO LIVERPOOL)
  const categories = [
    {
      id: "1",
      name: "Mujer",
      image: require("@/assets/images/categorias/mujer.png"),
    },
    {
      id: "2",
      name: "Hombre",
      image: require("@/assets/images/categorias/hombre.png"),
    },
    {
      id: "3",
      name: "Niños y niñas",
      image: require("@/assets/images/categorias/ninos.png"),
    },
    {
      id: "4",
      name: "Bebés 0 - 4 años",
      image: require("@/assets/images/categorias/bebes.png"),
    },
    {
      id: "5",
      name: "Zapatos",
      image: require("@/assets/images/categorias/zapatos.png"),
    },
    {
      id: "6",
      name: "Belleza",
      image: require("@/assets/images/categorias/belleza.png"),
    },
    {
      id: "7",
      name: "Relojes, lentes y joyería",
      image: require("@/assets/images/categorias/relojes.png"),
    },
    {
      id: "8",
      name: "Deportes",
      image: require("@/assets/images/categorias/deportes.png"),
    },
    {
      id: "9",
      name: "Electrónica",
      image: require("@/assets/images/categorias/electronica.png"),
    },
    {
      id: "10",
      name: "Hogar",
      image: require("@/assets/images/categorias/hogar.png"),
    },
    {
      id: "11",
      name: "Línea blanca y electrodomésticos",
      image: require("@/assets/images/categorias/linea-blanca.png"),
    },
    {
      id: "12",
      name: "Muebles",
      image: require("@/assets/images/categorias/muebles.png"),
    },
    {
      id: "13",
      name: "Juguetes",
      image: require("@/assets/images/categorias/juguetes.png"),
    },
    {
      id: "14",
      name: "Videojuegos",
      image: require("@/assets/images/categorias/videojuegos.png"),
    },
    {
      id: "15",
      name: "Autos y motos",
      image: require("@/assets/images/categorias/autos.png"),
    },
    {
      id: "16",
      name: "Vinos y gourmet",
      image: require("@/assets/images/categorias/vinos.png"),
    },
    {
      id: "17",
      name: "Mascotas",
      image: require("@/assets/images/categorias/mascotas.png"),
    },
    {
      id: "18",
      name: "Librería y papelería",
      image: require("@/assets/images/categorias/libreria.png"),
    },
    {
      id: "19",
      name: "Outlet Liverpool",
      image: require("@/assets/images/categorias/outlet.png"),
    },
    {
      id: "20",
      name: "Halloween y día de muertos",
      image: require("@/assets/images/categorias/halloween.png"),
    },
    {
      id: "21",
      name: "Navidad",
      image: require("@/assets/images/categorias/navidad.png"),
    },
  ];

  // 🔍 FILTRO
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      {/* 🔻 BUSCADOR + CARRITO (ya bajado del notch) */}
      <View style={styles.header}>
        <TextInput
          placeholder="Buscar por categoría o producto..."
          placeholderTextColor="#777"
          value={query}
          onChangeText={setQuery}
          style={[
            styles.searchInput,
            { borderColor: searchFocused ? RED : "#CFCFCF" },
          ]}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />

        <TouchableOpacity onPress={() => router.push("/cart")}>
          <Image
            source={require("@/assets/images/icon-card.png")}
            style={styles.cartIcon}
          />
        </TouchableOpacity>
      </View>

      {/* GRID */}
      <View style={styles.grid}>
        {filteredCategories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/category-products",
                params: { category: cat.name },
              })
            }
          >
            <Image source={cat.image} style={styles.cardImage} />
            <Text style={styles.cardText}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 70, // Baja del notch
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  searchInput: {
    flex: 1,
    backgroundColor: "#F3F3F3",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 2,
  },

  cartIcon: {
    width: 32,
    height: 32,
    marginLeft: 10,
    resizeMode: "contain",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: RED,
    marginLeft: 16,
    marginBottom: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingHorizontal: 10,
    paddingTop: 10,
  },

  card: {
    width: "42%",
    backgroundColor: "#fafafa",
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },

  cardImage: {
    width: 90,
    height: 90,
    marginBottom: 10,
    resizeMode: "contain",
  },

  cardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});
