import React from 'react';
import decode from 'jwt-decode';
import { Badge, Button } from 'reactstrap';
import * as configConsts from '../config/config';

class User extends React.Component{

	constructor(props){
		super(props);
		const {details, index} = this.props;
		console.log(details);
		let userMsgCount = details.userMsgCount.pop();
		let msgCount = ((userMsgCount) && (userMsgCount.messageCount) && userMsgCount.messageCount > 0) ? userMsgCount.messageCount : '';
	}

	render(){
		
		const {details, index} = this.props;
		const currentUserData = decode(this.props.authToken);

		let classIdentifier = "list-group-item channel_" + details._id;
		let umc = details.userMsgCount.pop();

		let umcId = (umc) ? umc._id : null;
		if(details.loggedIn){
			if(umc && umc.messageCount !== 0){
				return(
					<li ref={(ref) => this.userInList = ref} className={classIdentifier} onClick={(event) => this.props.selectChannel(event, details._id, details.email, umcId)}><img style={configConsts.loggedInIconPadding} src={configConsts.loggedInIcon}/> {details.email} <Badge color="success">{umc.messageCount}</Badge> 
					</li>
				);
			} else {
				return(
					<li ref={(ref) => this.userInList = ref} className={classIdentifier} onClick={(event) => this.props.selectChannel(event, details._id, details.email, umcId)}><img style={configConsts.loggedInIconPadding} src={configConsts.loggedInIcon}/> {details.email}  
					</li>
				);
			}
		} else if (!details.loggedIn){
			if(umc && umc.messageCount !== 0){
				return(
					<li ref={(ref) => this.userInList = ref} className={classIdentifier} onClick={(event) => this.props.selectChannel(event, details._id, details.email, umcId)} >
						{details.email} <Badge color="success">{umc.messageCount}</Badge> 
					</li>
				);
			} else {
				return(
					<li ref={(ref) => this.userInList = ref} className={classIdentifier} onClick={(event) => this.props.selectChannel(event, details._id, details.email, umcId)}><img style={configConsts.loggedInIconPadding} src={configConsts.loggedInIcon}/> {details.email}  
					</li>
				);
			}
		}
	}
}
export default User;