import React, { useState, useEffect } from "react";
import { Badge, Dropdown, List, Typography, Button, Empty, message } from "antd";
import { BellOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const { Text } = Typography;

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUnreadCount();
    fetchRecentNotifications();
    
    // Setup socket connection for real-time notifications
    const socket = io("http://localhost:8000", { withCredentials: true });
    
    // For now, we'll rely on the server to identify the user via JWT
    // The socket connection will use the same credentials
    
    // Listen for new notifications
    socket.on('receive_notification', (data) => {
      if (data.notification) {
        setNotifications(prev => [data.notification, ...prev.slice(0, 4)]);
        setUnreadCount(prev => prev + 1);
        
        // Show a brief message
        message.info({
          content: data.notification.title,
          duration: 3,
          icon: <BellOutlined />
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/paldoc/notifications/unread-count", {
        withCredentials: true,
      });
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const fetchRecentNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/paldoc/notifications", {
        withCredentials: true,
      });
      // Show only the 5 most recent notifications in dropdown
      setNotifications(response.data.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
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
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffMinutes / 1440)}d ago`;
    }
  };

  const dropdownMenu = (
    <div style={{ width: 320, maxHeight: 400, overflowY: 'auto' }}>
      <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0', fontWeight: 'bold' }}>
        Notifications
      </div>
      {notifications.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Empty 
            description="No notifications"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ margin: 0 }}
          />
        </div>
      ) : (
        <List
          dataSource={notifications}
          renderItem={(notification) => (
            <List.Item
              style={{
                padding: '12px 16px',
                backgroundColor: notification.isRead ? 'transparent' : '#f6ffed',
                cursor: 'pointer'
              }}
              onClick={() => {
                if (!notification.isRead) {
                  markAsRead(notification._id);
                }
              }}
            >
              <List.Item.Meta
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong={!notification.isRead} style={{ fontSize: '14px' }}>
                      {notification.title}
                    </Text>
                    {!notification.isRead && (
                      <Badge dot />
                    )}
                  </div>
                }
                description={
                  <div>
                    <Text style={{ fontSize: '12px', color: '#666' }}>
                      {notification.message}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                      {formatDate(notification.createdAt)}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
      <div style={{ padding: '8px 16px', borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
        <Button 
          type="link" 
          size="small"
          onClick={() => {
            setVisible(false);
            navigate('/notifications');
          }}
        >
          View All Notifications
        </Button>
      </div>
    </div>
  );

  return (
    <Dropdown
      overlay={dropdownMenu}
      trigger={['click']}
      visible={visible}
      onVisibleChange={setVisible}
      placement="bottomRight"
    >
      <Badge count={unreadCount} size="small">
        <Button
          type="text"
          icon={<BellOutlined />}
          style={{ 
            border: 'none',
            color: unreadCount > 0 ? '#1890ff' : 'inherit'
          }}
        />
      </Badge>
    </Dropdown>
  );
}