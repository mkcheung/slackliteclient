import React from 'react';
import Moment from 'react-moment';
import decode from 'jwt-decode';

class Message extends React.Component{
	render(){
		const currentUserData = decode(this.props.authToken);
			if(this.props.details.user._id == currentUserData._id) {

				return(
					<li style={{float:'right',clear:'both',backgroundColor:'#334CFF',color:'white',listStyle:'none'}}>
						<span>{this.props.details.user.email} <Moment format="MM-DD-YYYY hh:mm a">{this.props.details.created}</Moment></span>
						<br/>
						<span>{this.props.details.message}</span>
					</li>
				);
			} else {

				return(
					<li style={{float:'left',clear: 'both',backgroundColor:'#C9E1E5',listStyle:'none'}}>
						<span>{this.props.details.user.email} <Moment format="MM-DD-YYYY hh:mm a">{this.props.details.created}</Moment></span>
						<br/>
						<span>{this.props.details.message}</span>
					</li>
				);

			}
	}
}

export default Message;