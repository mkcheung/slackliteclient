import React from 'react';
import Channel from './Channel';
import Login from './Login';
import Logout from './Logout';
import ListOfUsers from './ListOfUsers';
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
						<ListOfUsers authToken={this.props.authToken}/>
					</div>
					<div className="col-9">
						<Channel/>
					</div>
				</div>
			</div>
		)
	}
}

export default ConversationPanel;