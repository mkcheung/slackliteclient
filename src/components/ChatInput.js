import Message from './Message';
import React from 'react';
import io from 'socket.io-client';
import './channel.css'
// Connect to socket.io server
export const socket = io.connect('http://localhost:3000');

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
	}

	textChangeHandler(event)  {
		this.setState({ chatInput: event.target.value });
	}


	submitHandler(event) {
		// Stop the form from refreshing the page on submit
		event.preventDefault();

		console.log(this.props);

		// // Call the onSend callback with the chatInput message
		// this.props.conn.send(JSON.stringify({
		// 	channelId:this.props.index,
		// 	authToken:this.props.authToken,
		// 	message:this.chatText.value
		// }));
		let channelId = this.props.channelId;
		let message = this.chatText.value;

		var url = 'http://localhost:3000/message';
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
			socket.emit('new message', channelId);
			// Clear the input box
			this.setState({ chatInput: '' });
			// this.setState({
			// 	messages:responseJson.messages
			// });
      	})
		.catch((error) => {
			console.log(error);
		});

		// socket.emit('new message', this.props.index);

	// this.props.updateFish(key, updated);
		// messagesList.innerHTML += '<li class="sent"><span>Sent:</span>' + message +
                            // '</li>';

	}

	render() {
		return (
			<form className="chat-input" onSubmit={this.submitHandler}>
				<input type="text"
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