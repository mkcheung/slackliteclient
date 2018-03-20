import React from 'react';
import decode from 'jwt-decode';
import { Badge, Button } from 'reactstrap';
import * as configConsts from '../config/config';

class User extends React.Component{
	render(){
		
		const {details, index} = this.props;
		const currentUserData = decode(this.props.authToken);

		let classIdentifier = "list-group-item channel_" + details._id;
		let msgCount = '';
		if(details.userMsgCount.length > 0 
			&& (details.userMsgCount[0].sender == details._id)  
			&& (details.userMsgCount[0].recipient == currentUserData._id) ){
			let userMsgCount = details.userMsgCount.pop();
			msgCount = (userMsgCount.messageCount > 0) ? userMsgCount.messageCount : '';
		}
		if(details.loggedIn){
			return(
				<li ref={(ref) => this.userInList = ref} className={classIdentifier} onClick={(event) => this.props.selectChannel(event, details._id, details.email)}><img style={configConsts.loggedInIconPadding} src={configConsts.loggedInIcon}/> {details.email} <Badge color="success">{msgCount}</Badge> 
				</li>
			);
		} else if (!details.loggedIn){
			return(
				<li ref={(ref) => this.userInList = ref} className={classIdentifier} onClick={(event) => this.props.selectChannel(event, details._id, details.email)} >
					{details.email} <Badge color="success">{msgCount}</Badge> 
				</li>
			);
		}
	}
}
export default User;