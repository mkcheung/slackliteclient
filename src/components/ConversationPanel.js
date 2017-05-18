import decode from 'jwt-decode';
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
		this.state={
			channel:{}
		}
		this.selectChannel=this.selectChannel.bind(this);
		this.logoutAndRedirect=this.logoutAndRedirect.bind(this);
	}

	componentWillMount(){
		if (!this.props.checkIfLoggedIn()){
			this.props.history.push('/');
		}
	}

	logoutAndRedirect(){
		this.props.logout();
		this.props.history.push('/');
	}

	selectChannel(key){
  		var token = decode(this.props.authToken);
  		var currentUser = token.user_id;
  		var channelUsers = '&message_user_ids='+key+','+currentUser;
  		var channelType = '&singular=true';
  		var requestUrl = 'http://localhost:8000/channels/getChannel?'+channelUsers+channelType;

		return fetch(requestUrl, {
		  method: 'GET',
		  headers: {
		    'Authorization': this.props.authToken,
		    'Content-Type': 'application/json'
		  }
		})
		.then((response) => response.json())
		.then((responseJson) => {
			this.setState({
				channel:responseJson.channel
			});
      	})
		.catch((error) => {
			console.log(error);
			console.error(error);
		});
	}

	render(){

        let logoutButton = <Logout logoutAndRedirect={this.logoutAndRedirect}/>;

		return (
			<div className="container-fluid">
				{logoutButton}
				<div className="row">
					<div className="col-3">
						<ListOfUsers
						 authToken={this.props.authToken}
						 selectChannel={this.selectChannel}
						/>
					</div>
					<div className="col-9">
						{
							Object
							.keys(this.state.channel)
							.map(key => <Channel key={key} index={key} authToken={this.props.authToken} details={this.state.channel[key]} />)
						}
					</div>
				</div>
			</div>
		)
	}
}

export default ConversationPanel;