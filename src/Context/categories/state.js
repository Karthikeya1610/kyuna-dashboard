import { useReducer } from "react";
import axios from "axios";
import Reducer from "./reducer";
import API_URLS from "../../Services/config";
import { Actions } from "./actions";

export const initialState = {
  categories: null,
  selectedCategory: null,
  loading: false,
  hasMore: true,
  currentPage: 1,
};

export const CategoryState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const getAllCategories = async (
    page = 1,
    append = false,
    search = "",
    sort = ""
  ) => {
    try {
      const token = localStorage.getItem("token");
      dispatch({ type: Actions.SET_LOADING, payload: true });

      let url = `${API_URLS.CATEGORIES}?page=${page}&limit=100`;
      if (search) url += `&search=${search}`;
      if (sort) url += `&sort=${sort}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle the correct response structure
      const responseData = response.data;
      const categories = responseData.data || responseData.categories || [];
      const pagination = responseData.pagination || {};

      if (append) {
        dispatch({
          type: Actions.APPEND_CATEGORIES,
          payload: {
            categories: categories,
            pagination: pagination,
          },
        });
      } else {
        dispatch({
          type: Actions.GET_CATEGORIES,
          payload: {
            categories: categories,
            pagination: pagination,
          },
        });
      }

      console.log("Categories fetched successfully:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return error;
    } finally {
      dispatch({ type: Actions.SET_LOADING, payload: false });
    }
  };

  const getCategoryById = async (categoryId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URLS.CATEGORIES}/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: Actions.GET_CATEGORY_BY_ID, payload: response.data });
      console.log("Category fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching category:", error);
      return error;
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URLS.CATEGORIES}`,
        categoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({ type: Actions.CREATE_CATEGORY, payload: response.data });
      console.log("Category created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      return error;
    }
  };

  const updateCategory = async (categoryId, updateData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URLS.CATEGORIES}/${categoryId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({ type: Actions.UPDATE_CATEGORY, payload: response.data });
      console.log("Category updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating category:", error);
      return error;
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_URLS.CATEGORIES}/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({ type: Actions.DELETE_CATEGORY, payload: categoryId });
      console.log("Category deleted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting category:", error);
      return error;
    }
  };

  return {
    ...state,
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
