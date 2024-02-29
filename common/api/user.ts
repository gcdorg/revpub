import axios from "axios";
import { User, UserWithId, UserPartial, UserPartialWithId } from '@revpub/types';

const defaultJsonOptions = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
};

export const getUser = (
  id: string,
  onSuccess: (user: User) => void,
  onFailure: () => void
) => {

  axios.get(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/users/${id}`,
    defaultJsonOptions
  )
    .then((response) => {
      if (response.status === 200) {
        onSuccess(response.data);
      } else {
        onFailure();
      }
    })
    .catch((error) => console.log(error));

};

export const getCurrentUser = (
  onSuccess: (user: User) => void,
  onFailure: () => void
) => {

  const currentUserId = localStorage.getItem("user-id");
  if (currentUserId !== null) {
    return getUser(currentUserId, onSuccess, onFailure);
  }

};

export const createUser = (
  user: User,
  onSuccess: () => void,
  onFailure: () => void
) => {
  axios.post(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/auth/createUser`,
    user,
    defaultJsonOptions
  )
    .then((response) => {
      if (response.status === 201) {
        onSuccess();
      } else {
        onFailure();
      }
    })
    .catch((error) => console.log(error));
};

export const updateUser = (
  id: string,
  user: UserPartial,
  onSuccess: (userWithId: UserWithId) => void,
  onFailure: () => void
) => {

  axios.put(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/users/${id}`,
    user,
    defaultJsonOptions
  )
    .then((response) => {
      if (response.status === 200) {
        onSuccess(response.data);
      } else {
        onFailure();
      }
    })
    .catch((error) => console.log(error));

};

export const updateCurrentUser = (
  user: UserPartial,
  onSuccess: (userWithId: UserPartialWithId) => void,
  onFailure: () => void
) => {
  const currentUserId = localStorage.getItem("user-id");
  if (currentUserId !== null) {
    return updateUser(currentUserId, user, onSuccess, onFailure);
  }
};

export const deleteUser = (
  id: string,
  onSuccess: () => void,
  onFailure: () => void
) => {
  axios.delete(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/users/${id}`,
  defaultJsonOptions
  )
  .then((response) => {
    if (response.status === 204) {
      onSuccess();
    } else {
      onFailure();
    }
  })
  .catch((error) => console.log(error));
};

export const deleteCurrentUser = (
  onSuccess: () => void,
  onFailure: () => void
) => {
  const currentUserId = localStorage.getItem("user-id");
  if (currentUserId !== null) {
    return deleteUser(currentUserId, onSuccess, onFailure);
  }
}

export const deleteCurrentUserAvatar = (
  onSuccess: () => void,
  onFailure: () => void
) => {

  const currentUserId = localStorage.getItem("user-id");

  if (currentUserId === null) {
    return;
  }

  axios.delete(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/users/${currentUserId}/avatar`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  })
  .then((response) => {
    if (response.status === 200) {
      onSuccess();
    } else {
      onFailure();
    }
  })
  .catch((error) => console.log(error));
  
};