import Message from './Message';
import React from 'react';
import ChatInput from './ChatInput';
import './channel.css'
// Connect to socket.io server
import * as configConsts from '../config/config';

class Channel extends React.Component{
	

	constructor(props){
		super(props);
		this.scrollToBottom=this.scrollToBottom.bind(this);
	}

	componentWillUnmount() {
		configConsts.socket.emit('leave conversation', this.channelId);
	}

	componentDidMount() {
		this.scrollToBottom();
	}

	componentDidUpdate() {
		this.scrollToBottom();
	}

	scrollToBottom(){
	  var transcriptBlock = this.transcript;
	  transcriptBlock.scrollTop = transcriptBlock.scrollHeight;
	}

	render(){
		const {channelId, channelName, index, messages} = this.props;
		return (
			<div >
				<div className="row">
					<div className='col-12'>
						<h1>{channelName}</h1>
						<div id='transcript' ref={(ref) => this.transcript = ref}  style={{height: '600px', overflow:'auto'}}>
							<ul>
								{
									Object
									.keys(messages)
									.map(key => <Message key={key} index={key} authToken={this.props.authToken} details={messages[key]} />)
								}
							</ul>
						</div>
					</div>
				</div>
				<div className="row">
					<div className='col-12'>
						<ChatInput 
							channelId={channelId} 
							conn={this.conn} 
							channelType={this.props.channelType} 
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