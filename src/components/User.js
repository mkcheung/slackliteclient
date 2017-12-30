import React from 'react';

class User extends React.Component{
	render(){
		const {details, index} = this.props;
		return(
			<li className="list-group-item" onClick={() => this.props.selectChannel(index)} >
				{details.email}
			</li>
		);
	}
}
export default User;