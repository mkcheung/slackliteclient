import Message from './Message';
import React from 'react';
import ChatInput from './ChatInput';
import './channel.css'
import io from "socket.io-client";
// Connect to socket.io server
import * as configConsts from '../config/config';
const socket = io.connect(configConsts.chatServerDomain);

class Channel extends React.Component{
	

	constructor(props){
		super(props);
		this.scrollToBottom=this.scrollToBottom.bind(this);
	}

	componentWillUnmount() {
		socket.emit('leave conversation', this.channelId);
	}

	componentDidMount() {
		this.scrollToBottom();
	}

	componentDidUpdate() {
		this.scrollToBottom();
	}

	scrollToBottom(){
	  var transcriptBlock = this.refs.transcript;
	  transcriptBlock.scrollTop = transcriptBlock.scrollHeight;
	}

	render(){
		const {channelId, channelName, index, messages} = this.props;
		return (
			<div className="row">
				<h1>{channelName}</h1>
				<div className='col-12'  id='transcript' ref='transcript'  style={{height: '600px', overflow:'auto'}}>
					<ul>
						{
							Object
							.keys(messages)
							.map(key => <Message key={key} index={key} details={messages[key]} />)
						}
					</ul>
				</div>
				<div className="row">
					<div className='col-12'>
						<ChatInput 
							channelId={channelId} 
							conn={this.conn} 
							index={this.props.index} 
							authToken={this.props.authToken} 
							submitHandler={this.submitHandler}
							updateMessages={this.updateMessages} />
					</div>
				</div>
			</div>
		);
	}
}

export default Channel;