import React from 'react';

class Message extends React.Component{
	render(){
		return(
			<li>
				<span>{this.props.details.user.email} {this.props.details.created}</span>
				<br/>
				<span>{this.props.details.message}</span>
			</li>
		)
	}
}

export default Message;