import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://e-commerce-b469c-default-rtdb.europe-west1.firebasedatabase.app";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  email: string | null;
  cartItems: CartItem[];
  total: number;
  quantity: number;
  isLoading: boolean;
  error: string | null;
  countOfCartItems: number;
 
}

const initialState: CartState = {
  email: null,
  cartItems: [],
  total: 0,
  quantity: 0,
  isLoading: false,
  error: null,
  countOfCartItems: 0,
 
};

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: number, quantity: number }, { rejectWithValue }) => {
    try {
      const email = localStorage.getItem('email');
      if (!email) {
        throw new Error("User email not found");
      }

      const sanitizedEmail = email.replace(/\./g, ',');
      const response = await axios.get(`${BASE_URL}/carts/${sanitizedEmail}.json`);
      let currentCart = response.data || { email: sanitizedEmail, cartItems: [], total: 0, quantity: 0 };


      if (!Array.isArray(currentCart.cartItems)) {
        currentCart.cartItems = [];
      }

      const existingItemIndex = currentCart.cartItems.findIndex((item: CartItem) => item.id === productId);
      
      if (existingItemIndex !== -1) {

        currentCart.cartItems[existingItemIndex].quantity = quantity;
      } else {
      
        const product = await axios.get(`https://fakestoreapi.com/products/${productId}`);
        const productData = await product.data;
        currentCart.cartItems.push({ ...productData, quantity });
      }

      
      currentCart.cartItems = currentCart.cartItems.filter((item: CartItem) => item.quantity > 0);

      currentCart.quantity = currentCart.cartItems.reduce((total: number, item: CartItem) => total + item.quantity, 0);
      currentCart.total = currentCart.cartItems.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);

      const updateResponse = await axios.put(`${BASE_URL}/carts/${sanitizedEmail}.json`, currentCart);
      
      if (updateResponse.status !== 200) {
        throw new Error("Failed to update cart in Firebase");
      }

      return currentCart;
    } catch (error) {
      return rejectWithValue((error as Error).message || "An error occurred while updating the cart");
    }
  }
);
export const loadUserCart = createAsyncThunk(
  'cart/loadUserCart',
  async (_, { rejectWithValue }) => {
    try {
      const email = localStorage.getItem('email');
      if (!email) {
        throw new Error("User email not found");
      }

      const sanitizedEmail = email.replace(/\./g, ',');

      const response = await axios.get(`${BASE_URL}/carts/${sanitizedEmail}.json`);
      const cartData = response.data || { ...initialState, email: sanitizedEmail };
      
      // Calculate the count of cart items
      const countOfCartItems = cartData.cartItems ? cartData.cartItems.length : 0;
      
      return { ...cartData, countOfCartItems };
    } catch (error) {
      return rejectWithValue((error as Error).message || "An error occurred while loading the cart");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId: number, { rejectWithValue }) => {
    try {
      const email = localStorage.getItem('email');
      if (!email) {
        throw new Error("User email not found");
      }

      const sanitizedEmail = email.replace(/\./g, ',');

      const response = await axios.get(`${BASE_URL}/carts/${sanitizedEmail}.json`);
      let currentCart = response.data || { email: sanitizedEmail, cartItems: [], total: 0, quantity: 0 };

      currentCart.cartItems = currentCart.cartItems.filter((item: CartItem) => item.id !== productId);
      
      currentCart.quantity = currentCart.cartItems.reduce((total: number, item: CartItem) => total + item.quantity, 0);
      currentCart.total = currentCart.cartItems.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);

      const updateResponse = await axios.put(`${BASE_URL}/carts/${sanitizedEmail}.json`, currentCart);
      
      if (updateResponse.status !== 200) {
        throw new Error("Failed to update cart in Firebase");
      }

      return currentCart;
    } catch (error) {
      return rejectWithValue((error as Error).message || "An error occurred while removing from cart");
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const email = localStorage.getItem('email');
      if (!email) {
        throw new Error("User email not found");
      }

      const sanitizedEmail = email.replace(/\./g, ',');
      const emptyCart = { email: sanitizedEmail, cartItems: [], total: 0, quantity: 0 };

      const response = await axios.put(`${BASE_URL}/carts/${sanitizedEmail}.json`, emptyCart);
      
      if (response.status !== 200) {
        throw new Error("Failed to clear cart in Firebase");
      }

      return emptyCart;
    } catch (error) {
      return rejectWithValue((error as Error).message || "An error occurred while clearing the cart");
    }
  }
);




const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartItems: (state) => {
      state.cartItems = [];
      state.total = 0;
      state.quantity = 0;      
    },
    setCartItems: (state, action) => {
      state.countOfCartItems = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.email = action.payload.email;
        state.cartItems = action.payload.cartItems;
        state.total = action.payload.total;
        state.quantity = action.payload.quantity;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to add item to cart';
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.email = action.payload.email;
        state.cartItems = [];
        state.total = 0;
        state.quantity = 0;
      })
      .addCase(loadUserCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUserCart.fulfilled, (state, action) => {
        if (action.payload) {
          return { 
            ...action.payload, 
            isLoading: false, 
            error: null,
            countOfCartItems: action.payload.countOfCartItems 
          };
        } else {
          return { 
            ...initialState, 
            email: localStorage.getItem('email'), 
            isLoading: false, 
            error: null,
            countOfCartItems: 0
          };
        }
      })
      .addCase(loadUserCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to load user cart';
      });
  },
});

export const { clearCartItems,setCartItems } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;