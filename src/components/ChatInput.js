import Message from './Message';
import React from 'react';
import './channel.css'

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
		// Call the onSend callback with the chatInput message
		this.props.conn.send(JSON.stringify({
			channelId:this.props.index,
			authToken:this.props.authToken,
			message:this.chatText.value
		}));

	// this.props.updateFish(key, updated);
		// messagesList.innerHTML += '<li class="sent"><span>Sent:</span>' + message +
                            // '</li>';

		// Clear the input box
		this.setState({ chatInput: '' });
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