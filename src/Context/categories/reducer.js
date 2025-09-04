import { initialState } from "./state";

const CategoryHandler = {
  GET_CATEGORIES: (state, action) => ({
    ...state,
    categories: action.payload.categories,
    pagination: action.payload.pagination,
    currentPage: action.payload.pagination?.currentPage || 1,
    hasMore: action.payload.pagination?.hasNextPage || false,
    loading: false,
  }),

  APPEND_CATEGORIES: (state, action) => ({
    ...state,
    categories: state.categories
      ? [...state.categories, ...action.payload.categories]
      : action.payload.categories,
    pagination: action.payload.pagination,
    currentPage: action.payload.pagination?.currentPage || 1,
    hasMore: action.payload.pagination?.hasNextPage || false,
    loading: false,
  }),

  CREATE_CATEGORY: (state, action) => ({
    ...state,
    categories: state.categories
      ? [action.payload, ...state.categories]
      : [action.payload],
  }),

  UPDATE_CATEGORY: (state, action) => ({
    ...state,
    categories: state.categories
      ? state.categories.map((category) =>
          category._id === action.payload._id ? action.payload : category
        )
      : state.categories,
  }),

  DELETE_CATEGORY: (state, action) => ({
    ...state,
    categories: state.categories
      ? state.categories.filter((category) => category._id !== action.payload)
      : state.categories,
  }),

  GET_CATEGORY_BY_ID: (state, action) => ({
    ...state,
    selectedCategory: action.payload,
  }),

  SET_LOADING: (state, action) => ({
    ...state,
    loading: action.payload,
  }),
};

const Reducer = (state, action) => {
  const handler = CategoryHandler[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;
