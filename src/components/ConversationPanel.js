import decode from 'jwt-decode';
import React from 'react';
import Channel from './Channel';
import Login from './Login';
import Logout from './Logout';
import ListOfUsers from './ListOfUsers';
import ListOfGroups from './ListOfGroups';
import { Route, Redirect, browserHistory }  from 'react-router';
import 'react-responsive-modal/lib/react-responsive-modal.css';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3000');
var NotificationSystem = require('react-notification-system');

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
			groups:[],
			messages:[],
            open:false,
            channelName:null
		}
		this.selectChannel=this.selectChannel.bind(this);
		this.selectGroupChannel=this.selectGroupChannel.bind(this);
		this.logoutAndRedirect=this.logoutAndRedirect.bind(this);
		this.isEmptyObject=this.isEmptyObject.bind(this);
		this.addGroupChannel=this.addGroupChannel.bind(this);
		this.onOpenModal=this.onOpenModal.bind(this);
		this.onCloseModal=this.onCloseModal.bind(this);


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
		var url = 'http://localhost:3000/channels/getGroupChannels';

		return fetch(url, {
		  method: 'GET',
		  headers: {
		    'Authorization': this.props.authToken,
		    'Content-Type': 'application/json'
		  }
		})
		.then((response) => response.json())
		.then((responseJson) => {
			let groups = [];
			for(let key in responseJson){
				groups.push(responseJson[key].email);
			}
			this.setState({
				groups:responseJson
			});
      	})
		.catch((error) => {
			console.log(error);
			console.error(error);
		});
	}	

	logoutAndRedirect(){
		socket.emit('disconnect');
		this.props.logout();
		this.props.history.push('/');
	}

	isEmptyObject(obj) {
		for (var key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				return false;
			}
		}
		return true;
	}

	addGroupChannel(groupChannel) {
		let groupChannels = this.state.groups;
		groupChannels.push(groupChannel);
		this.setState({ groups: groupChannels });
		this.onCloseModal();
	}

	selectChannel(userid, email){
  		var channelUsers = '&message_user_ids='+userid;
  		var channelType = '&singular=true';
  		var channelName = '&channelName='+email;
  		var requestUrl = 'http://localhost:3000/channels/getChannel?'+channelUsers+channelType+channelName;
		var self = this;
		return fetch(requestUrl, {
		  method: 'GET',
		  headers: {
		    'Authorization': this.props.authToken,
		    'Content-Type': 'application/json'
		  }
		})
		.then((response) => response.json())
		.then((responseJson) => {
			if(!self.isEmptyObject(self.state.channel)){
				socket.emit('leave conversation', self.state.channel);
			}
			socket.emit('enter conversation', responseJson._id);
			this.setState({
				channel:[responseJson._id],
				messages:responseJson.messages,
				channelName:responseJson.name
			});
      	})
		.catch((error) => {
			console.log(error);
			console.error(error);
		});
	}

	selectGroupChannel(groupChannelId, groupName){
		let url = 'http://localhost:3000/messages/getMessagesInChannel?&channelId='+groupChannelId;
		var self = this;
		return fetch(url, {
		  method: 'GET',
		  headers: {
		    'Authorization': this.props.authToken,
		    'Content-Type': 'application/json'
		  }
		})
		.then((response) => response.json())
		.then((responseJson) => {
			if(!self.isEmptyObject(self.state.channel)){
				socket.emit('leave conversation', self.state.channel[0]._id);
			}
			socket.emit('enter conversation', groupChannelId);
			this.setState({
				channel:[groupChannelId],
				messages:responseJson,
				channelName:groupName
			});
      	})
		.catch((error) => {
			console.log(error);
			console.error(error);
		});
	}

	onOpenModal(){
    	this.setState({ open: true });
  	};
 
	onCloseModal(){
		this.setState({ open: false });
	};

	render(){
        let logoutButton = <Logout logoutAndRedirect={this.logoutAndRedirect}/>;

		return (
			<div className="container-fluid">
				{logoutButton}
				<button onClick={this.onOpenModal}>Create Group:</button>
				<div className="row">
					<div className="col-3">
						<h2>Groups</h2>
						<ListOfGroups
						 groups={this.state.groups}
						 authToken={this.props.authToken}
						 selectGroupChannel={this.selectGroupChannel}
						/>
						<h2>Users</h2>
						<ListOfUsers
						 authToken={this.props.authToken}
						 selectChannel={this.selectChannel}
						 addGroupChannel={this.addGroupChannel}
						 onOpenModal={this.onOpenModal}
						 onCloseModal={this.onCloseModal}
						 open={this.state.open}
						/>
					</div>
					<div className="col-9">
						{
							Object
							.keys(this.state.channel)
							.map(key => <Channel key={key} index={key} authToken={this.props.authToken} channelId={this.state.channel[key]} channelName={this.state.channelName} messages={this.state.messages} />)
						}
					</div>
				</div>
		        <NotificationSystem ref="notificationSystem" />
			</div>
		)
	}
}

export default ConversationPanel;