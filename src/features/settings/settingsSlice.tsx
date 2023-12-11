import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apiService from "../../api/apiService";
import {stat} from "fs";

export const fetchSettings = createAsyncThunk(
    'settings/fetchSettings',
    async (_, thunkAPI) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            return await apiService.get('service/stats', accessToken);
        }
    }
);

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        version_major: 0,
        version_minor: 0,
        version_patch: 0,
        version_status: '',
        project_count: 0,
        ticket_count: 0
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSettings.fulfilled, (state, action) => {
                if (action.payload && action.payload.info && action.payload.info.version) {
                    const { major, minor, patch, status } = action.payload.info.version;
                    const { project_count, ticket_count } = action.payload.info;

                    state.version_major = major;
                    state.version_minor = minor;
                    state.version_patch = patch;
                    state.version_status = status;
                    state.project_count = project_count;
                    state.ticket_count = ticket_count;
                }
            })
    }

});


export default settingsSlice.reducer;
