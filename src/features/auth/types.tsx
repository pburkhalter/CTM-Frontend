export interface Credentials {
    email: string;
    password: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    fullName: string | null;
    email: string | null;
    id: string | null;
}
