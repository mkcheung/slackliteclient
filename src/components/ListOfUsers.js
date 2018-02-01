import React from 'react';
import ReactDOM from 'react-dom';
import User from './User';
import 'whatwg-fetch';
import { WithContext as ReactTags } from 'react-tag-input';
import Modal from 'react-responsive-modal';

class ListOfUsers extends React.Component{

	constructor(props){
		super(props);
	}

	render(){
		return(
			<div>
				<ul ref="userList">
					{
						Object
						.keys(this.props.users)
						.map(key => <User key={key} ref="singleUser" index={key} selectChannel={this.props.selectChannel} details={this.props.users[key]}/>)
					}
				</ul>
			</div>
		)
	}
}

export default ListOfUsers;