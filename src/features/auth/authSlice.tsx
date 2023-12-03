import { createSlice } from '@reduxjs/toolkit';
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";

const refreshToken = useSelector((state: RootState) => state.auth.refreshToken);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(refreshToken.fulfilled, (state, action) => {
                // Update state with new tokens
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(refreshToken.rejected, (state, action) => {
                // Handle rejection (e.g., clear tokens, update state)
            });
    }

});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;