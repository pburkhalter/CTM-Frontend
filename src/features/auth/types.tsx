export interface Credentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    ok: boolean;
    data?: AuthData;
    error?: string;
}

export interface AuthData {
    accessToken: string;
    refreshToken: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    fullName: string | null;
    email: string | null;
    id: string | null;
}
