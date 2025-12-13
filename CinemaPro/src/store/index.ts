import { configureStore } from "@reduxjs/toolkit";
import userReducer from './UserSlice';
import bookingReducer from './bookingSlice';
import themeReducer from './themeSlice'; 

export const store = configureStore({
    reducer: {
        user: userReducer,
        booking: bookingReducer,
        theme: themeReducer, 
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;