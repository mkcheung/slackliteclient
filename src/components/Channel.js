import Message from './Message';
import React from 'react';
import ChatInput from './ChatInput';
import './channel.css'
import io from "socket.io-client";
// Connect to socket.io server
const socket = io.connect('http://localhost:3000');

class Channel extends React.Component{
	
	constructor(){
		super();
		this.state = {
			messages:[]
		}		

		console.log(this);
	}

	componentWillMount(){
		let url = 'http://localhost:3000/messages/getMessagesInChannel?&channelId='+this.props.details._id;
		return fetch(url, {
		  method: 'GET',
		  headers: {
		    'Authorization': this.props.authToken,
		    'Content-Type': 'application/json'
		  }
		})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log('--0-0-0-0-0-0-0--');
			console.log(responseJson);
			this.setState({
				messages:responseJson
			});
      	})
		.catch((error) => {
			console.log(error);
			console.error(error);
		});
	}

	componentWillUnmount() {
		socket.emit('leave conversation', this.props.details._id);
	}

	render(){
		console.log(this.props);
		const {details, index} = this.props;
		let messages = this.state.messages;
console.log(this.state.messages);
console.log(this.props.messages);
		if( this.props.messages.length > 0){
			messages = this.props.messages;
		}
		return (
			<div className="row">
				<h1>
					{details.channelName}
				</h1>
				<div className='col-12'  id='transcript' ref={(div) => {this.transcript = div;}}  style={{height: '600px', overflow:'auto'}}>
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
							channelId={details._id} 
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