import config from '../config';
import {Credentials} from '../features/auth/types'

async function fetchWithAuth(url: RequestInfo | URL, options: RequestInit | undefined) {
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Network response was not ok');
    }
    return response.json();
}

export const authService = {
    login: async (credentials: Credentials) => {
        const response = await fetchWithAuth(`${config.authUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        if (response.accessToken && response.refreshToken) {
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('id', response.id);
            localStorage.setItem('email', response.email);
            localStorage.setItem('fullName', response.fullName);
            localStorage.setItem('lastUpdate', Date.now().toString())
        }
        return response;
    },
    refresh: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await fetchWithAuth(`${config.authUrl}/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({refreshToken: refreshToken}),
        });

        if (response.accessToken && response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('lastUpdate', Date.now().toString())
        }
        return response;
    },

    logout: async () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
};
