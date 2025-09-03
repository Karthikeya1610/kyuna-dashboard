import { initialState } from "./state";

const ItemHandler = {
  GET_ITEMS: (state, action) => ({
    ...state,
    items: action.payload.items,
    pagination: action.payload.pagination,
    currentPage: action.payload.pagination.currentPage,
    hasMore:
      action.payload.pagination.currentPage <
      action.payload.pagination.totalPages,
    loading: false,
    searchTerm: action.payload.searchTerm,
  }),

  APPEND_ITEMS: (state, action) => ({
    ...state,
    items: state.items
      ? [...state.items, ...action.payload.items]
      : action.payload.items,
    pagination: action.payload.pagination,
    currentPage: action.payload.pagination.currentPage,
    hasMore:
      action.payload.pagination.currentPage <
      action.payload.pagination.totalPages,
    loading: false,
    searchTerm: action.payload.searchTerm,
  }),

  GET_ITEMS_ID: (state, action) => ({
    ...state,
    itemsId: action.payload,
  }),

  GET_ITEMS_CREATE: (state, action) => ({
    ...state,
    items: state.items ? [action.payload, ...state.items] : [action.payload],
  }),

  GET_ITEMS_UPDATE: (state, action) => ({
    ...state,
    items: state.items
      ? state.items.map((item) =>
          item._id === action.payload._id ? action.payload : item
        )
      : state.items,
  }),

  GET_ITEM_DELETE: (state, action) => ({
    ...state,
    items: state.items
      ? state.items.filter((item) => item._id !== action.payload._id)
      : state.items,
  }),

  SET_LOADING: (state, action) => ({
    ...state,
    loading: action.payload,
  }),
};

const Reducer = (state, action) => {
  const handler = ItemHandler[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;
