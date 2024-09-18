import { auth } from "@/app/firebase/config";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";

import {  loadUserCart } from "./cartSlice";


interface LogicState {
    id: string;
    token?: string;
    user: User | null;
    email?: string | null;
    userName?: string | null;
    isLoading: boolean;
    error: string | null;
}

export const getTokenData = createAsyncThunk(
    'logic/getLoginData',
    async (token: string) => {
      localStorage.setItem('token', token);
      return token;
    }
);

export const initializeToken = createAsyncThunk(
    'logic/initializeToken',
    async () => {
        const token = localStorage.getItem('token');
        return token || '';
    }
);

export const googleSignIn = createAsyncThunk(
    'logic/googleSignIn',
    async (_, { dispatch }) => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log('User:', user);
        
        const token = await user.getIdToken();
        const userData = {
            token: token,
            email: user.email,
            userName: user.displayName,
            user:user
            
        };
        localStorage.setItem('token', token);
        localStorage.setItem('email', user.email || '');
        localStorage.setItem('userName', user.displayName || '');
        return userData;
    }
);

export const logOut = createAsyncThunk(
    'logic/logOut',
    async (_, { dispatch }) => {
      await signOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('userName');
      return null; 
    }
);

const initialState: LogicState = {
    id: '',
    token: '',
    user: null,
    email: null,
    userName: null,
    isLoading: false,
    error: null,
}

const logicSlice = createSlice({
    initialState,
    name: 'logic',
    reducers: {
        getId: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(getTokenData.fulfilled, (state, action) => {
                state.token = action.payload;
            })
            .addCase(initializeToken.fulfilled, (state, action) => {
                state.token = action.payload;
            })
            .addCase(googleSignIn.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(googleSignIn.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.token;
                state.email = action.payload.email;
                state.userName = action.payload.userName;
                state.user = action.payload.user;
            })
            .addCase(googleSignIn.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Google Sign In failed';
            })
            .addCase(logOut.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logOut.fulfilled, (state) => {
                state.isLoading = false;
                state.token = undefined;
                state.user = null;
                state.email = null;
                state.userName = null;
            })
            .addCase(logOut.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Logout failed';
            });
    },
});

export const { getId, setUser } = logicSlice.actions;

export const logicReducer = logicSlice.reducer;