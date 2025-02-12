// src/components/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import { Layout, Input, List, Typography, notification } from "antd";
import { SendOutlined, FolderOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import { io } from "socket.io-client";
import "../styles/Chat.css";
import FooterMin from "./FooterMin";
import Navbar from "./Navbar";
import OptimizedAvatar from "./OptimizedAvatar";  // <-- Import the new component

const { Content, Sider } = Layout;
const { Text } = Typography;
const { Search } = Input;
const AI_ASSISTANT_ID = "64a123456789abcdef123456";

const Chat = () => {
  const [user, setUser] = useState(null);
  const [activeChats, setActiveChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [searchText, setSearchText] = useState("");
  const socketRef = useRef();
  const currentChatRef = useRef(currentChat);
  const messagesEndRef = useRef(null);

  // Always update currentChatRef when currentChat changes
  useEffect(() => {
    currentChatRef.current = currentChat;
  }, [currentChat]);

  // Scroll to the bottom of messages on update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Helper to get the chat partner (the user who is not the logged-in user)
  const getChatPartner = (chat) => {
    if (!user || !chat || !Array.isArray(chat.participants)) return {};
    return (
      chat.participants.find((participant) => {
        if (!participant || !participant._id || !user._id) return false;
        return participant._id.toString() !== user._id.toString();
      }) || {}
    );
  };  

  // Fetch logged-in user info on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/paldoc/getuser",
          { withCredentials: true }
        );
        setUser(response.data);
      } catch (error) {
        notification.error({ message: "Failed to load user data" });
      }
    };
    fetchUserData();
  }, []);

  // Fetch active chats (the API returns Chat documents with populated participants)
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/paldoc/chats", {
        withCredentials: true,
      })
      .then((response) => {
        setActiveChats(response.data);
      })
      .catch((err) => console.error("Failed to fetch active chats", err));
  }, []);

  // Set up socket connection (using currentChatRef to check the current chat)
  useEffect(() => {
    if (!user) return; // Wait until user data is fetched

    const socket = io("http://localhost:8000", {
      withCredentials: true,
    });
    socketRef.current = socket;

    // Register this socket with the logged-in user's ID
    socket.emit("register", user._id.toString());

    // Listen for incoming messages
    socket.on("receive_message", (data) => {
      if (
        currentChatRef.current &&
        data.chatId.toString() === currentChatRef.current._id.toString()
      ) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
      setActiveChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id.toString() === data.chatId.toString()
            ? { ...chat, lastMessage: data.message }
            : chat
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // When a chat is selected, fetch its conversation history
  useEffect(() => {
    if (currentChat && user) {
      axios
        .get(`http://localhost:8000/api/paldoc/messages/${currentChat._id}`, {
          withCredentials: true,
        })
        .then((response) => {
          setMessages(response.data);
          console.log("Messages:", response.data);
        })
        .catch((err) => console.error("Failed to fetch messages", err));
    }
  }, [currentChat, user]);

  // Handler for sending a message (updated to include recipientId)
  const handleSendMessage = () => {
    if (input.trim() && currentChat && user) {
      const chatPartner = getChatPartner(currentChat);
      // Check whether the selected chat is with the AI assistant
      if (chatPartner._id === AI_ASSISTANT_ID) {
        // Handle AI chat message
        axios.post(
          "http://localhost:8000/api/paldoc/ai-chat-message",
          { message: input, chatId: currentChat._id },
          { withCredentials: true }
        )
        .then((response) => {
          // Add the user's message
          setMessages(prev => [
            ...prev,
            { senderId: user._id, message: input, time: dayjs().format("HH:mm") }
          ]);
          // Add the AI's response
          setMessages(prev => [
            ...prev,
            { senderId: AI_ASSISTANT_ID, message: response.data.aiResponse, time: dayjs().format("HH:mm") }
          ]);
          // Update the last message preview in the active chats list
          setActiveChats(prevChats =>
            prevChats.map(chat =>
              chat._id === currentChat._id
                ? { ...chat, lastMessage: response.data.aiResponse }
                : chat
            )
          );
          setInput("");
        })
        .catch(err => console.error("Failed to send AI message", err));
      } else {
        // Regular chat message sending (your existing code)
        const newMessage = {
          senderId: user._id,
          chatId: currentChat._id,
          message: input,
          time: dayjs().format("HH:mm"),
        };
  
        axios
          .post(
            "http://localhost:8000/api/paldoc/messages/send",
            { msg: newMessage },
            { withCredentials: true }
          )
          .then(() => {
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setActiveChats(prevChats =>
              prevChats.map(chat =>
                chat._id === currentChat._id
                  ? { ...chat, lastMessage: newMessage.message }
                  : chat
              )
            );
            if (socketRef.current) {
              socketRef.current.emit("send_message", {
                ...newMessage,
                recipientId: chatPartner._id,
              });
            }
            setInput("");
          })
          .catch(err => console.error("Failed to send message", err));
      }
    }
  };

  // Filter active chats by the chat partner's name using the search text
  const filteredChats = activeChats.filter((chat) => {
    const partner = getChatPartner(chat);
    const fullName = `${partner.firstName || ""} ${partner.lastName || ""}`.trim();
    return fullName.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <>
      <Navbar />
      <Content style={{ padding: "24px", background: "#f0f2f5" }}>
        <Layout style={{ background: "#fff", minHeight: "80vh" }}>
          {/* Chat Sidebar */}
          <Sider
            width={250}
            className="chat-sidebar"
            style={{ background: "#fff", borderRight: "1px solid #f0f0f0" }}
          >
            <div style={{ padding: "12px" }}>
              <Search
                placeholder="Search chats"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                enterButton
              />
            </div>
            <List
              itemLayout="horizontal"
              dataSource={filteredChats}
              renderItem={(chat) => {
                const partner = getChatPartner(chat);
                return (
                  <List.Item
                    onClick={() => setCurrentChat(chat)}
                    className={
                      currentChat && currentChat._id === chat._id
                        ? "active-chat"
                        : ""
                    }
                    style={{ cursor: "pointer", padding: "12px" }}
                  >
                    <List.Item.Meta
                      avatar={<OptimizedAvatar src={partner.pic} size={50} />}
                      title={partner.firstName || partner.lastName ? `${partner.firstName || ""} ${partner.lastName || ""}`.trim() : "AI Health Assistant"}
                      description={chat.lastMessage || "No messages yet"}
                    />
                  </List.Item>
                );
              }}
            />
          </Sider>
          {/* Chat Window */}
          <Content
            className="chat-window"
            style={{ padding: "16px", overflowY: "auto" }}
          >
            {currentChat ? (
              <>
                <div
                  className="chat-header"
                  style={{
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <OptimizedAvatar
                    src={getChatPartner(currentChat).pic}
                    size={50}
                  />
                  <Text strong style={{ marginLeft: "8px" }}>
                    {`${getChatPartner(currentChat).firstName || ""} ${getChatPartner(currentChat).lastName || ""}`.trim() || "PalDoc AI Health Assistant"}
                  </Text>
                </div>
                <div
                  className="chat-messages"
                  style={{
                    marginBottom: "16px",
                    height: "calc(100vh - 300px)",
                    overflowY: "auto",
                  }}
                >
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`chat-message ${
                        msg.senderId === user._id ? "mine" : "theirs"
                      }`}
                      style={{ marginBottom: "8px" }}
                    >
                      <div className="message-content">{msg.message}</div>
                      <div className="message-time">{msg.time}</div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="chat-input-container">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    onPressEnter={handleSendMessage}
                    addonBefore={
                      <FolderOutlined
                        onClick={() => console.log("Folder icon clicked")}
                        style={{ cursor: "pointer" }}
                      />
                    }
                    addonAfter={
                      <SendOutlined
                        onClick={handleSendMessage}
                        style={{ cursor: "pointer" }}
                      />
                    }
                  />
                </div>
              </>
            ) : (
              <div
                className="no-chat-selected"
                style={{ textAlign: "center", marginTop: "50px" }}
              >
                <Text type="secondary">
                  Select a chat to start messaging
                </Text>
              </div>
            )}
          </Content>
        </Layout>
      </Content>
      <FooterMin />
    </>
  );
};

export default Chat;
