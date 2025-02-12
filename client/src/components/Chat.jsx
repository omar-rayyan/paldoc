// src/components/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import { Layout, Input, List, Avatar, Typography, notification } from "antd";
import { SendOutlined, FolderOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import { io } from "socket.io-client";
import "../styles/Chat.css";
import FooterMin from "./FooterMin";
import Navbar from "./Navbar";

const { Content, Sider } = Layout;
const { Text } = Typography;

const Chat = () => {
  const [user, setUser] = useState(null);
  const [activeChats, setActiveChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  // Fetch the logged-in user info on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/paldoc/getuser", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        notification.error({ message: "Failed to load user data" });
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8000/api/paldoc/chats", { withCredentials: true })
      .then((response) => {
        setActiveChats(response.data);
      })
      .catch((err) => console.error("Failed to fetch active chats", err));
  }, []);

  useEffect(() => {
    if (!user) return; // Wait until user data is fetched

    const socket = io("http://localhost:8000", {
      withCredentials: true,
    });
    socketRef.current = socket;

    // Register this socket with the logged-in user's ID
    socket.emit("register", user.id);

    // Listen for incoming messages; use currentChatRef for the latest selected chat
    socket.on("receive_message", (data) => {
      if (currentChatRef.current && data.senderId === currentChatRef.current._id) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Whenever a chat is selected (and the user is loaded), fetch the conversation history
  useEffect(() => {
    if (currentChat && user) {
      axios
        .get(`http://localhost:8000/api/paldoc/messages/${currentChat._id}`, { withCredentials: true })
        .then((response) => {
          setMessages(response.data);
          console.log(response.data);
        })
        .catch((err) => console.error("Failed to fetch messages", err));
    }
  }, [currentChat]);

  // Handler for sending a message
  const handleSendMessage = () => {
    if (input.trim() && currentChat && user) {
      const newMessage = {
        senderId: user._id,
        chatId: currentChat._id,
        message: input,
        time: dayjs().format("HH:mm"),
      };

      // Save the message via the REST API
      axios
        .post(
          "http://localhost:8000/api/paldoc/messages/send",
          {
            msg: newMessage,
          },
          { withCredentials: true }
        )
        .then(() => {
          // Append the new message to the conversation
          setMessages((prevMessages) => [...prevMessages, newMessage]);

          setActiveChats((prevChats) =>
            prevChats.map((chat) =>
              chat._id === currentChat._id ? { ...chat, lastMessage: newMessage.message } : chat
            )
          );

          // Emit the message via Socket.io for real-time delivery
          if (socketRef.current) {
            socketRef.current.emit("send_message", {
              ...newMessage,
              recipientId: currentChat._id,
            });
          }
          setInput("");
        })
        .catch((err) => console.error("Failed to send message", err));
    }
  };

  return (
    <>
      {/* Navbar in Header */}
        <Navbar />

      {/* Main Content Area */}
      <Content style={{ padding: "24px", background: "#f0f2f5" }}>
        <Layout style={{ background: "#fff", minHeight: "80vh" }}>
          {/* Chat Sidebar */}
          <Sider
            width={250}
            className="chat-sidebar"
            style={{ background: "#fff", borderRight: "1px solid #f0f0f0" }}
          >
            <List
              itemLayout="horizontal"
              dataSource={activeChats}
              renderItem={(chat) => (
                <List.Item
                  onClick={() => setCurrentChat(chat)}
                  className={currentChat && currentChat._id === chat._id ? "active-chat" : ""}
                  style={{ cursor: "pointer", padding: "12px" }}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={chat.pic} />}
                    title={`${chat.firstName} ${chat.lastName}`}
                    description={chat.lastMessage || "No messages yet"}
                  />
                </List.Item>
              )}
            />
          </Sider>

          {/* Chat Window */}
          <Content className="chat-window" style={{ padding: "16px", overflowY: "auto" }}>
            {currentChat ? (
              <>
                <div
                  className="chat-header"
                  style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}
                >
                  <Avatar src={currentChat.pic} />
                  <Text strong style={{ marginLeft: "8px" }}>
                    {`${currentChat.firstName} ${currentChat.lastName}`}
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
                      className={`chat-message ${msg.senderId === user._id ? "mine" : "theirs"}`}
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
                <Text type="secondary">Select a chat to start messaging</Text>
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
