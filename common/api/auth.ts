import axios from "axios";
import { LoginParams, LoginResponseData } from '@revpub/types';

const defaultJsonOptions = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
};

export const login = (
  loginParams: LoginParams,
  onSuccess: (loginResponseData: LoginResponseData) => void,
  onFailure: () => void
) => {
  axios.post(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/auth/login`,
    loginParams,
    defaultJsonOptions
  )
    .then((response) => {
      onSuccess(response.data)
    })
    .catch((error) => console.log(error));
}

export const logout = (
  refreshToken: string,
  onSuccess: () => void,
  onFailure: () => void
) => {

  axios.delete(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/auth/logout`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: {
      refreshToken: refreshToken
    }
  })
    .then((response) => {
      if (response.status === 204) {
        onSuccess();
      } else {
        onFailure();
      }
    })
    .catch((error) => console.log(error));
};