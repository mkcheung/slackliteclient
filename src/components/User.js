import React from 'react';
import * as configConsts from '../config/config';

class User extends React.Component{
	render(){
		
		const {details, index} = this.props;

		if(details.loggedIn){
			return(
				<li ref="userInList" className="list-group-item" onClick={(e) => this.props.selectChannel(e, details._id, details.email)}><img style={configConsts.loggedInIconPadding} src={configConsts.loggedInIcon}/> {details.email}
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