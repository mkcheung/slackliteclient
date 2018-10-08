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
        default:
            return state;
    }
};