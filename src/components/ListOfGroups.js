import React from 'react';
import ReactDOM from 'react-dom';
import Group from './Group';
import 'whatwg-fetch';
import { WithContext as ReactTags } from 'react-tag-input';
import Modal from 'react-responsive-modal';

class ListofGroups extends React.Component{

	constructor(){
		super();
	}


	render(){
		return(
			<div>
				<ul>
					{
						Object
						.keys(this.props.groups)
						.map(key => <Group key={key} index={key} selectGroupChannel={this.props.selectGroupChannel} details={this.props.groups[key]}/>)
					}
				</ul>
			</div>
		)
	}
}

export default ListofGroups;