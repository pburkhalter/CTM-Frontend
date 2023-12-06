import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

import settingsReducer from '../features/settings/settingsSlice';
import projectReducer from '../features/projects/projectSlice';
import userSlice from "../features/users/userSlice";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        settings: settingsReducer,
        allProjects: projectReducer,
        projects: projectReducer,
        users: userSlice
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
