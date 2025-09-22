import { useReducer } from "react";
import axios from "axios";
import Reducer from "./reducer";
import API_URLS from "../../Services/config";
import { Actions } from "./actions";

export const initialState = {
  price: null,
  priceId: null,
  loading: false,
  error: null,
};

export const PriceState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const getPrice = async () => {
    try {
      dispatch({ type: Actions.SET_LOADING, payload: true });
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URLS.PRICES}/active`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: Actions.GET_PRICE, payload: response.data.price });

      return response.data;
    } catch (error) {
      dispatch({ type: Actions.SET_ERROR, payload: error.message });
      return error;
    } finally {
      dispatch({ type: Actions.SET_LOADING, payload: false });
    }
  };

  const updatePrice = async (priceId, payload) => {
    try {
      dispatch({ type: Actions.SET_LOADING, payload: true });
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URLS.PRICES}/${priceId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({ type: Actions.UPDATE_PRICE, payload: response.data.price });

      return response.data;
    } catch (error) {
      dispatch({ type: Actions.SET_ERROR, payload: error.message });
      return error;
    } finally {
      dispatch({ type: Actions.SET_LOADING, payload: false });
    }
  };

  return {
    ...state,
    getPrice,
    updatePrice,
  };
};
