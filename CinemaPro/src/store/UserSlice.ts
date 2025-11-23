import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserProfile {
    name: string;
    email: string;
    isAuthenticated: boolean;
}

const initialState: UserProfile = {
    name: "",
    email: "",
    isAuthenticated: false
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
       
        // para loguearse
        setUser: (state, action: PayloadAction<{ name: string; email: string }>) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.isAuthenticated = true;
        },
       
        // para salir
        logout: () => initialState,
    },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;