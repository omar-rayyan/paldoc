import React, { useState } from "react";
import { Layout, Input, List, Avatar, Typography } from "antd";
import { SendOutlined, FolderOutlined } from "@ant-design/icons"; // Import FolderOutlined
import dayjs from "dayjs";
import "../styles/Chat.css";
import Footer from "./Footer";
import Navbar from "./Navbar";

const { Sider, Content } = Layout;
const { Text } = Typography;

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Mario Gomez", text: "How Are you", time: "15:41", mine: false },
    { id: 2, sender: "Me", text: "sure m8", time: "15:45", mine: true },
    { id: 3, sender: "Mario Gomez", text: "okay it's fine", time: "15:41", mine: false },
    { id: 4, sender: "Me", text: "Thanks", time: "15:45", mine: true },
  ]);
  
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, sender: "Me", text: input, time: dayjs().format("HH:mm"), mine: true }]);
      setInput("");
    }
  };

  const handleFolderClick = () => {
    // Handle folder icon click (e.g., open file picker or folder)
    console.log("Folder icon clicked");
  };

  return (
    <div className="chat-container">
      <Navbar />
      
      <div className="chat-main">
        {/* Sidebar */}
        <Sider className="chat-sidebar">
          <List
            itemLayout="horizontal"
            dataSource={[
              { name: "Andre Silva", lastMessage: "How are you?" },
              { name: "Marco Reus", lastMessage: "Sehr gut, Danke" },
              { name: "Antoine Griezmann", lastMessage: "Let's 1v1 in FIFA20!" },
              { name: "Iqbal Taufiq", lastMessage: "" },
            ]}
            renderItem={(item) => (
              <List.Item className="chat-item">
                <List.Item.Meta
                  avatar={<Avatar>{item.name.charAt(0)}</Avatar>}
                  title={<Text strong>{item.name}</Text>}
                  description={<Text type="secondary">{item.lastMessage}</Text>}
                />
              </List.Item>
            )}
          />
        </Sider>

        {/* Chat Window */}
        <Content className="chat-content">
          {/* Chat messages container */}
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.mine ? "mine" : "theirs"}`}>
                <Text>{msg.text}</Text>
                <Text type="secondary" className="chat-time">{msg.time}</Text>
              </div>
            ))}
          </div>

          {/* Input Box with Icons */}
          <div className="chat-input">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type something..."
              onPressEnter={sendMessage}
              suffix={
                <div className="chat-icons">
                  <FolderOutlined onClick={handleFolderClick} style={{ cursor: "pointer", marginRight: 8 }} />
                  <SendOutlined onClick={sendMessage} style={{ cursor: "pointer" }} />
                </div>
              }
            />
          </div>
        </Content>
      </div>

      <Footer /> 
    </div>
  );
};

export default Chat;