import { createSlice } from '@reduxjs/toolkit';
import {AuthState} from "./types";

const initialState: AuthState = {
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    fullName: localStorage.getItem('fullName'),
    email: localStorage.getItem('email'),
    id: localStorage.getItem('id')
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.accessToken = localStorage.getItem('accessToken');
            state.refreshToken = localStorage.getItem('refreshToken');
            state.fullName = localStorage.getItem('fullName');
            state.email = localStorage.getItem('email');
            state.id = localStorage.getItem('id');
        }
    }
});

export const { loginSuccess } = authSlice.actions;
export default authSlice.reducer;
