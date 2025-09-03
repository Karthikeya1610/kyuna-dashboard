import { initialState } from "./state";

const QueryHandler = {
  GET_QUERIES: (state, action) => ({
    ...state,
    queries: action.payload.queries,
    pagination: action.payload.pagination,
    currentPage: action.payload.pagination?.currentPage || 1,
    hasMore: action.payload.pagination?.hasNextPage || false,
    loading: false,
  }),

  APPEND_QUERIES: (state, action) => ({
    ...state,
    queries: state.queries
      ? [...state.queries, ...action.payload.queries]
      : action.payload.queries,
    pagination: action.payload.pagination,
    currentPage: action.payload.pagination?.currentPage || 1,
    hasMore: action.payload.pagination?.hasNextPage || false,
    loading: false,
  }),

  UPDATE_QUERY: (state, action) => ({
    ...state,
    queries: state.queries
      ? state.queries.map((query) =>
          query._id === action.payload._id ? action.payload : query
        )
      : state.queries,
  }),

  BULK_UPDATE_QUERIES: (state, action) => ({
    ...state,
    queries: state.queries
      ? state.queries.map((query) => {
          const updatedQuery = action.payload.find(
            (updated) => updated._id === query._id
          );
          return updatedQuery || query;
        })
      : state.queries,
  }),

  GET_QUERY_STATS: (state, action) => ({
    ...state,
    queryStats: action.payload,
  }),

  SET_LOADING: (state, action) => ({
    ...state,
    loading: action.payload,
  }),
};

const Reducer = (state, action) => {
  const handler = QueryHandler[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;
