import React from 'react';
import Moment from 'react-moment';

class Message extends React.Component{
	render(){
		return(
			<li>
				<span>{this.props.details.user.email} <Moment format="MM-DD-YYYY hh:mm a">{this.props.details.created}</Moment></span>
				<br/>
				<span>{this.props.details.message}</span>
			</li>
		)
	}
}

export default Message;