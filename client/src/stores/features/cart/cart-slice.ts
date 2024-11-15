import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { Cart } from "@/types/cart.type";

interface CartState {
  carts: Cart[];
}

const initialState: CartState = {
  carts: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToListCheckout: (state, action: PayloadAction<Cart[]>) => {
      state.carts = action.payload;
    },
    clearCart: (state) => {
      state.carts = [];
    },
  },
});

export const { addToListCheckout, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
