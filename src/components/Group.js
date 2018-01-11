import React from 'react';

class Group extends React.Component{
	render(){
		const {details, index} = this.props;

		return(
			<li className="list-group-item" >
				{details.name}
			</li>
		);
	}
}
export default Group;