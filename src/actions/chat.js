
import * as configConsts from '../config/config';

export function textInput(msg) {
    return {
        type: 'TEXT_INPUTTED',
        msg
    };
}

export function processNewMessage(url, authToken, channelType, channelId, message, currUserId) {
    return (dispatch) => {
    	fetch(url, {
		  method: 'POST',
		  headers: {
		    'Authorization': authToken,
		    'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
		    channelId: channelId,
		    channelType: channelType,
		    message:message
		  })
		})
		.then((response) => response.json())
		.then((responseJson) => {
			configConsts.socket.emit('new message', channelId, currUserId);
			// Clear the input box
			dispatch(textInput(''));
      	})
		.catch((error) => {
			console.log(error);
		});

        // fetch(url)
        //     .then((response) => {
        //         if (!response.ok) {
        //             throw Error(response.statusText);
        //         }
        //         dispatch(itemsIsLoading(false));
        //         return response;
        //     })
        //     .then((response) => response.json())
        //     .then((items) => dispatch(itemsFetchDataSuccess(items)))
        //     .catch(() => dispatch(itemsHasErrored(true)));
    };
}