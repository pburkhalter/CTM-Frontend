const devConfig = {
    authUrl: 'http://localhost:8080/auth',
    apiUrl: 'http://localhost:8080/api',
    release: 'DEV',
};

const prodConfig = {
    authUrl: 'http://tickets.local:8080/auth',
    apiUrl: 'http://tickets.local:8080/api',
    release: 'PROD'
};

export const appConfig = devConfig

export const appVersion = {
    version_major: 0,
    version_minor: 3,
    version_patch: 7,
    version_release: appConfig.release
}