import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apiService from '../../api/apiService';
import {Project} from './types';

export const fetchAllProjects = createAsyncThunk(
    'projects/fetchAllProjects',
    async (_, thunkAPI) => {
        const accessToken = localStorage.getItem("accessToken")
        if(accessToken){
            return await apiService.get('projects/', accessToken);
        }
    }
);

export const fetchMyProjects = createAsyncThunk(
    'projects/fetchMyProjects',
    async (_, thunkAPI) => {
        const id = localStorage.getItem('id')
        const accessToken = localStorage.getItem("accessToken")

        if (accessToken){
            return await apiService.post('projects/', {'exclude_tickets': false, 'user_id': id}, accessToken);
        }
    }
);

const projectSlice = createSlice({
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

export default projectSlice.reducer;
