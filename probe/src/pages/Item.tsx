import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  HomeOutlined,
  FrownOutlined,
  MehOutlined,
  SmileOutlined
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  DatePicker,
  Breadcrumb,
  Space,
  Popconfirm,
  Skeleton,
  Rate,
  AutoComplete,
  Row,
  InputNumber
} from "antd";
const { Option } = AutoComplete;
import { RevPub } from "@revpub/api";
import { Item, ItemPartial, ItemWithId } from "@revpub/types";
import { ObjectId } from 'bson';
import dayjs from "dayjs";

const customIcons: Record<number, React.ReactNode>  = {
  1: <FrownOutlined />,
  3: <MehOutlined />,
  5: <SmileOutlined />
};

interface ActivityOption {
  key: string,
  value: string
}

interface ItemProps {
  createMode: boolean;
}

const TimeEntry: React.FC<ItemProps> = ({createMode}) => {
  const navigate = useNavigate();
  const routeParams = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState<object>();

  const [form] = Form.useForm()

  const sendDeleteItem = (id: string) => {
    RevPub.Item.deleteItem(
      id,
      () => {
        navigate("/myItems");
      },
      () => {
        alert("Unable to delete item.");
      }
    );
  };

  const onFinish = (values: any) => {

    const itemName = values.itemName;
    if (itemName === undefined) {
      console.log("No item name");
      return;
    }

    const providerName = values.providerName;
    if (providerName === undefined) {
      console.log("No provider name");
      return;
    }

    const producerName = values.producerName;
    if (producerName === undefined) {
      console.log("No producer name");
      return;
    }

    if (createMode) {

      const possessorId = localStorage.getItem("user-id");
      if (possessorId === null) {
        return;
      }

      const item = Item.parse({
        possessorId: possessorId,
        itemName: itemName,
        providerName: providerName,
        producerName: producerName
      });
  
      RevPub.Item.createItem(
        item,
        () => {
          navigate("/myItems");
        },
        () => {
          alert("Unable to create item");
        }
      );
    } else {

      const id = routeParams.id;
      if (id === undefined) {
        return;
      }

      const item = ItemPartial.parse({
        itemName: itemName,
        providerName: providerName,
        producerName: producerName
      });

      RevPub.Item.updateItem(
        id,
        item,
        () => {
          navigate("/myItems");
        },
        () => {
          alert("Unable to update item");
        }
      );
    }

  };

  const onFinishFailed = (errorInfo: {}) => {
    console.log("Failed:", errorInfo);
  };

  const onDelete = () => {
    const id = routeParams.id;
    if (id !== undefined) {
      sendDeleteItem(id);
    }
  };

  useEffect(() => {

    if (!createMode) {

      const id = routeParams.id;
      if (id === undefined) {
        return;
      }

      RevPub.Item.getItem(
        id,
        (data) => {
          setItem(data);
          setIsLoading(false);
        },
        () => {
          alert("Unable to get item.");
        }
      );
    } else {
      setIsLoading(false);
    }

  }, []);

  const formButtons = () => {
    if (createMode) {
      return (
        <React.Fragment>
          <Button type="primary" htmlType="submit">
            Create Item
          </Button>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Button type="primary" htmlType="submit">
            Update Item
          </Button>
          <Popconfirm
            title="Delete Item"
            description="Are you sure you want to delete this item?"
            onConfirm={onDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" htmlType="button" danger>
              Delete Item
            </Button>
          </Popconfirm>
        </React.Fragment>
      );
    }
  }

  return (

    <React.Fragment>
      <Breadcrumb
        items={[
          {
            title: (
              <Link to={"/"}>
                <HomeOutlined />
              </Link>
            ),
          },
          {
            title: <Link to={"/myItems"}>My Items</Link>,
          },
          {
            title: createMode ? "Create Item" : "Show Item",
          },
        ]}
      />
      <h1>{ createMode ? "Create Item" : "Show Item" }</h1>
      {isLoading && <Skeleton active />}
      {!isLoading && (
        <Form
          name="updateItemForm"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={item}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >

          <Form.Item
            label="Item Name"
            name="itemName"
            rules={[
              {
                required: true,
                message: "Please input the item name",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Provider Name"
            name="providerName"
            rules={[
              {
                required: true,
                message: "Please input the provider name",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Producer Name"
            name="producerName"
            rules={[
              {
                required: true,
                message: "Please input the producer name",
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
            <Space direction="horizontal">
              { formButtons() }
            </Space>
          </Form.Item>
        </Form>
      )}
    </React.Fragment>
  );
};
export default TimeEntry;
