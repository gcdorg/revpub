import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Form, Checkbox, Space } from "antd";
import { RevPub } from "@revpub/api";

interface FormValues {
  username?: string;
  password?: string;
  remember?: boolean;
}

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values: FormValues) => {
    const username = values.username;
    if (username === undefined) {
      return;
    }

    const password = values.password;
    if (password === undefined) {
      return;
    }

    RevPub.Auth.login(
      {
        username: username,
        password: password,
      },
      (data) => {
        const accessToken = data.accessToken;
        const refreshToken = data.refreshToken;
        const userId = data.userId;
        const avatarUrl = data.avatarUrl;
        if (!accessToken || !refreshToken) {
          alert("Unable to login. Please try after some time.");
          return;
        }
        localStorage.clear();
        localStorage.setItem("access-token", accessToken);
        localStorage.setItem("refresh-token", refreshToken);
        localStorage.setItem("user-id", userId.toString());

        if (avatarUrl !== undefined) {
          localStorage.setItem("user-avatar-url", avatarUrl);
        }
        setTimeout(() => {
          navigate("/");
        }, 500);
      },
      () => {
        alert("Unable to login. Please try after some time.");
      }
    );
  };

  const onFinishFailed = (errorInfo: {}) => {
    // console.log("Failed:", errorInfo);
  };

  const onCreateAccountButtonClick = () => {
    navigate("/auth/register");
  };

  return (
    <React.Fragment>
      <h1>Login</h1>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Space
        direction="horizontal"
        style={{ width: "100%", justifyContent: "center" }}
      >
        <div>New to Probe?</div>
        <Button onClick={onCreateAccountButtonClick}>
          Create a Probe Account
        </Button>
      </Space>
    </React.Fragment>
  );
};

export default Login;
