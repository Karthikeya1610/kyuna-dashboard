import { initialState } from "./state";

const OrderHandler = {
  GET_ORDERS: (state, action) => ({
    ...state,
    orders: action.payload.orders,
    pagination: action.payload.pagination,
    currentPage: action.payload.pagination.currentPage,
    hasMore:
      action.payload.pagination.currentPage <
      action.payload.pagination.totalPages,
    loading: false,
  }),

  APPEND_ORDERS: (state, action) => ({
    ...state,
    orders: state.orders
      ? [...state.orders, ...action.payload.orders]
      : action.payload.orders,
    pagination: action.payload.pagination,
    currentPage: action.payload.pagination.currentPage,
    hasMore:
      action.payload.pagination.currentPage <
      action.payload.pagination.totalPages,
    loading: false,
  }),

  UPDATE_ORDER_STATUS: (state, action) => ({
    ...state,
    orders: state.orders
      ? state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        )
      : state.orders,
  }),

  CANCEL_ORDER: (state, action) => ({
    ...state,
    orders: state.orders
      ? state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        )
      : state.orders,
  }),

  GET_ORDERS_OVERVIEW: (state, action) => ({
    ...state,
    ordersOverview: action.payload,
  }),

  SET_LOADING: (state, action) => ({
    ...state,
    loading: action.payload,
  }),
};

const Reducer = (state, action) => {
  const handler = OrderHandler[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;
