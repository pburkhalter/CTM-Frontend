// src/api/apiService.ts
import config from '../config';

const getAccessToken = () => {
    // Retrieve the access token from localStorage or cookies
    return localStorage.getItem('accessToken');
};

const apiService = {
    get: async (endpoint: string) => {
        const accessToken = getAccessToken();
        const response = await fetch(`${config.apiUrl}/${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Handle token expiration, refresh token, etc.
            }
            throw new Error('Network response was not ok');
        }

        return response.json();
    },

    // Similarly, you can add POST, PUT, DELETE methods
    // post: async (endpoint: string, data: any) => { ... },
    // put: async (endpoint: string, data: any) => { ... },
    // delete: async (endpoint: string) => { ... },
};

export default apiService;
