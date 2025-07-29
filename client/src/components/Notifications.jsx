import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  List,
  Typography,
  Button,
  Badge,
  message,
  Popconfirm,
  Space,
  Empty,
} from "antd";
import {
  BellOutlined,
  DeleteOutlined,
  CheckOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Navbar from "./Navbar";
import FooterMin from "./FooterMin";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/paldoc/notifications", {
        withCredentials: true,
      });
      setNotifications(response.data);
    } catch (error) {
      message.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:8000/api/paldoc/notifications/${notificationId}/read`, {}, {
        withCredentials: true,
      });
      
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      message.success("Notification marked as read");
    } catch (error) {
      message.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put("http://localhost:8000/api/paldoc/notifications/mark-all-read", {}, {
        withCredentials: true,
      });
      
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      message.success("All notifications marked as read");
    } catch (error) {
      message.error("Failed to mark all notifications as read");
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:8000/api/paldoc/notifications/${notificationId}`, {
        withCredentials: true,
      });
      
      setNotifications(prev =>
        prev.filter(notif => notif._id !== notificationId)
      );
      message.success("Notification deleted");
    } catch (error) {
      message.error("Failed to delete notification");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment_booked':
        return <BellOutlined style={{ color: '#1890ff' }} />;
      case 'appointment_finished':
        return <CheckOutlined style={{ color: '#52c41a' }} />;
      case 'doctor_approved':
        return <EyeOutlined style={{ color: '#722ed1' }} />;
      default:
        return <BellOutlined />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
      <Content style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <Title level={2}>
              <BellOutlined /> Notifications
              {unreadCount > 0 && (
                <Badge count={unreadCount} style={{ marginLeft: "10px" }} />
              )}
            </Title>
            {unreadCount > 0 && (
              <Button 
                type="primary" 
                onClick={markAllAsRead}
                icon={<CheckOutlined />}
              >
                Mark All as Read
              </Button>
            )}
          </div>

          {notifications.length === 0 ? (
            <Empty 
              description="No notifications yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <List
              loading={loading}
              dataSource={notifications}
              renderItem={(notification) => (
                <List.Item
                  style={{
                    backgroundColor: notification.isRead ? 'transparent' : '#f6ffed',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    border: notification.isRead ? '1px solid #f0f0f0' : '1px solid #b7eb8f'
                  }}
                  actions={[
                    !notification.isRead && (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => markAsRead(notification._id)}
                        icon={<EyeOutlined />}
                      >
                        Mark as Read
                      </Button>
                    ),
                    <Popconfirm
                      title="Are you sure you want to delete this notification?"
                      onConfirm={() => deleteNotification(notification._id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        type="link"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                      >
                        Delete
                      </Button>
                    </Popconfirm>
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    avatar={getNotificationIcon(notification.type)}
                    title={
                      <Space>
                        <Text strong={!notification.isRead}>
                          {notification.title}
                        </Text>
                        {!notification.isRead && (
                          <Badge dot />
                        )}
                      </Space>
                    }
                    description={
                      <div>
                        <Text>{notification.message}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {formatDate(notification.createdAt)}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </Content>
      <FooterMin />
    </Layout>
  );
}