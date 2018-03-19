import React from 'react';
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