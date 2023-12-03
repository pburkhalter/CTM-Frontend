import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import settingsReducer from '../features/settings/settingsSlice';
import projectsReducer from '../features/projects/projectsSlice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        settings: settingsReducer,
        projects: projectsReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
