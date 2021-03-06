import React from 'react';
import * as configConsts from '../config/config';

class User extends React.Component{
	render(){
		
		const {details, index} = this.props;

		if(details.loggedIn){
			return(
				<li ref={(ref) => this.userInList = ref} className="list-group-item" onClick={(event) => this.props.selectChannel(event, details._id, details.email)}><img style={configConsts.loggedInIconPadding} src={configConsts.loggedInIcon}/> {details.email}
				</li>
			);
		} else if (!details.loggedIn){
			return(
				<li ref={(ref) => this.userInList = ref} className="list-group-item" onClick={(event) => this.props.selectChannel(event, details._id, details.email)} >
					{details.email}
				</li>
			);
		}
	}
}
export default User;