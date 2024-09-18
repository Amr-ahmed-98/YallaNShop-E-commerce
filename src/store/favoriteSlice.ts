import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://e-commerce-b469c-default-rtdb.europe-west1.firebasedatabase.app";

interface FavoriteItem {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface FavoriteState {
  email: string | null;
  favoriteItems: FavoriteItem[];
  favoriteItemsCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: FavoriteState = {
  email: null,
  favoriteItems: [],
  favoriteItemsCount: 0,
  isLoading: false,
  error: null,
};

export const addToFavorites = createAsyncThunk(
  'favorite/addToFavorites',
  async (productId: number, { rejectWithValue }) => {
    try {
      const email = localStorage.getItem('email');
      if (!email) {
        throw new Error("User email not found");
      }

      const sanitizedEmail = email.replace(/\./g, ',');
      const response = await axios.get(`${BASE_URL}/favorite/${sanitizedEmail}.json`);
      let currentFavorites = response.data || { email: sanitizedEmail, favoriteItems: [] };

      if (!Array.isArray(currentFavorites.favoriteItems)) {
        currentFavorites.favoriteItems = [];
      }

      const existingItemIndex = currentFavorites.favoriteItems.findIndex((item: FavoriteItem) => item.id === productId);
      
      if (existingItemIndex === -1) {
        const product = await axios.get(`https://fakestoreapi.com/products/${productId}`);
        const productData = product.data;
        currentFavorites.favoriteItems.push({
          id: productData.id,
          title: productData.title,
          price: productData.price,
          image: productData.image,
        });
      }

      const updateResponse = await axios.put(`${BASE_URL}/favorite/${sanitizedEmail}.json`, currentFavorites);
      
      if (updateResponse.status !== 200) {
        throw new Error("Failed to update favorites in Firebase");
      }

      return currentFavorites;
    } catch (error) {
      return rejectWithValue((error as Error).message || "An error occurred while updating favorites");
    }
  }
);

export const loadUserFavorites = createAsyncThunk(
  'favorite/loadUserFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const email = localStorage.getItem('email');
      if (!email) {
        throw new Error("User email not found");
      }

      const sanitizedEmail = email.replace(/\./g, ',');

      const response = await axios.get(`${BASE_URL}/favorite/${sanitizedEmail}.json`);
      const favoriteData = response.data || { ...initialState, email: sanitizedEmail };
      
      return favoriteData;
    } catch (error) {
      return rejectWithValue((error as Error).message || "An error occurred while loading favorites");
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
    'favorite/removeFromFavorites',
    async (productId: number, { rejectWithValue }) => {
      try {
        const email = localStorage.getItem('email');
        if (!email) {
          throw new Error("User email not found");
        }
  
        const sanitizedEmail = email.replace(/\./g, ',');
  
        const response = await axios.get(`${BASE_URL}/favorite/${sanitizedEmail}.json`);
        let currentFavorites = response.data || { email: sanitizedEmail, favoriteItems: [] };
  
        currentFavorites.favoriteItems = currentFavorites.favoriteItems.filter((item: FavoriteItem) => item.id !== productId);
  
        const updateResponse = await axios.put(`${BASE_URL}/favorite/${sanitizedEmail}.json`, currentFavorites);
        
        if (updateResponse.status !== 200) {
          throw new Error("Failed to update favorites in Firebase");
        }
  
        return {
          email: sanitizedEmail,
          favoriteItems: currentFavorites.favoriteItems,
        };
      } catch (error) {
        return rejectWithValue((error as Error).message || "An error occurred while removing from favorites");
      }
    }
  );
const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToFavorites.fulfilled, (state, action: PayloadAction<FavoriteState>) => {
        state.isLoading = false;
        state.error = null;
        state.email = action.payload.email;
        state.favoriteItems = action.payload.favoriteItems || [];
        state.favoriteItemsCount = action.payload.favoriteItems?.length || 0;
      })
      .addCase(loadUserFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUserFavorites.fulfilled, (state, action: PayloadAction<FavoriteState>) => {
        state.isLoading = false;
        state.error = null;
        state.email = action.payload.email;
        state.favoriteItems = action.payload.favoriteItems || [];
        state.favoriteItemsCount = action.payload.favoriteItems?.length || 0;
      })
      .addCase(loadUserFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to load user favorites';
      })
      .addCase(removeFromFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.email = action.payload.email;
        state.favoriteItems = action.payload.favoriteItems || [];
        state.favoriteItemsCount = action.payload.favoriteItems?.length || 0;
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to remove item from favorites';
      });
  },
});

export const favoriteReducer = favoriteSlice.reducer;