import decode from 'jwt-decode';
import React from 'react';
import Channel from './Channel';
import Login from './Login';
import Logout from './Logout';
import ListOfUsers from './ListOfUsers';
import ListOfGroups from './ListOfGroups';
import { Route, Redirect, browserHistory }  from 'react-router';
import 'react-responsive-modal/lib/react-responsive-modal.css';
import * as configConsts from '../config/config';
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

	constructor(props){
		super(props);
		this.state={
			channel:{},
			groups:[],
			messages:[],
			users:[],
			suggestions:[],
            tags:[],
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
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleCreateGroup = this.handleCreateGroup.bind(this);
        this.refreshUsers = this.refreshUsers.bind(this);


		configConsts.socket.on('refresh users', (users) => {
			console.log(users);
			this.refreshUsers(users);
	    });

		configConsts.socket.on('refresh messages', (data) => {
			
			let url = configConsts.chatServerDomain + 'messages/getMessagesInChannel?&channelId='+data;
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

	async componentWillMount(){
		if (!this.props.checkIfLoggedIn()){
			this.props.history.push('/');
		}
		var url = configConsts.chatServerDomain + 'channels/getGroupChannels';
		var userUrl = configConsts.chatServerDomain + 'users';

		try{
			const res =	await fetch(url, {
					  method: 'GET',
					  headers: {
					    'Authorization': this.props.authToken,
					    'Content-Type': 'application/json'
					  }
					});

			let groupChannels = await res.json().then((responseJson) => {
						let groups = [];
						for(let key in responseJson){
							groups.push(responseJson[key].email);
						}
						this.setState({
							groups:responseJson
						});
			      	});

			const resUser =	await fetch(userUrl, {
					  method: 'GET',
					  headers: {
					    'Authorization': this.props.authToken,
					    'Content-Type': 'application/json'
					  }
					});

			let options = [];
			let theUsers = await resUser.json().then((responseJson) => {
						
						for(let key in responseJson){
							options.push(responseJson[key].email);
						}
						this.setState({
							users:responseJson,
							suggestions:options
						});
			      	});
		} catch(error) {
			console.log(error);
			console.error(error);
		}
	}	

	refreshUsers(users){

		if (this.props.checkIfLoggedIn()){
			this.setState({
				users:users
			});
		}
	}

	logoutAndRedirect(){
		const loggedOutUserData = decode(this.props.authToken);
		configConsts.socket.off('refresh users');
		configConsts.socket.off('refresh messages');
		configConsts.socket.emit('logged out', loggedOutUserData._id);
		configConsts.socket.disconnect();
		
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
  		var requestUrl = configConsts.chatServerDomain + 'channels/getChannel?'+channelUsers+channelType+channelName;
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
				configConsts.socket.emit('leave conversation', self.state.channel);
			}
			configConsts.socket.emit('enter conversation', responseJson._id);

			let directedTo = null;
			const usersInChannel = responseJson.channelUsers;
			for(let key in usersInChannel){
				if(usersInChannel[key]._id === userid){
					directedTo = usersInChannel[key].firstName + ' ' + usersInChannel[key].lastName;
					break;
				}
			}

			this.setState({
				channel:[responseJson._id],
				messages:responseJson.messages,
				channelName:directedTo
			});
      	})
		.catch((error) => {
			console.log(error);
		});
	}

	selectGroupChannel(groupChannelId, groupName){
		let url = configConsts.chatServerDomain + 'messages/getMessagesInChannel?&channelId='+groupChannelId;
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
				configConsts.socket.emit('leave conversation', self.state.channel[0]._id);
			}
			configConsts.socket.emit('enter conversation', groupChannelId);
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

	handleDelete(i) {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags: tags});
    }
 
    handleAddition(tag) {
		let { tags, users } = this.state;
        let tagId = '';
		for (let key in users){
			if(tag === users[key].email){
				tagId = users[key]._id
				break;
			}
		}
        tags.push({
            id: tagId,
            text: tag
        });
        this.setState({tags: tags});
    }
 
    handleDrag(tag, currPos, newPos) {
        let tags = this.state.tags;
 
        // mutate array 
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);
 
        // re-render 
        this.setState({ tags: tags });
    }
 
    handleCreateGroup(event) {

		event.preventDefault();
    	let userIds=[];
		let channelName = event.target.groupName.value;


		for (let key in this.state.tags){
			userIds.push(this.state.tags[key].id);
		}
		var url = configConsts.chatServerDomain + 'channel';
		return fetch(url, {
		  method: 'POST',
		  headers: {
		    'Authorization': this.props.authToken,
		    'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
		    channelName: channelName,
		    channelUsers:userIds,
		    type:'group'
		  })
		})
		.then((response) => response.json())
		.then((responseJson) => {
			this.addGroupChannel(responseJson);
      	})
		.catch((error) => {
			console.log(error);
		});
    }

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
						 tags={this.state.tags}
						 suggestions={this.state.suggestions}
						 selectGroupChannel={this.selectGroupChannel}
						 addGroupChannel={this.addGroupChannel}
						 handleCreateGroup={this.handleCreateGroup}
						 onOpenModal={this.onOpenModal}
						 onCloseModal={this.onCloseModal}
						 handleDelete={this.handleDelete}
						 handleAddition={this.handleAddition}
						 handleDrag={this.handleDrag}
						 open={this.state.open}
						/>
						<h2>Users</h2>
						<ListOfUsers
						 users={this.state.users}
						 authToken={this.props.authToken}
						 selectChannel={this.selectChannel}
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