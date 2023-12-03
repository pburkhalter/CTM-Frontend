import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        version_major: '?',
        version_minor: '?',
        version_status: '?',
    },
    reducers: {
        settingsFetched: (state, action) => {
            state.version_major = action.payload.version_major;
            state.version_minor = action.payload.version_minor;
            state.version_status = action.payload.version_status;
        },

    },
});

export const { settingsFetched } = settingsSlice.actions;
export default settingsSlice.reducer;
