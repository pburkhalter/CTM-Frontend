import config from '../config';
import {AuthResponse, AuthData} from '../features/auth/types'

const fetchSettings = async (authPayload: AuthData): Promise<AuthResponse> => {
    try {
        const token = authPayload.accessToken;

        const response = await fetch(`${config.authUrl}/refresh`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            throw new Error('Failed to auth against api');
        }

        const data = await response.json();
        return {
            ok: true,
            data,
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                ok: false,
                error: error.message,
            };
        }
        return {
            ok: false,
            error: 'An unknown error occurred',
        };
    }
};

const settingsService = {
    fetchSettings,
};

export default settingsService;
