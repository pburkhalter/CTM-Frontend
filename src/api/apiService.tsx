// src/api/apiService.ts
import {appConfig} from '../appConfig';
import {authService} from "./authService";

const apiService = {
    get: async (endpoint: string, accessToken: string) => {
        const response = await fetch(`${appConfig.apiUrl}/${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                await authService.refresh()
            }
            throw new Error('Network response was not ok');
        }
        return response.json();
    },

    post: async (endpoint: string, data: any, accessToken: string) => {
        const response = await fetch(`${appConfig.apiUrl}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            if (response.status === 401) {
                await authService.refresh();
            }
            throw new Error('Network response was not ok');
        }

        return response.json();
    },

    put: async (endpoint: string, data: any, accessToken: string) => {
        const response = await fetch(`${appConfig.apiUrl}/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            if (response.status === 401) {
                await authService.refresh();
            }
            throw new Error('Network response was not ok');
        }

        return response.json();
    },

    delete: async (endpoint: string, accessToken: string) => {
        const response = await fetch(`${appConfig.apiUrl}/${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                await authService.refresh();
            }
            throw new Error('Network response was not ok');
        }

        return response.json();
    },

};

export default apiService;
