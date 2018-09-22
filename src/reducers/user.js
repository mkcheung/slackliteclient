const initialState = {
	msgCount:null
}

export default (state=initialState, action) => {
    switch (action.type) {
        case 'MSG_COUNT_UPDATED':
            console.log(action.msgCount);
            return {
            	...state,
		        msgCount: action.msgCount,
            };
        default:
            return state;
    }
};