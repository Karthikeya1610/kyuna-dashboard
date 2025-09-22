import { useMemo } from "react";
import { AuthState } from "./auth/state";
import { ItemState } from "./Items/state";
import { OrderState } from "./orders/state";
import { QueryState } from "./queries/state";
import { CategoryState } from "./categories/state";
import { PriceState } from "./price/state";

const useCombineState = () => {
  const auth = AuthState();
  const items = ItemState();
  const orders = OrderState();
  const queries = QueryState();
  const categories = CategoryState();
  const price = PriceState();
  return useMemo(
    () => ({
      auth,
      items,
      orders,
      queries,
      categories,
      price,
    }),
    [auth, items, orders, queries, categories, price]
  );
};

export default useCombineState;
