import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import PortalNavbar from "./components/portal/navbar/PortalNavbar";
const { Header, Content } = Layout;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAccessToken = () => {
    const accessToken = localStorage.getItem("access-token");
    if (!accessToken || accessToken === "undefined") {
      setIsLoggedIn(false);
    }
    setIsLoggedIn(true);
  };

  useEffect(() => {
    checkAccessToken();
  }, [isLoggedIn]);

  return (
    <React.Fragment>
      <Layout>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 999,
            width: '100%',
            backgroundColor: "white",
            borderBottomWidth: "1px",
            borderBottomStyle: "solid",
            borderImageSlice: 1,
            borderImageSource: "linear-gradient(to top, #f0f0f0, white)",
          }}
        >
          {isLoggedIn && <PortalNavbar />}
        </Header>
        <Content
          className="site-layout"
          style={{
            padding: "20px 50px",
            minHeight: 1000,
            backgroundColor: "white",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </React.Fragment>
  );
}

export default App;
