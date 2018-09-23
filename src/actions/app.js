export function performLogin(authToken) {
    return {
        type: 'LOGIN',
        authToken
    };
}

export function performLogout() {
	console.log('logout being performed');
    return {
        type: 'LOGOUT',
    };
}