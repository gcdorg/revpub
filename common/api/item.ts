import axios from "axios";
import { Item, ItemWithId, ItemPartial, ItemPartialWithId } from '@revpub/types';

const defaultJsonOptions = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
};

export const getItemsByPossessorId = (
  id: string,
  onSuccess: (items: ItemWithId[]) => void,
  onFailure: () => void
) => {

  axios.get(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/items/itemsByPossessorId/${id}`,
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

export const getItem = (
  id: string,
  onSuccess: (item: Item) => void,
  onFailure: () => void
) => {

  axios.get(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/items/${id}`,
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

export const createItem = (
  item: Item,
  onSuccess: () => void,
  onFailure: () => void
) => {
  axios.post(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/items`,
    item,
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

export const updateItem = (
  id: string,
  item: ItemPartial,
  onSuccess: (itemWithId: ItemWithId) => void,
  onFailure: () => void
) => {

  axios.put(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/items/${id}`,
    item,
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

export const deleteItem = (
  id: string,
  onSuccess: () => void,
  onFailure: () => void
) => {
  axios.delete(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/items/${id}`,
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
