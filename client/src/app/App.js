"use client"; // Ensure this is a Client Component

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Typography, Divider, Space, Layout } from "antd";
import { GoogleOutlined, WindowsOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Content } = Layout;

const LoginPage = () => {
  const router = useRouter();

  const onFinish = (values) => {
    console.log("Success:", values);
    router.push("/Dashboard"); // Redirect after login
  };

  const handleSSOClick = () => {
    router.push("/Dashboard"); // Redirect to dashboard
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px" }}>
      {/* Logo Section */}
      <Image 
        src="/assets/Logo_Klein.png" 
        alt="TalentTrack Logo" 
        width={140} 
        height={140} 
        style={{ marginBottom: 16, opacity: 0.9 }}
      />

      {/* Headline */}
      <Title level={2} style={{ color: "#ededed", textAlign: "center" }}>
        Welcome Back
      </Title>
      <Text style={{ color: "#ccc", textAlign: "center" }}>
        Sign in to continue exploring TalentTrack
      </Text>

      {/* Login Form */}
      <Form layout="vertical" style={{ marginTop: 24, width: "100%", maxWidth: "400px" }} onFinish={onFinish}>
        <Form.Item 
          name="email" 
          rules={[{ required: true, message: "Please enter your email!" }]}
        >
          <Input 
            placeholder="email@domain.com" 
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            size="large"
          >
            Sign in with Email
          </Button>
        </Form.Item>
      </Form>

      <Divider style={{ borderColor: "#444", color: "#ccc", width: "100%", maxWidth: "400px" }}>or sign in with</Divider>

      {/* Social Login Options */}
      <Space direction="vertical" style={{ width: "100%", maxWidth: "400px" }}>
        <Button 
          block 
          icon={<WindowsOutlined />} 
          style={{ backgroundColor: "#333", color: "white" }}
          onClick={handleSSOClick}
        >
          Sign in with Microsoft
        </Button>

        <Button 
          block 
          icon={<GoogleOutlined />} 
          style={{ backgroundColor: "#d32f2f", color: "white" }}
          onClick={handleSSOClick}
        >
          Sign in with Google
        </Button>
      </Space>

      {/* Footer Section */}
      <footer style={{ marginTop: 24, color: "#777", fontSize: "14px", textAlign: "center" }}>
        <p> 
          Need help? <Link href="#" style={{ color: "#1890ff" }}>Contact Support</Link>
        </p>
      </footer>
    </Layout>
  );
};

export default LoginPage;