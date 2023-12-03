export interface Credentials {
    username: string;
    password: string;
}

export interface AccessToken {
    accessToken: string;
}

export interface RefreshToken {
    refreshToken: string;
}

export interface AuthResponse {
    ok: boolean;
    data?: AuthData;
    error?: string;
}

export interface AuthData {
    accessToken: string;
    refreshToken: string;
    // other fields that your API might return
}

export interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    // ... other auth state properties
}
