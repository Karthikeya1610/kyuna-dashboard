import { initialState } from "./state";

const OrderHandler = {
  GET_ORDERS: (state, action) => ({
    ...state,
    orders: action.payload,
  }),

  GET_ORDERS_UPDATE: (state, action) => ({
    ...state,
    orders: action.payload,
  }),

  GET_ORDERS_DELETE: (state, action) => ({
    ...state,
    orders: action.payload,
  }),
  CANCEL_ORDER: (state, action) => ({
    ...state,
    orders: action.payload,
  }),
};

const Reducer = (state, action) => {
  const handler = OrderHandler[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;
