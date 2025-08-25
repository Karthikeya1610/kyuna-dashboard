import { initialState } from "./state";

const itemsHandler = {
  GET_ITEMS: (state, action) => ({
    ...state,
    items: action.payload,
  }),
  GET_ITEMS_ID: (state, action) => ({
    ...state,
    itemsId: action.payload,
  }),
  GET_ITEMS_CREATE: (state, action) => ({
    ...state,
    items: action.payload,
  }),
  GET_ITEMS_UPDATE: (state, action) => ({
    ...state,
    items: action.payload,
  }),
  GET_ITEM_DELETE: (state, action) => ({
    ...state,
    items: action.payload,
  }),
};

const Reducer = (state, action) => {
  const handler = itemsHandler[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;
