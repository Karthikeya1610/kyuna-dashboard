import { useMemo } from "react";
import { AuthState } from "./auth/state";
import { ItemState } from "./Items/state";
import { OrderState } from "./orders/state";

const useCombineState = () => {
  const auth = AuthState();
  const items = ItemState();
  const orders = OrderState();
  return useMemo(
    () => ({
      auth,
      items,
      orders,
    }),
    [auth, items, orders]
  );
};

export default useCombineState;
