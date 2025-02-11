import React from "react";
import { Layout, Menu, Divider, Typography } from "antd";
import {
  UserOutlined,
  SolutionOutlined,
  CalendarOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import AllAppointments from "../components/AllAppointments";
import { Link } from "react-router-dom";

const { Sider, Content } = Layout;
const { Title } = Typography;

const AppointmentsPageAdmin = () => {
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider theme="dark" collapsible>
          <div style={{ padding: "1vh", textAlign: "center" }}>
            <Title level={4} style={{ color: "white", margin: 0 }}>
              Admin Dashboard
            </Title>
          </div>
          <Divider style={{ background: "rgba(255, 255, 255, 0.2)" }} />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["3"]}>
            <Menu.Item key="1" icon={<UserOutlined />}>
              <Link to="/admin/patients">Patients</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<SolutionOutlined />}>
              <Link to="/admin/doctors">Doctors</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<CalendarOutlined />}>
              <Link to="/admin/appointments">Appointments</Link>
            </Menu.Item>
            <Divider style={{ background: "rgba(255, 255, 255, 0.2)" }} />
            <Menu.Item key="4" icon={<HomeOutlined />}>
              <Link to="/">Back To Home</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ padding: "20px" }}>
            <AllAppointments />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default AppointmentsPageAdmin;
