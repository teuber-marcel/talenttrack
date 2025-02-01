"use client"; // Ensure this is a Client Component

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Typography, Divider } from "antd";
import { GoogleOutlined, WindowsOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

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
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white px-6 py-8">
      {/* Logo Section */}
      <Image 
        src="/assets/Logo_Klein.png" 
        alt="TalentTrack Logo" 
        width={140} 
        height={140} 
        className="mb-6 opacity-90 drop-shadow-lg"
      />

      {/* Headline */}
      <Title level={1} className="text-white !text-white font-extrabold text-4xl tracking-tight mb-2 !text-[#ededed]">
        Welcome Back
      </Title>
      <Text className="text-white mb-6 text-lg">
        Sign in to continue exploring TalentTrack
      </Text>

      {/* Login Form */}
      <Form layout="vertical" className="w-full max-w-sm space-y-4" onFinish={onFinish}>
        <Form.Item 
          name="email" 
          rules={[{ required: true, message: "Please enter your email!" }]}
        >
          <Input 
            placeholder="email@domain.com" 
            size="large"
            className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200 px-4 py-3"
            style={{ color: "black" }}
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            size="large" 
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 rounded-lg shadow-md font-semibold py-3"
          >
            Sign in with Email
          </Button>
        </Form.Item>
      </Form>

      <Divider className="w-full max-w-sm border-gray-700 !text-[#ededed]">or sign in with</Divider>

      {/* Social Login Options */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <Button 
          block 
          icon={<WindowsOutlined />} 
          className="bg-gray-900 text-white hover:bg-gray-800 border border-gray-700 rounded-lg py-3 transition-all duration-200 flex items-center justify-center font-semibold"
          onClick={handleSSOClick}
        >
          Sign in with Microsoft
        </Button>

        <Button 
          block 
          icon={<GoogleOutlined />} 
          className="bg-red-600 text-white hover:bg-red-700 border border-gray-700 rounded-lg py-3 transition-all duration-200 flex items-center justify-center font-semibold"
          onClick={handleSSOClick}
        >
          Sign in with Google
        </Button>
      </div>

      {/* Footer Section */}
      <footer className="mt-10 text-gray-500 text-sm">
        <p> 
          Need help? <Link href="#" className="text-blue-400 hover:text-blue-500">Contact Support</Link>
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
