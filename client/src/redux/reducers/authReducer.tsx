import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
    isAuthenticated: boolean;
    token: string | undefined;
} = {
    isAuthenticated: false,
    token: undefined
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setAuth(state, action: PayloadAction<typeof initialState>) {
            const { isAuthenticated, token } = action.payload;
            state.isAuthenticated = isAuthenticated;
            state.token = token;
        }
    }
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;
