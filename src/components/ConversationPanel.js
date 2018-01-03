import decode from 'jwt-decode';
import React from 'react';
import Channel from './Channel';
import Login from './Login';
import Logout from './Logout';
import ListOfUsers from './ListOfUsers';
import { Route, Redirect, browserHistory }  from 'react-router';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3000');

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
			channel:{},
			messages:[]
		}
		this.selectChannel=this.selectChannel.bind(this);
		this.logoutAndRedirect=this.logoutAndRedirect.bind(this);


		socket.on('refresh messages', (data) => {
			let url = 'http://localhost:3000/messages/getMessagesInChannel?&channelId='+data;
			return fetch(url, {
			  method: 'GET',
			  headers: {
			    'Authorization': this.props.authToken,
			    'Content-Type': 'application/json'
			  }
			})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log('refressed messages');
				this.setState({
					messages:responseJson
				});

	      	})
			.catch((error) => {
				console.log(error);
				console.error(error);
			});
	    });
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

	selectChannel(userid, email){
  		// var token = decode(this.props.authToken);
  		var channelUsers = '&message_user_ids='+userid;
  		var channelType = '&singular=true';
  		var channelName = '&channelName='+email;
  		var requestUrl = 'http://localhost:3000/channels/getChannel?'+channelUsers+channelType+channelName;

		return fetch(requestUrl, {
		  method: 'GET',
		  headers: {
		    'Authorization': this.props.authToken,
		    'Content-Type': 'application/json'
		  }
		})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log('*************************');
			console.log([responseJson]);
			console.log(responseJson._id);
			console.log('*************************');
			socket.emit('enter conversation', responseJson._id);
			this.setState({
				channel:[responseJson]
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
							.map(key => <Channel key={key} index={key} authToken={this.props.authToken} details={this.state.channel[key]} messages={this.state.messages} />)
						}
					</div>
				</div>
			</div>
		)
	}
}

export default ConversationPanel;