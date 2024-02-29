import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = (props: any) => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAccessToken = () => {
    const accessToken = localStorage.getItem("access-token");
    if (!accessToken || accessToken === "undefined") {
      setIsLoggedIn(false);
      return navigate("/auth/login");
    }
    setIsLoggedIn(true);
  };

  useEffect(() => {
    checkAccessToken();
  }, [isLoggedIn]);

  return <React.Fragment>{isLoggedIn ? <Outlet /> : null}</React.Fragment>;
};

export default ProtectedRoute;
