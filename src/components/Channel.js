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
		}    // Connect to the server
		this.clientInformation = {
        	authToken: props.authToken
        	// You can add more information in a static object
    	};

    	// this.submitHandler=this.submitHandler.bind(this);

    	this.conn = new WebSocket('ws://localhost:8090');

		this.conn.onopen = function(e) {
			console.info("Connection established successfully");
		};
    	// this.socket = io(config.api).connect();

	    // // Listen for messages from the server
	    // this.socket.on('server:message', message => {
	    //   this.addMessage(message);
	    // });
	}


	// submitHandler(event) {
	// 	// Stop the form from refreshing the page on submit
	// 	event.preventDefault();

	// 	// Call the onSend callback with the chatInput message
	// 	this.conn.send(this.chatText.chatInput);

	// 	// Clear the input box
	// 	this.setState({ chatInput: '' });
	// }

	componentWillMount(){

		// this.conn.onmessage = function (event) {
		//   console.log(event.data);
		// }
		// var url = 'http://localhost:8000/messages/getMessagesInChannel';
		// return fetch(url, {
		//   method: 'POST',
		//   headers: {
		//     'Authorization': this.props.authToken,
		//     'Content-Type': 'application/json'
		//   },
		//   body: JSON.stringify({
		//     channel_id: this.props.index
		//   })
		// })
		// .then((response) => response.json())
		// .then((responseJson) => {
		// 	this.setState({
		// 		messages:responseJson.messages
		// 	});
  //     	})
		// .catch((error) => {
		// 	console.log(error);
		// 	console.error(error);
		// });
	}

	// componentDidUpdate() {
	// 	const objDiv = document.getElementById('transcript');
	// 	objDiv.scrollTop = objDiv.scrollHeight;
	// }

	render(){
		const {details, index} = this.props;
		return (
			<div className="row">
				<h1>
					{details.channelName}
				</h1>
				<div className='col-12' id='transcript'>
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
						<ChatInput conn={this.conn} index={this.props.index} authToken={this.props.authToken} submitHandler={this.submitHandler} />
					</div>
				</div>
			</div>
		);
	}
}

export default Channel;