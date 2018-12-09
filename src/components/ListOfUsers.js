import React from 'react';
import decode from 'jwt-decode';
import ReactDOM from 'react-dom';
import User from './User';
import 'whatwg-fetch';
import { WithContext as ReactTags } from 'react-tag-input';
import Modal from 'react-responsive-modal';

class ListOfUsers extends React.Component{

	constructor(props){
		super(props);
		this.userListItems = new Map();
	}

	render(){
		const currentUserData = decode(this.props.authToken);
		let msgCounts = this.props.msgCounts;
		let users = this.props.users

		for (let key in this.props.users){
			for(let $i = 0; $i < this.props.msgCounts.length; $i++){

				if(this.props.users[key]._id == this.props.msgCounts[$i].sender && currentUserData._id == this.props.msgCounts[$i].recipient){

					this.props.users[key].userMsgCount = [];
					this.props.users[key].userMsgCount.push(this.props.msgCounts[$i]);
				} 
			}
		}

		return(
			<div>
				<ul ref={(ref) => this.userList = ref}>
					{
						Object
						.keys(this.props.users)
						.map(key => <User key={key} authToken={this.props.authToken} ref={c => this.userListItems.set(this.props.users[key]._id, c)} index={key} selectChannel={this.props.selectChannel} details={this.props.users[key]}/>)
					}
				</ul>
			</div>
		)
	}
}

export default ListOfUsers;