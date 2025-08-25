import { useReducer } from "react";
import axios from "axios";
import Reducer from "./reducer";
import API_URLS from "../../Services/config";
import { Actions } from "./actions";

export const initialState = {
  items: null,
  itemsId: null,
};

export const ItemState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const getItems = async () => {
    try {
      const response = await axios.get(`${API_URLS.ITEMS}`);
      dispatch({ type: Actions.GET_ITEMS, payload: response.data });
      console.log("items", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching items:", error);
      return error;
    }
  };

  const getItemsId = async (id) => {
    try {
      const response = await axios.get(`${API_URLS.ITEMS}/${id}`);
      dispatch({ type: Actions.GET_ITEMS_ID, payload: response.data });
      console.log("Item fetched successfully", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching item by ID:", error);
      return error;
    }
  };

  const getItemsCreate = async (payload) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URLS.ITEMS}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: Actions.GET_ITEMS_CREATE, payload: response.data.item });
      console.log("Item created successfully", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating item:", error);
      return error;
    }
  };

  const getItemsUpdate = async (id, payload) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URLS.ITEMS}/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: Actions.GET_ITEMS_UPDATE, payload: response.data });
      console.log("Item updated successfully", response);
      return response.data;
    } catch (error) {
      console.error("Error updating item:", error);
      return error;
    }
  };

  const getItemsDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_URLS.ITEMS}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: Actions.GET_ITEM_DELETE, payload: response.data });
      console.log("Item deleted successfully", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting item:", error);
      return error;
    }
  };

  const uploadImage = async (file) => {
    try {
      const response = await axios.post(`${API_URLS.IMAGE}/upload`, file);
      return response.data;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const deleteImage = async (publicId) => {
    try {
      const response = await axios.delete(
        `${API_URLS.IMAGE}/delete/${publicId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  };

  return {
    ...state,
    getItems,
    getItemsId,
    getItemsCreate,
    getItemsUpdate,
    getItemsDelete,
    uploadImage,
    deleteImage,
  };
};
