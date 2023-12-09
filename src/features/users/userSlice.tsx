import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apiService from '../../api/apiService';
import {User} from './types';

export const fetchAllUsers = createAsyncThunk(
    'users/fetchAllUsers',
    async (_, thunkAPI) => {
        const accessToken = localStorage.getItem("accessToken")
        if(accessToken){
            return await apiService.get('users/', accessToken);
        }
    }
);

export const fetchMyTeammates = createAsyncThunk(
    'users/fetchMyTeammates',
    async (_, thunkAPI) => {
        const accessToken = localStorage.getItem("accessToken")
        if(accessToken){
            return await apiService.get('users/company', accessToken);
        }
    }
);

export const fetchExternalUsers = createAsyncThunk(
    'users/externalUsers',
    async (_, thunkAPI) => {
        const accessToken = localStorage.getItem("accessToken")
        if(accessToken){
            return await apiService.get('users/external', accessToken);
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState: {
        myTeammates: [] as User[],
        externalUsers: [] as User [],
        allUsers: [] as User[],
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.allUsers = action.payload;
                state.loading = false;
            })
            .addCase(fetchAllUsers.rejected, (state) => {
                state.loading = false;
            })
            .addCase(fetchMyTeammates.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMyTeammates.fulfilled, (state, action) => {
                state.myTeammates = action.payload;
                state.loading = false;
            })
            .addCase(fetchMyTeammates.rejected, (state) => {
                state.loading = false;
            })
            .addCase(fetchExternalUsers.pending, (state) => {
            state.loading = true;
            })
            .addCase(fetchExternalUsers.fulfilled, (state, action) => {
                state.externalUsers = action.payload;
                state.loading = false;
            })
            .addCase(fetchExternalUsers.rejected, (state) => {
                state.loading = false;
            });
    }
});

export default userSlice.reducer;
