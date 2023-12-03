import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../api/authService';
import {Credentials} from "./types";
import axios, {AxiosError} from "axios";
import {loginSuccess, logout} from "./authSlice";
import {RefreshToken, AuthData} from "./types";


export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: Credentials, { dispatch, rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);
            if (response.ok) {
                dispatch(loginSuccess(response.data));
                return response.data;
            } else {
                // Handle unsuccessful login
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // error is an AxiosError
                const serverError = error as AxiosError;
                if (serverError && serverError.response) {
                    return rejectWithValue(serverError.response.data);
                }
            }
            return rejectWithValue({ message: 'An unexpected error occurred' });
        }
    }
);


export const refreshToken = createAsyncThunk<AuthData, string>(
    'auth/refreshToken',
    async (refreshToken, { rejectWithValue }) => {
        try {
            const response = await authService.refreshToken({ refreshToken } as RefreshToken);
            if (response.ok) {
                return response.data as AuthData; // Cast the response data to TokenResponse
            } else {
                return rejectWithValue(response.error || 'Token refresh failed');
            }
        } catch (error) {
            return rejectWithValue('An unexpected error occurred');
        }
    }
);