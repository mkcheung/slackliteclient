const initialState = {
    open: false,
    isOpen: false
}

export default (state=initialState, action) => {
    switch (action.type) {
        case 'OPEN_REG_MODAL':
            return {
            	...state,
		        open: action.open,
            };
        case 'SET_MODAL_OPEN_STATUS':
            return {
            	...state,
		        isOpen: action.isOpen, 
            };
        default:
            return state;
    }
};