import { useReducer } from "react";
import axios from "axios";
import Reducer from "./reducer";
import API_URLS from "../../Services/config";
import { Actions } from "./actions";

export const initialState = {
  queries: null,
  queryStats: null,
  loading: false,
  hasMore: true,
  currentPage: 1,
};

export const QueryState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const getAllQueries = async (page = 1, append = false) => {
    try {
      const token = localStorage.getItem("token");
      dispatch({ type: Actions.SET_LOADING, payload: true });
      const response = await axios.get(
        `${API_URLS.QUERIES}/admin/all?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle the correct response structure
      const responseData = response.data;
      const queries = responseData.data || responseData.queries || [];
      const pagination = responseData.pagination || {};

      if (append) {
        dispatch({
          type: Actions.APPEND_QUERIES,
          payload: {
            queries: queries,
            pagination: pagination,
          },
        });
      } else {
        dispatch({
          type: Actions.GET_QUERIES,
          payload: {
            queries: queries,
            pagination: pagination,
          },
        });
      }

      console.log("Queries fetched successfully:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error fetching queries:", error);
      return error;
    } finally {
      dispatch({ type: Actions.SET_LOADING, payload: false });
    }
  };

  const updateQuery = async (queryId, updateData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URLS.QUERIES}/admin/${queryId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({ type: Actions.UPDATE_QUERY, payload: response.data });
      console.log("Query updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating query:", error);
      return error;
    }
  };

  const bulkUpdateQueries = async (bulkUpdateData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URLS.QUERIES}/admin/bulk-update`,
        bulkUpdateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({ type: Actions.BULK_UPDATE_QUERIES, payload: response.data });
      console.log("Queries bulk updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error bulk updating queries:", error);
      return error;
    }
  };

  const getQueryStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URLS.QUERIES}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle the correct response structure for stats
      const statsData = response.data.statistics || response.data;
      dispatch({ type: Actions.GET_QUERY_STATS, payload: statsData });
      console.log("Query stats fetched successfully:", statsData);
      return statsData;
    } catch (error) {
      console.error("Error fetching query stats:", error);
      return error;
    }
  };

  return {
    ...state,
    getAllQueries,
    updateQuery,
    bulkUpdateQueries,
    getQueryStats,
  };
};
