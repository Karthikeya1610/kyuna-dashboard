import { initialState } from "./state";

const authHandler = {
  LOGIN_SUCCESS: (state, action) => ({
    ...state,
    login: action.payload,
  }),
};

const Reducer = (state, action) => {
  const handler = authHandler[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;
