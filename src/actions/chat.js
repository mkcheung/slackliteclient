
import * as configConsts from '../config/config';
import axios from 'axios';

export function textInput(msg) {
    return {
        type: 'TEXT_INPUTTED',
        msg
    };
}

export function processNewMessage(url, authToken, channelType, channelId, message, currUserId) {
    return async (dispatch) => {
    	try{
	  		const processNewMsgResp = await axios.post(url, 
				{
					channelId: channelId,
					channelType: channelType,
					message:message
				},
				{ 
					'headers': {
						'Authorization': authToken,
						'Content-Type': 'application/json'
					}
				}
			);
			
	  		if(processNewMsgResp){
				configConsts.socket.emit('new message', channelId, currUserId);
				dispatch(textInput(''));
	  		}
    	} catch(error) {
			console.log(error);
		};
    };
}