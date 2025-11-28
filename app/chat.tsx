import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Alert } from "react-native";
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

const RED = "#EA0040";

export default function ChatScreen() {
  const { messages, loading, sendUserMessage, sendQuickRecommend } = useChat();
  const [message, setMessage] = useState("");

  const scrollRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!message.trim()) return;
    sendUserMessage(message.trim());
    setMessage("");

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 200);
  };

  // 🔹 Navegar al detalle del producto desde el chat
  const handleBuyNow = (item: any) => {
    router.push({
      pathname: "/product/[id]",
      params: {
        id: String(item.article_id),
        imageUrl: item.image_url ?? "",
        description: item.description_vector ?? "", // si tu API lo manda
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

        {/* Botón de recomendaciones rápidas */}
        <TouchableOpacity onPress={sendQuickRecommend}>
          <IconSymbol name="sparkles" size={26} color={RED} />
        </TouchableOpacity>
      </View>

      {/* MENSAJES */}
      <ScrollView style={styles.chatArea} ref={scrollRef}>
        {/* Mensaje inicial */}
        <Text style={styles.botMsg}>
          ¡Hola! 👋 Soy tu asistente. ¿En qué puedo ayudarte hoy?
        </Text>

        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.msgBubble,
              msg.sender === "user" ? styles.userMsg : styles.botMsg,
            ]}
          >
            {msg.text && <Text style={styles.msgText}>{msg.text}</Text>}

            {/* Renderizar productos si vienen en products */}
            {msg.products && (
              <View style={styles.cardList}>
                {msg.products.map((item: any) => (
                  <View style={styles.card} key={item.article_id}>
                    <Image
                      source={{ uri: item.image_url }}
                      style={styles.cardImage}
                    />
                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={styles.cardGroup}>{item.group}</Text>

                    {/* Botón COMPRAR AHORA */}
                    <TouchableOpacity
  style={styles.buyButton}
  onPress={() => Alert.alert("Producto listo para comprar")}
>
  <Text style={styles.buyButtonText}>Comprar ahora</Text>
</TouchableOpacity>

                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {loading && <Text style={styles.loading}>Pensando... 🤖💭</Text>}
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
  },

  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: RED,
  },

  chatArea: {
    flex: 1,
    padding: 20,
  },

  msgBubble: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    maxWidth: "85%",
  },

  userMsg: {
    backgroundColor: RED,
    alignSelf: "flex-end",
  },

  botMsg: {
    backgroundColor: "#FFE6EC",
    alignSelf: "flex-start",
  },

  msgText: {
    color: "#333",
  },

  loading: {
    marginTop: 10,
    color: "#999",
    fontStyle: "italic",
  },

  inputArea: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
  },

  sendButton: {
    backgroundColor: RED,
    padding: 12,
    borderRadius: 10,
    marginLeft: 10,
  },

  /* PRODUCTOS */
  cardList: {
    marginTop: 10,
  },

  card: {
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  cardImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },

  cardName: {
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingTop: 8,
  },

  cardGroup: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    color: "#888",
  },

  buyButton: {
    backgroundColor: RED,
    marginHorizontal: 8,
    marginBottom: 10,
    marginTop: 4,
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
