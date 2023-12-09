// src/features/projects/projectsSlice.ts
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apiService from '../../api/apiService';
import {store} from "../../store/store";

import {NewTicketWithAPI, Ticket, TicketStatusUpdate} from './types';

const state = store.getState();
const accessToken = state.auth.accessToken;


export const fetchTickets = createAsyncThunk(
    'tickets/fetchTickets',
    async () => {
        if (accessToken) {
            return await apiService.get('ticket/', accessToken);
        }
    }
);

export const fetchTicketById = createAsyncThunk(
    'tickets/fetchTickedById',
    async (id: string) => {
        if (accessToken) {
            return await apiService.get(`ticket/${id}`, accessToken);
        }
    }
);

interface ApiError {
    message: string;       // A human-readable message describing the error
    statusCode: number;    // The HTTP status code associated with the error
    // You can add more fields depending on the structure of your API's error responses
}

export const createTicket = createAsyncThunk<Ticket, NewTicketWithAPI, { rejectValue: ApiError }>(
    'tickets/createTicket',
    async (ticketData: NewTicketWithAPI, { rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                const payload = {
                    projectId: ticketData.projectId,
                    responsibleId: ticketData.responsibleId,
                    statusId: ticketData.statusId,
                    name: ticketData.name,
                    description: ticketData.description,
                    deadline: ticketData.deadline // Ensure this is in ISO 8601 format
                };

                const response = await apiService.post('tickets/', payload, accessToken);
                return response.data; // Assuming the API response includes the ticket data in a 'data' field
            }
        } catch (error) {
            // Handle error, e.g., by returning a reject value
            return rejectWithValue({
                message: 'Network error or other non-API error',
                statusCode: 0
            });
        }
    }
);

export const updateTicket = createAsyncThunk(
    'tickets/updateTicket',
    async (ticket: Ticket) => {
        if (accessToken) {
            return await apiService.put(`ticket/${ticket.id}`, ticket, accessToken);
        }
    }
);

export const updateTicketStatus = createAsyncThunk(
    'tickets/updateTicketStatus',
    async (ticketStatus: TicketStatusUpdate) => {
        if (accessToken) {
            return await apiService.put(`ticket/${ticketStatus.id}`, ticketStatus, accessToken);
        }
    }
);

export const deleteTicket = createAsyncThunk(
    'tickets/deleteTicket',
    async (id: string) => {
        if (accessToken) {
            return await apiService.delete(`ticket/${id}`, accessToken);
        }
    }
);


const ticketSlice = createSlice({
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

export default ticketSlice.reducer;
