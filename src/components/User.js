import React from 'react';
const loggedInIcon = require('../icons/icons8-communicate-16.png');

class User extends React.Component{
	render(){
		
		const {details, index} = this.props;

		if(details.loggedIn){
			return(
				<li ref="userInList" className="list-group-item" onClick={(e) => this.props.selectChannel(e, details._id, details.email)}><img style={{ paddingRight: 5 }} src={loggedInIcon}/> {details.email}
				</li>
			);
		} else if (!details.loggedIn){
			return(
				<li ref="userInList" className="list-group-item" onClick={(e) => this.props.selectChannel(e, details._id, details.email)} >
					{details.email}
				</li>
			);
		}
	}
}
export default User;