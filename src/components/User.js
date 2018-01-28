import React from 'react';

class User extends React.Component{
	render(){
		const {details, index} = this.props;

		if(details.loggedIn){
			return(
				<li className="list-group-item" onClick={() => this.props.selectChannel(details._id, details.email)} >
					Logged-In:{details.email}
				</li>
			);
		} else if (!details.loggedIn){
			return(
				<li className="list-group-item" onClick={() => this.props.selectChannel(details._id, details.email)} >
					Logged-Out:{details.email}
				</li>
			);
		}
	}
}
export default User;