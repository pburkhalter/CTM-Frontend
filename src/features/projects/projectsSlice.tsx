// src/features/projects/projectsSlice.ts
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apiService from '../../api/apiService';
import {Project} from './types';
import {RootState} from "../../store/store";

export const fetchAllProjects = createAsyncThunk(
    'projects/fetchAllProjects',
    async (_, thunkAPI) => {
        //const state = thunkAPI.getState() as RootState;
        //const accessToken = state.auth.accessToken;

        const accessToken = localStorage.getItem("accessToken")
        if(accessToken){
            return await apiService.get('projects/', accessToken);
        }
    }
);

export const fetchMyProjects = createAsyncThunk(
    'projects/fetchMyProjects',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const id = state.auth.id;

        //const accessToken = state.auth.accessToken;
        const accessToken = localStorage.getItem("accessToken")

        if (accessToken){
            return await apiService.post('projects/', {'exclude_tickets': false, 'user_id': id}, accessToken);
        }
    }
);

const projectsSlice = createSlice({
    name: 'projects',
    initialState: {
        myProjects: [] as Project[],
        allProjects: [] as Project[],
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProjects.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllProjects.fulfilled, (state, action) => {
                state.allProjects = action.payload;
                state.loading = false;
            })
            .addCase(fetchAllProjects.rejected, (state) => {
                state.loading = false;
            })
            .addCase(fetchMyProjects.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMyProjects.fulfilled, (state, action) => {
                state.myProjects = action.payload;
                state.loading = false;
            })
            .addCase(fetchMyProjects.rejected, (state) => {
                state.loading = false;
            });
    }
});

export default projectsSlice.reducer;
