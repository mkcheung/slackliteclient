import decode from 'jwt-decode';
import Message from './Message';
import React from 'react';
import './channel.css'
import * as configConsts from '../config/config';

class ChatInput extends React.Component{
	
	constructor(props) {
		super(props);
		// Set initial state of the chatInput so that it is not undefined
		this.state = { 
			chatInput: '' 
		};

		// React ES6 does not bind 'this' to event handlers by default
		this.submitHandler = this.submitHandler.bind(this);
		this.textChangeHandler = this.textChangeHandler.bind(this);
		this.onEnterPress = this.onEnterPress.bind(this);
	}

	textChangeHandler(event)  {
		this.setState({ chatInput: event.target.value });
	}


	submitHandler(event) {
		event.preventDefault();

		let channelId = this.props.channelId;
		let message = this.chatText.value;

		var url = configConsts.chatServerDomain + 'message';
		return fetch(url, {
		  method: 'POST',
		  headers: {
		    'Authorization': this.props.authToken,
		    'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
		    channelId: channelId,
		    message:message
		  })
		})
		.then((response) => response.json())
		.then((responseJson) => {
			const currentUser = decode(this.props.authToken);
			configConsts.socket.emit('new message', channelId, currentUser._id);
			// Clear the input box
			this.setState({ chatInput: '' });
      	})
		.catch((error) => {
			console.log(error);
		});
	}

	onEnterPress(event){
		if(event.keyCode == 13 && event.shiftKey == false) {
			event.preventDefault();
			this.submitHandler(event);
		}
	}

	render() {
		return (
			<form className="chat-input" onKeyDown={this.onEnterPress}>
				<textarea type="text"
					style={{width:'100%'}}
					onChange={this.textChangeHandler}
					value={this.state.chatInput}
					placeholder="Write a message..."
					ref={(input) => { this.chatText = input}}
					required
				/>
			</form>
		);
	}
}

export default ChatInput;