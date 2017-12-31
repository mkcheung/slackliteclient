import React from 'react';

class Message extends React.Component{
	// render(){
	// 	return(
	// 		<li>
	// 			<span>{this.props.details.sender} {this.props.details.created}</span>
	// 			<br/>
	// 			<span>{this.props.details.message}</span>
	// 		</li>
	// 	)
	// }
	render(){
		return(
			<li>
				<span>{this.props.details.created}</span>
				<br/>
				<span>{this.props.details.message}</span>
			</li>
		)
	}
}

export default Message;