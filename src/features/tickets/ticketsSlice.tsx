// src/features/projects/projectsSlice.ts
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apiService from '../../api/apiService';
import {Ticket} from './types';

export const fetchTickets = createAsyncThunk(
    'projects/fetchProjects',
    async () => {
        return await apiService.get('ticket/TICKET_ID_TODO'); // TODO
    }
);

const ticketsSlice = createSlice({
    name: 'tickets',
    initialState: {
        tickets: [] as Ticket[],
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTickets.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.tickets = action.payload;
                state.loading = false;
            })
            .addCase(fetchTickets.rejected, (state) => {
                state.loading = false;
            });
    }
});

export default ticketsSlice.reducer;
