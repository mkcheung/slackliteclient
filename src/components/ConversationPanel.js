import React from 'react';
import Login from './Login';
import Logout from './Logout';
import { Route, Redirect, browserHistory }  from 'react-router';

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}
const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }}/>
  );
}

class ConversationPanel extends React.Component{

	constructor(){
		super();
		this.logoutAndRedirect=this.logoutAndRedirect.bind(this);
	}

	logoutAndRedirect(){
		this.props.logout();
		this.props.history.push('/');
	}

	componentWillMount(){
		if (!this.props.checkIfLoggedIn()){
			this.props.history.push('/');
		}
	}

	render(){

        let logoutButton = <Logout logoutAndRedirect={this.logoutAndRedirect}/>;

		return (
			<div className="container-fluid">
				{logoutButton}
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