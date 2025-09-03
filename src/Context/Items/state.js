import { useReducer } from "react";
import axios from "axios";
import Reducer from "./reducer";
import API_URLS from "../../Services/config";
import { Actions } from "./actions";

export const initialState = {
  items: null,
  itemsId: null,
  loading: false,
  hasMore: true,
  currentPage: 1,
  searchTerm: "",
};

export const ItemState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const getItems = async (page = 1, append = false, searchTerm = "") => {
    try {
      dispatch({ type: Actions.SET_LOADING, payload: true });

      let url = `${API_URLS.ITEMS}`;
      const params = new URLSearchParams();

      if (searchTerm) {
        params.append("q", searchTerm);
        params.append("page", page);
        params.append("limit", 15);
        url = `${API_URLS.ITEMS}/search?${params.toString()}`;
      } else {
        params.append("page", page);
        url = `${API_URLS.ITEMS}?${params.toString()}`;
      }

      const response = await axios.get(url);

      if (append) {
        dispatch({
          type: Actions.APPEND_ITEMS,
          payload: {
            items: response.data.items,
            pagination: response.data.pagination,
            searchTerm: searchTerm,
          },
        });
      } else {
        dispatch({
          type: Actions.GET_ITEMS,
          payload: {
            items: response.data.items,
            pagination: response.data.pagination,
            searchTerm: searchTerm,
          },
        });
      }

      console.log("items", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching items:", error);
      return error;
    } finally {
      dispatch({ type: Actions.SET_LOADING, payload: false });
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
