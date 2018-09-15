const initialState ={
	channel:{},
	groups:[],
	messages:[],
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
			    suggestions: action.suggestions
            };
        default:
            return state;
    }
};


// export function channelPicked(state = false, action) {
//     switch (action.type) {
//         case 'CHANNEL_PICKED':
//             return {
// 		        channel: action.channel,
// 		        messages: action.messages, 
// 		        channelName: action.channelName,
//             }
//         default:
//             return state;
//     }
// }

// export function establishMsgs(state = false, action) {
//     switch (action.type) {
//         case 'ESTABLISH_MSGS':
//             return {
// 		        messages: action.messages, 
//             }
//         default:
//             return state;
//     }
// }

// export function retrieveGroupChannels(state = false, action) {
//     switch (action.type) {
//         case 'GET_GROUP_CHANNELS':
//             return {
// 		        groups: action.groups,
//             }
//         default:
//             return state;
//     }
// }

// export function setModalOpenStatus(state = false, action) {
//     switch (action.type) {
//         case 'SET_MODAL_STATUS':
//             return {
// 		        open: action.open,
//             }
//         default:
//             return state;
//     }
// }

// // export function reloadUsers(state = false, action) {
// export function users(state = [], action) {	
//     switch (action.type) {
//         case 'RELOAD_USERS':
//     	console.log('reloading users');
//     	console.log(state);
//     	return action.users;
//           //   return {
//           //   	...state,
// 		        // users: action.users,
//           //   }
//         default:
//             return state;
//     }
// }

// export function establishTags(state = false, action) {
//     switch (action.type) {
//         case 'ESTABLISH_TAGS':
//             return {
// 		        tags: action.tags,
//             }
//         default:
//             return state;
//     }
// }

// export function setUsersAndSuggestions(state = false, action) {
//     switch (action.type) {
//         case 'SET_USERS_AND_SUGG':
//             return {
// 			    users: action.users,
// 			    suggestions: action.suggestions
//             }
//         default:
//             return state;
//     }
// }