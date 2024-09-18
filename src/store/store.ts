import { configureStore } from '@reduxjs/toolkit'
import { logicReducer } from './logicSlice'
import { cartReducer } from './cartSlice';
import { favoriteReducer } from './favoriteSlice';
export const store = configureStore({
    reducer:{
        logicReducer:logicReducer,
        cart:cartReducer,
        favorite:favoriteReducer
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;