import { Actions } from "./actions";

const Reducer = (state, action) => {
  switch (action.type) {
    case Actions.GET_PRICE:
      return {
        ...state,
        price: action.payload,
        priceId: action.payload.id || action.payload._id,
        error: null,
      };
    case Actions.GET_PRICES:
      return {
        ...state,
        prices: action.payload,
        error: null,
      };
    case Actions.CREATE_PRICE:
      return {
        ...state,
        prices: [action.payload, ...state.prices],
        error: null,
      };
    case Actions.UPDATE_PRICE:
      return {
        ...state,
        prices: state.prices.map((price) =>
          price._id === action.payload._id ? action.payload : price
        ),
        price: action.payload,
        priceId: action.payload.id || action.payload._id,
        error: null,
      };
    case Actions.DELETE_PRICE:
      return {
        ...state,
        prices: state.prices.filter((price) => price._id !== action.payload),
        error: null,
      };
    case Actions.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case Actions.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default Reducer;
