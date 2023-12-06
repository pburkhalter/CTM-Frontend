import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apiService from "../../api/apiService";

export const fetchSettings = createAsyncThunk(
    'settings/fetchSettings',
    async (_, thunkAPI) => {

        const accessToken = localStorage.getItem("accessToken")
        if(accessToken){
            return await apiService.get('service/info', accessToken);
        }
    }
);

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        version_major: '?',
        version_minor: '?',
        version_patch: '?',
        version_status: '?',
    },
    reducers: {
        settingsFetched: (state, action) => {
            state.version_major = action.payload.info.version.major;
            state.version_minor = action.payload.info.version.minor;
            state.version_patch = action.payload.info.version.patch;
            state.version_status = action.payload.info.version.patch;
        },

    },
});

export const { settingsFetched } = settingsSlice.actions;
export default settingsSlice.reducer;
