import Message from './Message';
import React from 'react';
import './channel.css'

class Channel extends React.Component{
	
	constructor(){
		super();
		this.state = {
			messages:[]
		}
	}

	componentWillMount(){
		var url = 'http://localhost:3000/messages/getMessagesInChannel';
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

	render(){
		const {details, index} = this.props;
		return (
			<div className="row">
				<h1>
					{details.channelName}
				</h1>
				<div className='col-12 transcript'>
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
						<input>
							
						</input>
						<button>
							Send
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default Channel;