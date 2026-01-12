import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MESSAGES_KEY = "chat_messages";

type Message = {
  id: string;
  text: string;
  sender: "patient" | "doctor";
  timestamp: number;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [currentRole, setCurrentRole] = useState<"patient" | "doctor">("patient");
  
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets(); 

  const HEADER_HEIGHT_OFFSET = 20 + insets.top;

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const stored = await AsyncStorage.getItem(MESSAGES_KEY);
      if (stored) {
        setMessages(JSON.parse(stored));
      }
    } catch (e) {
      console.log("Error loading messages", e);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: currentRole,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputText("");
    
    await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));
    
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const clearChat = async () => {
    await AsyncStorage.removeItem(MESSAGES_KEY);
    setMessages([]);
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.sender === currentRole;
    return (
      <View style={[styles.bubbleWrapper, isMe ? styles.alignRight : styles.alignLeft]}>
        <View style={[styles.bubble, item.sender === "patient" ? styles.bubblePatient : styles.bubbleDoctor]}>
          <Text style={item.sender === "patient" ? styles.textWhite : styles.textBlack}>
            {item.text}
          </Text>
          <Text style={styles.timestamp}>
            {item.sender === "patient" ? "Pacient" : "Medic"} • {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.demoHeader, { paddingTop: insets.top }]}> 
        <Text style={styles.demoText}>
          Rol curent: {currentRole === "patient" ? "PACIENT" : "MEDIC"}
        </Text>
        
        <TouchableOpacity onPress={() => setCurrentRole(prev => prev === "patient" ? "doctor" : "patient")}>
           <Text style={styles.switchBtn}>Schimbă Rolul</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearChat}>
           <Ionicons name="trash-bin" size={20} color="red" style={{marginLeft: 10}}/>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "padding"} 
        keyboardVerticalOffset={HEADER_HEIGHT_OFFSET}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
          <TextInput
            style={styles.input}
            placeholder={currentRole === "patient" ? "Scrie mesaj ca pacient..." : "Scrie mesaj ca medic..."}
            value={inputText}
            onChangeText={setInputText}
            multiline 
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8fafc" 
  },
  demoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
  },
  demoText: { 
    fontWeight: 'bold', 
    color: '#334155',
    fontSize: 12 
  },
  switchBtn: { 
    color: '#0ea5e9', 
    fontWeight: 'bold',
    fontSize: 12 
  },
  listContent: { 
    padding: 16, 
    gap: 10,
    paddingBottom: 20 
  },
  bubbleWrapper: { 
    width: "100%", 
    flexDirection: "row" 
  },
  alignRight: { justifyContent: "flex-end" },
  alignLeft: { justifyContent: "flex-start" },
  bubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  bubblePatient: {
    backgroundColor: "#0ea5e9", 
    borderBottomRightRadius: 2,
  },
  bubbleDoctor: {
    backgroundColor: "#fff", 
    borderBottomLeftRadius: 2,
  },
  textWhite: { color: "white", fontSize: 16 },
  textBlack: { color: "#0f172a", fontSize: 16 },
  timestamp: { fontSize: 10, opacity: 0.8, color: 'inherit', marginTop: 2 },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "white",
    alignItems: "center",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0"
  },
  input: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10, 
    minHeight: 44,
    maxHeight: 100,
    fontSize: 16,
    color: "#0f172a",
  },
  sendButton: {
    backgroundColor: "#0ea5e9",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});