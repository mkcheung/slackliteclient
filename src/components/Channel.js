import Message from './Message';
import React from 'react';
import ChatInput from './ChatInput';
// import io from 'socket.io-client';
import config from '../config/config';
import './channel.css'

class Channel extends React.Component{
	
	socket = {};
	constructor(props){
		super(props);
		this.state = {
			messages:[]
		};    

  		this.openConnection = this.openConnection.bind(this);
  		this.addMessage = this.addMessage.bind(this);
  		this.updateMessages = this.updateMessages.bind(this);
  		this.scrollToBottom = this.scrollToBottom.bind(this);

    	this.conn = new WebSocket('ws://localhost:8090');
	}

	openConnection(event) {
		var url = 'http://localhost:8000/messages/getMessagesInChannel';
		return fetch(url, {
		  method: 'POST',
		  headers: {
		    'Authorization': this.props.authToken,
		    'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
		    channel_id: this.props.index
		  })
		})
		.then((response) => response.json())
		.then((responseJson) => {
			this.setState({
				messages:responseJson.messages
			});
      	})
		.catch((error) => {
			console.log(error);
		});
		console.info("Connection established successfully");
	};

	updateMessages(key, updatedMessage){
		const messages = {...this.state.messages};
		messages[key] = updatedMessage;
		this.setState({
			messages
		});
	}

	addMessage(key, message) {
		const messages = {...this.state.messages};
		messages[key] = message;
		this.setState({messages: messages});
	}
	
    componentDidMount() {    
        var that = this;
        this.conn.onmessage = function (e) {
            var jsonData = JSON.parse(e.data);
            var incomingMessage = (jsonData.messages[0]);
			const message={
				sender: incomingMessage.sender,
				created_at: incomingMessage.created_at,
				message: incomingMessage.message
			}
			that.addMessage(incomingMessage.message_id, message);
        };
    }

	componentWillMount(){
		this.conn.onopen = this.openConnection();
	}

	componentDidUpdate() {
		this.scrollToBottom();
	}

	scrollToBottom() {
		const scrollHeight = this.transcript.scrollHeight;
		const height = this.transcript.clientHeight;
		const maxScrollTop = scrollHeight - height;
		this.transcript.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
	}

	render(){
		const {details, index} = this.props;
		return (
			<div className="row">
				<h1>
					{details.channelName}
				</h1>
				<div className='col-12' id='transcript' ref={(div) => {
          this.transcript = div;
        }}>
					<ul>
						{
							Object
							.keys(this.state.messages)
							.map(key => <Message key={key} index={key} details={this.state.messages[key]} />)
						}
					</ul>
				</div>
				<div className="row">
					<div className='col-12'>
						<ChatInput 
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