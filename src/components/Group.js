import React from 'react';

class Group extends React.Component{
	render(){
		const {details, index} = this.props;
		return(
			<li className="list-group-item" onClick={(event) => this.props.selectGroupChannel(event, details._id, details.name)} >
				{details.name}
			</li>
		);
	}
}
export default Group;