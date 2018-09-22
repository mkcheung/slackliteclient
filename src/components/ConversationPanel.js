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
import { findDOMNode }  from 'react-dom';
import { Container, Row, Col, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { connect } from 'react-redux';
import { channelPicked, establishMsgs, retrieveGroupChannels, setModalOpenStatus, reloadUsers, establishTags, setUsersAndSuggestions } from '../actions/conversationDashboard';

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
		this.selectChannel=this.selectChannel.bind(this);
		this.selectGroupChannel=this.selectGroupChannel.bind(this);
		this.getUserRelatedChannels=this.getUserRelatedChannels.bind(this);
		this.logoutAndRedirect=this.logoutAndRedirect.bind(this);
		this.isEmptyObject=this.isEmptyObject.bind(this);
		this.addGroupChannel=this.addGroupChannel.bind(this);
		this.getGroupChannels=this.getGroupChannels.bind(this);
		this.onOpenModal=this.onOpenModal.bind(this);
		this.onCloseModal=this.onCloseModal.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleCreateGroup = this.handleCreateGroup.bind(this);
        this.refreshUsers = this.refreshUsers.bind(this);
        this.removeSelectedIndicator = this.removeSelectedIndicator.bind(this);


		configConsts.socket.on('refresh users', (users) => {
			this.refreshUsers(users);
	    });

		configConsts.socket.on('refresh messages', (conversation) => {
			let url = configConsts.chatServerDomain + 'messages/getMessagesInChannel?&channelId='+conversation;
			return fetch(url, {
			  method: 'GET',
			  headers: {
			    'Authorization': this.props.authToken,
			    'Content-Type': 'application/json'
			  }
			})
			.then((response) => response.json())
			.then((responseJson) => {

				this.props.pullMsgs(responseJson);
	      	})
			.catch((error) => {
				console.log(error);
				console.error(error);
			});
	    });

		configConsts.socket.on('signal message', (usersIdsInChannel, senderId) => {

			const currentUser = decode(this.props.authToken);
			for (let i = 0; i < usersIdsInChannel.length; i++){

				if(currentUser._id == usersIdsInChannel[i]){
					let msgFromUserFlag = findDOMNode(this.userRef.userList).getElementsByClassName('list-group-item channel_'+senderId);
					msgFromUserFlag[0].style.backgroundColor = configConsts.incomingMessage;
					this.alertSound.play();
				}
			}
		});

		configConsts.socket.on('refresh groups', () => {
			this.getGroupChannels();
		});
	}

	async componentWillMount(){
		if (!this.props.checkIfLoggedIn()){
			this.props.history.push('/');
		}

		var userUrl = configConsts.chatServerDomain + 'users';

		try{
			await this.getGroupChannels();

			const resUser =	await fetch(userUrl, {
					  method: 'GET',
					  headers: {
					    'Authorization': this.props.authToken,
					    'Content-Type': 'application/json'
					  }
					});

			let theUsers = await resUser.json().then((responseJson) => {
						
				let testRun = this.getUserRelatedChannels(responseJson);
	      	});
		} catch(error) {
			console.log(error);
			console.error(error);
		}
	}	

	async getUserRelatedChannels(otherUsers){

		var associatedChannelsUrl = configConsts.chatServerDomain + 'channel';

		const userChannels = await fetch(associatedChannelsUrl, {
				  method: 'GET',
				  headers: {
				    'Authorization': this.props.authToken,
				    'Content-Type': 'application/json'
				  }
				});

		let options = [];
		let msgCountRecords = [];
		const currentUser = decode(this.props.authToken);
		let testRun = await userChannels.json().then((channelsJson) => {
			for(let key in otherUsers){
				let umcs = otherUsers[key].userMsgCount;
				for(let umcKey in umcs){
					if(umcs[umcKey].recipient == currentUser._id){

						msgCountRecords.push(umcs[umcKey]);
					}
				}
				options.push(otherUsers[key].email);
			}
			this.props.loadUsersAndSuggestions(otherUsers, msgCountRecords, options);
		});
	}

	refreshUsers(users){
		if (this.props.checkIfLoggedIn()){
			this.props.loadUsers(users);
		}
	}

	removeSelectedIndicator(isolatedRef){

		let listItems = findDOMNode(isolatedRef).getElementsByClassName('list-group-item');
		for( let i = 0 ; i < listItems.length; i++){
			listItems[i].style = 'white';
		}
	}

	async getGroupChannels(){
		const url = configConsts.chatServerDomain + 'channels/getGroupChannels';
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
				groups.push(responseJson[key]);
			}

			this.props.pullGroups(groups);
      	});
	}

	logoutAndRedirect(){
		const loggedOutUserData = decode(this.props.authToken);
		configConsts.socket.off('refresh users');
		configConsts.socket.off('refresh messages');
		configConsts.socket.off('signal message');
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
		configConsts.socket.emit('new group');
		this.props.pullGroups(groupChannels);
		this.onCloseModal();
	}

	async selectChannel(event, userid, email, msgCountId){

		event.preventDefault();	
		let targetClass = event.target;
		this.removeSelectedIndicator(this.userRef);
		this.removeSelectedIndicator(this.groupRef);

		event.currentTarget.style.backgroundColor = configConsts.selectedUser;

  		var channelUsers = '&message_user_ids='+userid;
  		var channelType = '&singular=true';
  		var channelName = '&channelName='+email;
  		var requestUrl = configConsts.chatServerDomain + 'channels/getChannel?'+channelUsers+channelType+channelName;
  		var msgCountResetUrl = configConsts.chatServerDomain + 'messages/resetMessageCount';
		var self = this;
		let t = this.props.authToken;
		return fetch(requestUrl, {
		  method: 'GET',
		  headers: {
		    'Authorization': this.props.authToken,
		    'Content-Type': 'application/json'
		  }
		})
		.then((response) => response.json())
		.then((responseJson) => {

			if(!self.isEmptyObject(self.props.channel)){
				configConsts.socket.emit('leave conversation', self.props.channel);
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

			let chId = responseJson._id;
			let msgList = responseJson.messages;
			let testCapture = fetch(msgCountResetUrl, {
			  method: 'POST',
			  headers: {
			    'Authorization': t,
			    'Content-Type': 'application/json'
			  },
				body: JSON.stringify({
					msgCountId: msgCountId,
				})
			})
			.then((response) => {

				let userUrl = configConsts.chatServerDomain + 'users';

				const resUser =	fetch(userUrl, {
					  method: 'GET',
					  headers: {
					    'Authorization': this.props.authToken,
					    'Content-Type': 'application/json'
					  }
					}).then((response) => response.json())
					.then((otherUsers) => {

						let associatedChannelsUrl = configConsts.chatServerDomain + 'channel';

						const userChannels = fetch(associatedChannelsUrl, {
							  method: 'GET',
							  headers: {
							    'Authorization': this.props.authToken,
							    'Content-Type': 'application/json'
							  }
							}).then((response) => response.json())
							.then((channelsJson) => {

								let options = [];
								let msgCountRecords = [];
								const currentUser = decode(this.props.authToken);

								for(let key in otherUsers){
									let umcs = otherUsers[key].userMsgCount;
									for(let umcKey in umcs){
										if(umcs[umcKey].recipient == currentUser._id){

											msgCountRecords.push(umcs[umcKey]);
										}
									}
									options.push(otherUsers[key].email);
								}
								console.log(msgCountRecords);
								this.props.loadUsersAndSuggestions(otherUsers, msgCountRecords, options);
								console.log('this tier X');
							});
							console.log('this tier Y');
						self.props.channelSelect(chId, msgList, directedTo);

			      	});
			});
      	})
		.catch((error) => {
			console.log(error);
		});
	}

	selectGroupChannel(event, groupChannelId, groupName){
		let url = configConsts.chatServerDomain + 'messages/getMessagesInChannel?&channelId='+groupChannelId;
		var self = this;

		this.removeSelectedIndicator(this.userRef);
		this.removeSelectedIndicator(this.groupRef);
		
		event.currentTarget.style.backgroundColor = configConsts.selectedUser;
		return fetch(url, {
		  method: 'GET',
		  headers: {
		    'Authorization': this.props.authToken,
		    'Content-Type': 'application/json'
		  }
		})
		.then((response) => response.json())
		.then((responseJson) => {
			if(!self.isEmptyObject(self.props.channel)){
				configConsts.socket.emit('leave conversation', self.props.channel[0]._id);
			}
			configConsts.socket.emit('enter conversation', groupChannelId);

			this.props.channelSelect(groupChannelId, responseJson, groupName);
      	})
		.catch((error) => {
			console.log(error);
			console.error(error);
		});
	}

	onOpenModal(){
    	this.props.setModal(true);
  	};
 
	onCloseModal(){
    	this.props.setModal(false);
	};

	handleDelete(i) {
        let tags = this.state.tags;
        tags.splice(i, 1);
    	this.props.loadTags(tags);
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
    	this.props.loadTags(tags);
    }
 
    handleDrag(tag, currPos, newPos) {
        let tags = this.state.tags;
 
        // mutate array 
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);
 
        // re-render 
    	this.props.loadTags(tags);
    }
 
    handleCreateGroup(event) {

		event.preventDefault();
    	let userIds=[];
		let channelName = event.target.groupName.value;


		for (let key in this.props.tags){
			userIds.push(this.props.tags[key].id);
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

		if(!this.isEmptyObject(this.props.channel)){
			return (
				<Container className="container-fluid">
					<Row>
						<Col xs="2" className="text-center">
							<Button color="primary" onClick={this.onOpenModal}>Create Group:</Button>
						</Col>
						<Col xs="9">
						</Col>
						<Col xs="1">
							{logoutButton}
						</Col>
					</Row>
					<Row>
						<Col xs="3">
							<h2 className="text-center">Groups</h2>
							<ListOfGroups
							 groups={this.props.groups}
							 authToken={this.props.authToken}
							 tags={this.props.tags}
							 suggestions={this.props.suggestions}
							 selectGroupChannel={this.selectGroupChannel}
							 addGroupChannel={this.addGroupChannel}
							 handleCreateGroup={this.handleCreateGroup}
							 onOpenModal={this.onOpenModal}
							 onCloseModal={this.onCloseModal}
							 handleDelete={this.handleDelete}
							 handleAddition={this.handleAddition}
							 handleDrag={this.handleDrag}
							 open={this.props.open}
							 ref={(ref) => this.groupRef = ref}
							/>
							<h2 className="text-center">Users</h2>
							<ListOfUsers
							 users={this.props.users}
							 msgCounts={this.props.msgCounts}
							 authToken={this.props.authToken}
							 selectChannel={this.selectChannel}
							 ref={(ref) => this.userRef = ref}

							/>
						</Col>
						<Col xs="9">
							<Channel authToken={this.props.authToken} channelId={this.props.channel}  channelName={this.props.channelName} messages={this.props.messages} />
						</Col>
					</Row>
			        <NotificationSystem ref="notificationSystem" />
			        <audio ref={(ref) =>  this.alertSound = ref }>
						<source src={configConsts.alertTone} type="audio/mpeg" >
						</source>
					</audio>
				</Container>
			); 
		} else {
			return (
				<Container className="container-fluid">
					<Row>
						<Col xs="2" className="text-center">
							<Button color="primary" onClick={this.onOpenModal}>Create Group:</Button>
						</Col>
						<Col xs="9">
						</Col>
						<Col xs="1">
							{logoutButton}
						</Col>
					</Row>
					<Row>
						<Col xs="3">
							<h2 className="text-center">Groups</h2>
							<ListOfGroups
							 groups={this.props.groups}
							 authToken={this.props.authToken}
							 tags={this.props.tags}
							 suggestions={this.props.suggestions}
							 selectGroupChannel={this.selectGroupChannel}
							 addGroupChannel={this.addGroupChannel}
							 handleCreateGroup={this.handleCreateGroup}
							 onOpenModal={this.onOpenModal}
							 onCloseModal={this.onCloseModal}
							 handleDelete={this.handleDelete}
							 handleAddition={this.handleAddition}
							 handleDrag={this.handleDrag}
							 open={this.props.open}
							 ref={(ref) => this.groupRef = ref}
							/>
							<h2 className="text-center">Users</h2>
							<ListOfUsers
							 users={this.props.users}
							 msgCounts={this.props.msgCounts}
							 authToken={this.props.authToken}
							 selectChannel={this.selectChannel}
							 ref={(ref) => this.userRef = ref}

							/>
						</Col>
						<Col xs="9">
						</Col>
					</Row>
			        <NotificationSystem ref="notificationSystem" />
			        <audio ref={(ref) =>  this.alertSound = ref }>
						<source src={configConsts.alertTone} type="audio/mpeg" >
						</source>
					</audio>
				</Container>
			);
		}
	}
}

const mapStateToProps = (state) => {
    return {
        channel: state.conversationDashboard.channel,
        messages: state.conversationDashboard.messages,
        msgCounts: state.conversationDashboard.msgCounts,
        channelName: state.conversationDashboard.channelName,
        groups: state.conversationDashboard.groups,
        open: state.conversationDashboard.open,
        users: state.conversationDashboard.users,
        tags: state.conversationDashboard.tags
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        channelSelect: (channel, messages, channelName) => dispatch(channelPicked(channel, messages, channelName)),
        pullMsgs: (msgs) => dispatch(establishMsgs(msgs)),
        pullGroups: (groups) => dispatch(retrieveGroupChannels(groups)),
        setModal: (status) => dispatch(setModalOpenStatus(status)),
        loadUsers: (users) => dispatch(reloadUsers(users)),
        loadTags: (tags) => dispatch(establishTags(tags)),
        loadUsersAndSuggestions: (users, msgCounts, suggestions) => dispatch(setUsersAndSuggestions(users, msgCounts, suggestions)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConversationPanel);