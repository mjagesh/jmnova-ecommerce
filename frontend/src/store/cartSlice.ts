import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

import api from "../services/api";

interface CartProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  stock: number;
}

interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartResponse {
  cart?: {
    items: CartItem[];
  };
  items?: CartItem[];
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

export const loadCart = createAsyncThunk<
  CartItem[],
  void,
  { rejectValue: string }
>("cart/loadCart", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<CartResponse>("/cart");

    return response.data.cart?.items || response.data.items || [];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to load cart",
    );
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    clearCart: (state) => {
      state.items = [];
    },

    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loadCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(loadCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load cart";
      });
  },
});

export const { setCart, clearCart, setCartLoading, setCartError } =
  cartSlice.actions;

export default cartSlice.reducer;
