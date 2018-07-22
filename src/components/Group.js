import React from 'react';
import decode from 'jwt-decode';
import { Badge, Button } from 'reactstrap';
import * as configConsts from '../config/config';

class Group extends React.Component{
	render(){
		const currentUserData = decode(this.props.authToken);
		const {details, index} = this.props;

		let msgCount = '';
		let listOfUsers = details.userMsgCount;
		
		if(details.userMsgCount.length > 0
			&& (details.userMsgCount[0].sender != currentUserData._id)){
			let userMsgCount = details.userMsgCount.pop();
			msgCount = (userMsgCount.messageCount > 0) ? userMsgCount.messageCount : '';
		}
		return(
			<li className="list-group-item" onClick={(event) => this.props.selectGroupChannel(event, details._id, details.name)} >
				{details.name} <Badge color="success">{msgCount}</Badge>
			</li>
		);
	}
}
export default Group;