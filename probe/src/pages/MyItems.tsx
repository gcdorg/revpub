import React, { useEffect, useState } from "react";
import { Button, Table, Flex, Space, Breadcrumb, Skeleton } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { RevPub } from "@revpub/api";
import { ItemWithId } from "@revpub/types";



const MyItems = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<object[]>();

  const columns: any = [
    {
      title: "Item Name",
      dataIndex: "itemName",
      render: (text: string, record: ItemWithId) => (
        <Link to={"/myItems/" + record._id}>{text}</Link>
      ),
      filters: [
        {
          text: "Tomato Plant",
          value: "Tomato Plant",
        },
      ],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value: string, record: ItemWithId) =>
        record.itemName.indexOf(value) === 0,
      sorter: (a: ItemWithId, b: ItemWithId) => a.itemName.length - b.itemName.length,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Provider Name",
      dataIndex: "providerName",
      filters: [
        {
          text: "Atom",
          value: "Atom",
        },
      ],
      onFilter: (value: string, record: ItemWithId) =>
        record.providerName.indexOf(value) === 0,
      sorter: (a: ItemWithId, b: ItemWithId) =>
        a.providerName.length - b.providerName.length,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Producer Name",
      dataIndex: "producerName",
      filters: [
        {
          text: "Atom",
          value: "Atom",
        },
      ],
      onFilter: (value: string, record: ItemWithId) =>
        record.producerName.indexOf(value) === 0,
      sorter: (a: ItemWithId, b: ItemWithId) =>
        a.producerName.length - b.producerName.length,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Actions",
    },
  ];

  useEffect(() => {
    const myUserId = localStorage.getItem("user-id");
    if (myUserId === null) {
      return;
    }

    RevPub.Item.getItemsByPossessorId(
      myUserId,
      (data) => {
        data.map((item: any) => {
          item.key = "item" + item._id.toString();
          return item;
        });
        setItems(data);
        setIsLoading(false);
      },
      () => {
        alert("Unable to get items.");
      }
    );
  }, []);

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
            title: "My Items",
          },
        ]}
      />
      <h1>Items In My Inventory</h1>
      {isLoading && <Skeleton active />}
      {!isLoading && (
        <Flex vertical>
          <Space direction="vertical">
            <Link to={"createItem"}>
              <Button>Create Item</Button>
            </Link>
            <Table columns={columns} dataSource={items} />
          </Space>
        </Flex>
      )}
    </React.Fragment>
  );


  
};
export default MyItems;
