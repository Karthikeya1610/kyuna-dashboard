import { useMemo } from "react";
import { AuthState } from "./auth/state";
import { ItemState } from "./Items/state";
import { OrderState } from "./orders/state";
import { QueryState } from "./queries/state";

const useCombineState = () => {
  const auth = AuthState();
  const items = ItemState();
  const orders = OrderState();
  const queries = QueryState();
  return useMemo(
    () => ({
      auth,
      items,
      orders,
      queries,
    }),
    [auth, items, orders, queries]
  );
};

export default useCombineState;
