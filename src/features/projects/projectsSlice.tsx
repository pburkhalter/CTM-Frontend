// src/features/projects/projectsSlice.ts
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apiService from '../../api/apiService';
import {Project} from './types';

export const fetchProjects = createAsyncThunk(
    'projects/fetchProjects',
    async () => {
        return await apiService.get('project');
    }
);

const projectsSlice = createSlice({
    name: 'projects',
    initialState: {
        projects: [] as Project[],
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.projects = action.payload;
                state.loading = false;
            })
            .addCase(fetchProjects.rejected, (state) => {
                state.loading = false;
            });
    }
});

export default projectsSlice.reducer;
