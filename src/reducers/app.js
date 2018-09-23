const initialState = {
    isLoggedIn:false,
    authToken:null
}

export default (state=initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isLoggedIn:true,
                authToken:action.authToken
            };
        case 'LOGOUT':
            return {
            	...state,
                isLoggedIn:null,
                authToken:null
            };
        default:
            return state;
    }
};