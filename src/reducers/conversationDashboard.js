const initialState = {
	channel:{},
	groups:[],
	messages:[],
    msgCounts:[],
	users:[],
	suggestions:[],
	tags:[],
	open:false,
	channelName:null
}

export default (state=initialState, action) => {
    switch (action.type) {
        case 'CHANNEL_PICKED':
            return {
            	...state,
		        channel: action.channel,
		        messages: action.messages, 
		        channelName: action.channelName,
            };
        case 'ESTABLISH_MSGS':
            return {
            	...state,
		        messages: action.messages, 
            };
        case 'GET_GROUP_CHANNELS':
            return {
            	...state,
		        groups: action.groups,
            };
        case 'SET_MODAL_STATUS':
            return {
            	...state,
		        open: action.open,
            };
        case 'RELOAD_USERS':
            return {
            	...state,
		        users: action.users,
            };
        case 'ESTABLISH_TAGS':
            return {
            	...state,
		        tags: action.tags,
            };
        case 'SET_USERS_AND_SUGG':
            return {
                ...state,
                users: action.users,
                msgCounts: action.msgCounts,
                suggestions: action.suggestions
            };
        case 'SET_USERS_SUGG_CHANNEL':
            return {
                ...state,
                users: action.users,
                msgCounts: action.msgCounts,
                suggestions: action.suggestions,
                channel: action.channel,
                messages: action.messages,
                channelName: action.channelName
            };
        default:
            return state;
    }
};