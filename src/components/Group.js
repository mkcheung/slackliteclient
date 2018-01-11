import React from 'react';

class Group extends React.Component{
	render(){
		const {details, index} = this.props;

		return(
			<li className="list-group-item" onClick={() => this.props.selectGroupChannel(details._id)} >
				{details.name}
			</li>
		);
	}
}
export default Group;