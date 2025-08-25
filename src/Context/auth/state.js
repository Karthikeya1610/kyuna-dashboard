import { useReducer } from "react";
import axios from "axios";
import Reducer from "./reducer";
import API_URLS from "../../Services/config";
import { Actions } from "./actions";

export const initialState = {
  login: null,
};

export const AuthState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_URLS.LOGIN}`, credentials);
      dispatch({ type: Actions.LOGIN_SUCCESS, payload: response.data });
      console.log("Login successful", response);
      return response;
    } catch (error) {
      return error;
    }
  };

  return {
    ...state,
    login,
  };
};
