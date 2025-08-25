import { useReducer } from "react";
import axios from "axios";
import Reducer from "./reducer";
import API_URLS from "../../Services/config";
import { Actions } from "./actions";

export const initialState = {
  orders: null,
};

export const OrderState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const getOrders = async () => {
    try {
      const response = await axios.get(`${API_URLS.ORDERS}`);
      dispatch({ type: Actions.GET_ORDERS, payload: response.data });
      console.log("items", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching items:", error);
      return error;
    }
  };

  const getOrdersUpdate = async (id, payload) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URLS.ITEMS}/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: Actions.GET_ITEMS_UPDATE, payload: response.data });
      console.log("Item updated successfully", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating item:", error);
      return error;
    }
  };

  const getOrdersDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_URLS.ITEMS}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: Actions.GET_ITEM_DELETE, payload: { id } });
      console.log("Item deleted successfully", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting item:", error);
      return error;
    }
  };

  return {
    ...state,
    getOrders,
    getOrdersUpdate,
    getOrdersDelete,
  };
};
