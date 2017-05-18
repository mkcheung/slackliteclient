import React from 'react';

class User extends React.Component{
	render(){
		const {details} = this.props;
		return(
			<li className="list-group-item">
				{details.username}
			</li>
		);
	}
}
export default User;