import React from 'react';

class ConversationPanel extends React.Component{
	render(){
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="col-3">
						Here's where the list of users should go
					</div>
					<div className="col-9">
						This is where I want the conversations to take place
					</div>
				</div>
			</div>
		)
	}
}

export default ConversationPanel;