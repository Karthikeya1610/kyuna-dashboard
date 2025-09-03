import { useReducer } from "react";
import axios from "axios";
import Reducer from "./reducer";
import API_URLS from "../../Services/config";
import { Actions } from "./actions";

export const initialState = {
  orders: null,
  ordersOverview: null,
  loading: false,
  hasMore: true,
  currentPage: 1,
};

export const OrderState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const getOrders = async (page = 1, append = false) => {
    try {
      const token = localStorage.getItem("token");
      dispatch({ type: Actions.SET_LOADING, payload: true });
      const response = await axios.get(`${API_URLS.ORDERS}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (append) {
        dispatch({
          type: Actions.APPEND_ORDERS,
          payload: {
            orders: response.data.orders,
            pagination: response.data.pagination,
          },
        });
      } else {
        dispatch({
          type: Actions.GET_ORDERS,
          payload: {
            orders: response.data.orders,
            pagination: response.data.pagination,
          },
        });
      }

      console.log("Orders fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return error;
    } finally {
      dispatch({ type: Actions.SET_LOADING, payload: false });
    }
  };

  const updateOrderStatus = async (orderId, statusData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URLS.ORDERS}/${orderId}/status`,
        statusData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({ type: Actions.UPDATE_ORDER_STATUS, payload: response.data });
      console.log("Order status updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      return error;
    }
  };

  const cancelOrder = async (orderId, cancellationData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URLS.ORDERS}/${orderId}/admin-cancel`,
        cancellationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({ type: Actions.CANCEL_ORDER, payload: response.data });
      console.log("Order cancelled successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error cancelling order:", error);
      return error;
    }
  };

  const getOrdersOverview = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URLS.ORDERS}/stats/overview`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: Actions.GET_ORDERS_OVERVIEW, payload: response.data });
      console.log("Orders overview fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders overview:", error);
      return error;
    }
  };

  return {
    ...state,
    getOrders,
    updateOrderStatus,
    cancelOrder,
    getOrdersOverview,
  };
};
