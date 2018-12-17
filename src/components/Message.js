import React from 'react';
import Moment from 'react-moment';
import decode from 'jwt-decode';
import * as configConsts from '../config/config';

class Message extends React.Component{
	render(){
		const currentUserData = decode(this.props.authToken);
		if(this.props.details.user._id === currentUserData._id) {

			return(
				<li style={configConsts.currentUserMessageStyle}>
					<div style={configConsts.textBoxStyleCurrent}>
						<span>{this.props.details.user.email} <Moment format="MM-DD-YYYY hh:mm a">{this.props.details.created}</Moment></span>
						<br/>
						<span>{this.props.details.message}</span>
					</div>
				</li>
			);
		} else {

			return(
				<li style={configConsts.interlocutorUserMessageStyle}>
					<div style={configConsts.textBoxStyleInterlocutor}>
						<span>{this.props.details.user.email} <Moment format="MM-DD-YYYY hh:mm a">{this.props.details.created}</Moment></span>
						<br/>
						<span>{this.props.details.message}</span>
					</div>
				</li>
			);

		}
	}
}

export default Message;