import decode from 'jwt-decode';
import React from 'react';
import './channel.css'
import * as configConsts from '../config/config';
import { connect } from 'react-redux';
import { textInput, processNewMessage } from '../actions/chat';

class ChatInput extends React.Component{
	
	constructor(props) {
		super(props);

		// React ES6 does not bind 'this' to event handlers by default
		this.submitHandler = this.submitHandler.bind(this);
		this.textChangeHandler = this.textChangeHandler.bind(this);
		this.onEnterPress = this.onEnterPress.bind(this);
	}

	textChangeHandler(event)  {
		this.props.inputChat(event.target.value);
	}


	submitHandler(event) {
		event.preventDefault();

		let channelId = this.props.channelId;
		let message = this.chatText.value;
		let channelType = this.props.channelType;
		const currentUser = decode(this.props.authToken);
		var url = configConsts.chatServerDomain + 'message';
		
		this.props.processMessage(url,this.props.authToken,channelType,channelId,message,currentUser._id);
	}

	onEnterPress(event){
		if(event.keyCode === 13 && event.shiftKey === false) {
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
					value={this.props.chatInput}
					placeholder="Write a message..."
					ref={(input) => { this.chatText = input}}
					required
				/>
			</form>
		);
	}
}

const mapStateToProps = (state) => {
    return {
        chatInput: state.textInput,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        inputChat: (msg) => dispatch(textInput(msg)),
        processMessage: (url, authToken, channelType, channelId, message, currUserId) => dispatch(processNewMessage(url, authToken, channelType, channelId, message, currUserId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatInput);
