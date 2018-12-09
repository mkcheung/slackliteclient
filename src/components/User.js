import React from 'react';
import decode from 'jwt-decode';
import { Badge, Button } from 'reactstrap';
import * as configConsts from '../config/config';

class User extends React.Component{


	render(){
		
		const {details, index} = this.props;

		const currentUserData = decode(this.props.authToken);

		let classIdentifier = "list-group-item channel_" + details._id;
		let umc = details.userMsgCount[0];
		let umcId = (umc) ? umc._id : null;

		if(details.loggedIn){
			if(umc && umc.messageCount !== 0 && currentUserData._id == umc.recipient){
				console.log('1-------'+umcId+'-------');
				return(
					<li ref={(ref) => this.userInList = ref} className={classIdentifier} onClick={(event) => this.props.selectChannel(event, details._id, details.email, umcId)}><img alt="" style={configConsts.loggedInIconPadding} src={configConsts.loggedInIcon}/> {details.email} <Badge color="success">{umc.messageCount}</Badge> 
					</li>
				);
			} else {

				console.log('2-------'+umcId+'-------');
				return(
					<li ref={(ref) => this.userInList = ref} className={classIdentifier} onClick={(event) => this.props.selectChannel(event, details._id, details.email, umcId)}><img alt="" style={configConsts.loggedInIconPadding} src={configConsts.loggedInIcon}/> {details.email}  
					</li>
				);
			}
		} else if (!details.loggedIn){
			if(umc && umc.messageCount !== 0){
				console.log('3-------'+umcId+'-------');
				return(
					<li ref={(ref) => this.userInList = ref} className={classIdentifier} onClick={(event) => this.props.selectChannel(event, details._id, details.email, umcId)} >
						{details.email} <Badge color="success">{umc.messageCount}</Badge> 
					</li>
				);
			} else {
				console.log('4-------'+umcId+'-------');
				return(
					<li ref={(ref) => this.userInList = ref} className={classIdentifier} onClick={(event) => this.props.selectChannel(event, details._id, details.email, umcId)}><img alt="" style={configConsts.loggedInIconPadding} src={configConsts.loggedInIcon}/> {details.email}  
					</li>
				);
			}
		}
	}
}
export default User;