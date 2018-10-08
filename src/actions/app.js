export function performLogin(authToken) {
    return {
        type: 'LOGIN',
        authToken
    };
}

export function performLogout() {
    return {
        type: 'LOGOUT',
    };
}

