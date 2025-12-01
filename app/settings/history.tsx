// app/settings/history.tsx
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { IconButton } from "react-native-paper";
// Ajusta la ruta según la ubicación real de useAuthStore
import { useAuthStore } from "../../stores/useAuthStore";

const RED = "#EA0040";
const API_BASE = "http://localhost:3000";

type Purchase = {
  customerId: string;
  articleId: number;
  price: number;
  year: number;
  month: number;
  dayOfWeek: number;
  day: number;
  priceScaled: number;
  channel: number;
};

export default function HistoryScreen() {
  const router = useRouter();

  // 👇 tipamos el parámetro como any para quitar el error ts(7006)
  const customerId = useAuthStore((state: any) => state.customer_id);

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!customerId) {
        setLoading(false);
        setError("Inicia sesión para ver tu historial de compras.");
        return;
      }

      try {
        const url = `${API_BASE}/api/purchases?customerId=${encodeURIComponent(
          customerId
        )}`;

        const res = await fetch(url);

        if (!res.ok) {
          setError(`Error del servidor (${res.status})`);
          setLoading(false);
          return;
        }

        const json = await res.json();

        if (!json.success) {
          setError(json.message || "No se pudo cargar el historial.");
        } else {
          setPurchases(json.data || []);
        }
      } catch (e) {
        console.error("Error cargando historial:", e);
        setError("Error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [customerId]);

  const formatDate = (p: Purchase) => {
    const dd = String(p.day).padStart(2, "0");
    const mm = String(p.month).padStart(2, "0");
    const yyyy = p.year;
    return `${dd}/${mm}/${yyyy}`;
  };

  const renderItem = ({ item }: { item: Purchase }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.articleId}>Artículo #{item.articleId}</Text>
        <Text style={styles.dateText}>Fecha: {formatDate(item)}</Text>
        <Text style={styles.channelText}>
          Canal: {item.channel === 1 ? "Tienda física" : "Online"}
        </Text>
      </View>

      <View style={styles.cardRight}>
        <Text style={styles.priceLabel}>Precio</Text>
        <Text style={styles.priceValue}>${item.price.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <IconButton icon="arrow-left" size={26} iconColor={RED} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Mis compras</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* ESTADOS */}
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={RED} />
            <Text style={styles.helperText}>Cargando historial...</Text>
          </View>
        )}

        {!loading && error && (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!loading && !error && purchases.length === 0 && (
          <View style={styles.center}>
            <Text style={styles.helperText}>
              Aún no tienes compras registradas.
            </Text>
          </View>
        )}

        {!loading && !error && purchases.length > 0 && (
          <FlatList
            contentContainerStyle={styles.listContent}
            data={purchases}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    marginLeft: -10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: RED,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  helperText: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: RED,
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fafafa",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardLeft: {
    flexShrink: 1,
  },
  articleId: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  dateText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  channelText: {
    fontSize: 13,
    color: "#888",
  },
  cardRight: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  priceLabel: {
    fontSize: 13,
    color: "#888",
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "700",
    color: RED,
  },
});
