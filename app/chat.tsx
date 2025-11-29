// app/chat.tsx
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useChat } from "../hooks/useChat";
import { useCartStore } from "../stores/useCartStore";

const RED = "#EA0040";

export default function ChatScreen() {
  const { messages, loading, sendUserMessage, sendQuickRecommend } = useChat();
  const [message, setMessage] = useState("");

  const scrollRef = useRef<ScrollView>(null);

  const addItem = useCartStore((state) => state.addItem);

  const handleSend = () => {
    if (!message.trim()) return;
    sendUserMessage(message.trim());
    setMessage("");

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 200);
  };

  const buildDescriptionFromChat = (item: any) => {
    const parts: string[] = [];

    if (item.name) parts.push(`NOMBRE: ${item.name};`);
    if (item.group) parts.push(` GRUPO: ${item.group};`);
    if (item.color) parts.push(` COLOR: ${item.color};`);
    if (item.type) parts.push(` TIPO: ${item.type};`);
    if (item.detail || item.details || item.description) {
      const detailValue = item.detail ?? item.details ?? item.description;
      parts.push(` DETALLE: ${detailValue};`);
    }

    const result = parts.join(" ").trim();
    return result || "NOMBRE: Producto;";
  };

  // Comprar ahora → agregar al carrito + mandar a /cart
  const handleAddToCartFromChat = (item: any) => {
    addItem({
      articleId: Number(item.article_id),
      imageUrl: item.image_url ?? "",
      description: item.description_vector ?? buildDescriptionFromChat(item),
    });

    router.push("/cart");
  };

  // Ver detalle → mandar a /product/[id]
  const handleOpenDetailFromChat = (item: any) => {
    router.push({
      pathname: "/product/[id]",
      params: {
        id: String(item.article_id),
        imageUrl: item.image_url ?? "",
        description: item.description_vector ?? buildDescriptionFromChat(item),
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={28} color={RED} />
        </TouchableOpacity>

        <Text style={styles.headerText}>Chat de ayuda</Text>

        <TouchableOpacity onPress={sendQuickRecommend}>
          <IconSymbol name="sparkles" size={26} color={RED} />
        </TouchableOpacity>
      </View>

      {/* MENSAJES */}
      <ScrollView style={styles.chatArea} ref={scrollRef}>
        {/* Mensaje inicial como burbuja del bot */}
        <View style={[styles.msgBubble, styles.botMsg]}>
          <Text style={[styles.msgText, styles.msgTextBot]}>
            ¡Hola! 👋 Soy tu asistente. ¿En qué puedo ayudarte hoy?
          </Text>
        </View>

        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.msgBubble,
              msg.sender === "user" ? styles.userMsg : styles.botMsg,
            ]}
          >
            {msg.text && (
              <Text
                style={[
                  styles.msgText,
                  msg.sender === "user"
                    ? styles.msgTextUser
                    : styles.msgTextBot,
                ]}
              >
                {msg.text}
              </Text>
            )}

            {/* Renderizar productos si vienen en products */}
            {msg.products && (
              <View style={styles.cardList}>
                {msg.products.map((item: any) => (
                  <View key={item.article_id} style={styles.card}>
                    {/* Imagen clickeable → detalle */}
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => handleOpenDetailFromChat(item)}
                    >
                      <Image
                        source={{ uri: item.image_url }}
                        style={styles.cardImage}
                      />
                    </TouchableOpacity>

                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={styles.cardGroup}>{item.group}</Text>

                    {/* Botón COMPRAR AHORA → carrito */}
                    <TouchableOpacity
                      style={styles.buyButton}
                      activeOpacity={0.85}
                      onPress={() => handleAddToCartFromChat(item)}
                    >
                      <Text style={styles.buyButtonText}>Comprar ahora</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {loading && (
          <Text style={styles.loading}>Pensando...</Text>
        )}
      </ScrollView>

      {/* INPUT */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu mensaje..."
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <IconSymbol name="paperplane.fill" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },

  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: RED,
  },

  chatArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F6F7FB",
  },

  // 🔹 Burbuja base
  msgBubble: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    marginBottom: 10,
    maxWidth: "80%",
  },

  // 🔹 Burbuja del usuario
  userMsg: {
    backgroundColor: RED,
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },

  // 🔹 Burbuja del bot
  botMsg: {
    backgroundColor: "#FFE6EC",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },

  // Texto genérico
  msgText: {
    fontSize: 15,
  },
  msgTextUser: {
    color: "#fff",
  },
  msgTextBot: {
    color: "#333",
  },

  loading: {
    marginTop: 10,
    color: "#999",
    fontStyle: "italic",
    alignSelf: "center",
  },

  inputArea: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },

  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 20,
    fontSize: 15,
  },

  sendButton: {
    backgroundColor: RED,
    padding: 12,
    borderRadius: 20,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  /* PRODUCTOS */
  cardList: {
    marginTop: 10,
  },

  card: {
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  cardImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },

  cardName: {
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingTop: 8,
    fontSize: 15,
  },

  cardGroup: {
    paddingHorizontal: 10,
    color: "#888",
    marginBottom: 6,
    fontSize: 13,
  },

  buyButton: {
    backgroundColor: RED,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },

  buyButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
