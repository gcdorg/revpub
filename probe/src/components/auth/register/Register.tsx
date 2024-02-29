import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Form } from "antd";
import { RevPub } from "@revpub/api";

interface RegisterFormValues {
  username?: string | undefined;
  password?: string | undefined;
  email?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
}

const Register = () => {
  const navigate = useNavigate();

  const sendRegister = (values: RegisterFormValues) => {
    const { username, password, email, firstName, lastName } = values;

    if (username === undefined) {
      return;
    }

    if (password === undefined) {
      return;
    }

    if (email === undefined) {
      return;
    }

    if (firstName === undefined) {
      return;
    }

    if (lastName === undefined) {
      return;
    }

    RevPub.User.createUser(
      {
        username: username,
        password: password,
        email: email,
        firstName: firstName,
        lastName: lastName
      },
      () => {
        navigate("/auth/login");
      },
      () => {
        alert("Unable to register. Please try after some time.");
      }
    );
  };

  const onFinish = (values: RegisterFormValues) => {
    sendRegister(values);
  };
  const onFinishFailed = (errorInfo: {}) => {
    // console.log("Failed:", errorInfo);
  };
  return (
    <React.Fragment>
      <h1>Register</h1>
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
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email address!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="First Name"
          name="firstName"
          rules={[
            {
              required: true,
              message: "Please input your first name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[
            {
              required: true,
              message: "Please input your last name!",
            },
          ]}
        >
          <Input />
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
    </React.Fragment>
  );
};

export default Register;
