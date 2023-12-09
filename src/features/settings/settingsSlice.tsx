import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apiService from "../../api/apiService";
import {fetchAllProjects, fetchMyProjects} from "../projects/projectSlice";

export const fetchSettings = createAsyncThunk(
    'settings/fetchSettings',
    async (_, thunkAPI) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const response = await apiService.get('service/stats', accessToken);
            return response;
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
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSettings.fulfilled, (state, action) => {
                if (action.payload && action.payload.info && action.payload.info.version) {
                    const { major, minor, patch, status } = action.payload.info.version;
                    state.version_major = major;
                    state.version_minor = minor;
                    state.version_patch = patch;
                    state.version_status = status;
                }
            })
    }

});


export default settingsSlice.reducer;
