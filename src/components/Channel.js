import Message from './Message';
import React from 'react';
import ChatInput from './ChatInput';
import './channel.css'

class Channel extends React.Component{
	
	constructor(){
		super();
		this.state = {
			messages:[]
		}
	}

	componentWillMount(){
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
			console.error(error);
		});
	}

	componentDidUpdate() {
		const objDiv = document.getElementById('transcript');
		objDiv.scrollTop = objDiv.scrollHeight;
	}

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
						<ChatInput />
					</div>
				</div>
			</div>
		);
	}
}

export default Channel;