import config from '../config';
import {Credentials, AuthResponse, RefreshToken} from '../features/auth/types'

async function fetchWithAuth(url: RequestInfo | URL, options: RequestInit | undefined) {
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Network response was not ok');
    }
    return response.json();
}

const authService = {
    login: async (credentials: Credentials) => {
        return fetchWithAuth(`${config.authUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
    },
    refreshToken: async (refreshTokenPayload: RefreshToken) => {
        return fetchWithAuth(`${config.authUrl}/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(refreshTokenPayload),
        });
    },

    // Implement logout logic as needed
};

export default authService;
