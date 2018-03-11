import React from 'react';
import * as configConsts from '../config/config';

class User extends React.Component{
	render(){
		
		const {details, index} = this.props;
		let classIdentifier = "list-group-item channel_" + details._id;
		if(details.loggedIn){
			return(
				<li ref={(ref) => this.userInList = ref} className={classIdentifier} onClick={(event) => this.props.selectChannel(event, details._id, details.email)}><img style={configConsts.loggedInIconPadding} src={configConsts.loggedInIcon}/> {details.email}
				</li>
			);
		} else if (!details.loggedIn){
			return(
				<li ref={(ref) => this.userInList = ref} className={classIdentifier} onClick={(event) => this.props.selectChannel(event, details._id, details.email)} >
					{details.email}
				</li>
			);
		}
	}
}
export default User;