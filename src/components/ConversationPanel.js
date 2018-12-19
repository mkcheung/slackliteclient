import decode from 'jwt-decode';
import React, { Component } from 'react';
import axios from 'axios';
import { findDOMNode }  from 'react-dom';
import { withRouter } from 'react-router-dom';
import { Route, Redirect, browserHistory }  from 'react-router';
import { Container, Row, Col, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { connect } from 'react-redux';

import Channel from './Channel';
import Login from './Login';
import Logout from './Logout';
import ListOfUsers from './ListOfUsers';
import ListOfGroups from './ListOfGroups';
import 'react-responsive-modal/lib/react-responsive-modal.css';
import * as configConsts from '../config/config';
import { channelPicked, establishMsgs, retrieveGroupChannels, setModalOpenStatus, reloadUsers, establishTags, setUsersAndSuggestions, setUsersSuggestionsChannel } from '../actions/conversationDashboard';

var NotificationSystem = require('react-notification-system');

class ConversationPanel extends Component{

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
        this.selectedUser = null;

		configConsts.socket.on('refresh users', (users) => {
			const currentUser = decode(this.props.authToken);
			this.refreshUsers(users, currentUser._id);
	    });

		configConsts.socket.on('refresh messages', async (conversation, senderId) => {
			const url = configConsts.chatServerDomain + 'messages/getMessagesInChannel?&channelId='+conversation;
			const msgCountResetUrl = configConsts.chatServerDomain + 'messages/resetMessageCount';
			const currentUser = decode(this.props.authToken);

  			try {
				const msgsInChannelResponse = await axios.get(url, 
					{ 'headers': {
						'Authorization': this.props.authToken,
						'Content-Type': 'application/json'
					}
				});

				const msgsInChannel = msgsInChannelResponse.data;

				//ensure that, if the current channel is selected, if the current user(recipient) receives a new
				//message, the count remains set to zero.
				if(this.props.channel == conversation && senderId != currentUser._id) {

					const msgsResponseData = await axios.post(msgCountResetUrl, 
						{
							channelId: conversation,
							recipientId:currentUser._id,
						},
						{ 
							'headers': {
								'Authorization': this.props.authToken,
								'Content-Type': 'application/json'
							}
						}
					);

					this.props.pullMsgs(msgsInChannel);

				} 
				else {

					this.props.pullMsgs(msgsInChannel);
				}
			} catch(error) {
				console.log(error);
				console.error(error);
			}
	    });

		configConsts.socket.on('signal message', (usersIdsInChannel, senderId) => {

			const currentUser = decode(this.props.authToken);
			const userList = this.userRef.userList;
			const alertSound = this.alertSound;

			const sample = usersIdsInChannel.map(function(userIdInChannel){

				if(currentUser._id == userIdInChannel){
					let msgFromUserFlag = findDOMNode(userList).getElementsByClassName('list-group-item channel_'+senderId);
					msgFromUserFlag[0].style.backgroundColor = configConsts.incomingMessage;
					alertSound.play();
				}
			});
		});

		configConsts.socket.on('refresh groups', () => {
			this.getGroupChannels();
		});
	}

	async componentDidMount(){
		if (!this.props.checkIfLoggedIn()){
			this.props.history.push('/');
		}

		const userUrl = configConsts.chatServerDomain + 'users';
		const msgCountsUrl = configConsts.chatServerDomain + 'msgCount';

		try{
			await this.getGroupChannels();

			const resUser = await axios.get(userUrl, 
				{ 
					'headers': 
					{
						'Authorization': this.props.authToken,
						'Content-Type': 'application/json'
					}
				}
			);

			const msgCountsData = await axios.get(msgCountsUrl, 
				{ 
					'headers': 
					{
						'Authorization': this.props.authToken,
						'Content-Type': 'application/json'
					}
				}
			);
			const msgCounts = msgCountsData.data;
			const users = resUser.data;

			this.getUserRelatedChannels(users, msgCounts);

		} catch(error) {
			console.log(error);
			console.error(error);
		}
	}	

	async getUserRelatedChannels(otherUsers, msgCounts){

		var associatedChannelsUrl = configConsts.chatServerDomain + 'channel';

		let options = [];
		let msgCountRecords = [];
		const currentUser = decode(this.props.authToken);

		const resMsgCountRes = msgCounts.map(function(msgCount){

			if(msgCount.recipient == currentUser._id){
				msgCountRecords.push(msgCount);
			}
		});

		const resOtherUsers = otherUsers.map(function(otherUser){

			options.push(otherUser.email);
		});

		this.props.loadUsersAndSuggestions(otherUsers, msgCountRecords, options);
	}

	async refreshUsers(users, currentUserId){

		if (this.props.checkIfLoggedIn()){

			let options = [];
			let msgCountRecords = [];


			const msgCountsUrl = configConsts.chatServerDomain + 'msgCount';

			try {

				const msgCountsData = await axios.get(msgCountsUrl, 
					{ 
						'headers': 
						{
							'Authorization': this.props.authToken,
							'Content-Type': 'application/json'
						}
					}
				);

				const msgCounts = msgCountsData.data;
				const presentChannel = this.props.channel;
				
				const resMsgCountRes = msgCounts.map(function(msgCount){

					if(msgCount.recipient == currentUserId && presentChannel == msgCount.channel){
						msgCount.messageCount = 0;
						msgCountRecords.push(msgCount);
					} else if(msgCount.recipient == currentUserId){
						msgCountRecords.push(msgCount);
					}
				});

				const resUsers = users.map(function(user){

					options.push(user.email);
				});

				this.props.loadUsersAndSuggestions(users, msgCountRecords, options);

			} catch (error) {
				console.log(error);
				console.error(error);
			}
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

		const groupChannelsResponse = await axios.get(url, 
			{ 
				'headers': 
				{
					'Authorization': this.props.authToken,
					'Content-Type': 'application/json'
				}
			}
		);

		const groupChannels = groupChannelsResponse.data;
		const groups = [];
		for(let key in groupChannels){
			groups.push(groupChannels[key]);
		}

		this.props.pullGroups(groups);
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

  		const channelUsers = '&message_user_ids='+userid;
  		const channelType = '&singular=true';
  		const channelName = '&channelName='+email;
  		const requestUrl = configConsts.chatServerDomain + 'channels/getChannel?'+channelUsers+channelType+channelName;
  		const msgCountResetUrl = configConsts.chatServerDomain + 'messages/resetMessageCount';
		const userUrl = configConsts.chatServerDomain + 'users';
		const associatedChannelsUrl = configConsts.chatServerDomain + 'channel';
		const self = this;

		try {

			const channelResponse = await axios.get(requestUrl, 
				{ 
					'headers': 
					{
						'Authorization': this.props.authToken,
						'Content-Type': 'application/json'
					}
				}
			);

			const channel = channelResponse.data;

			if(!self.isEmptyObject(self.props.channel)){
				configConsts.socket.emit('leave conversation', self.props.channel);
			}
			configConsts.socket.emit('enter conversation', channel._id);

			let directedTo = null;
			const usersInChannel = channel.channelUsers;
			for(let key in usersInChannel){
				if(usersInChannel[key]._id === userid){
					directedTo = usersInChannel[key].firstName + ' ' + usersInChannel[key].lastName;
					break;
				}
			}
			const chId = channel._id;
			const msgList = channel.messages;

			const msgsResponseData = await axios.post(msgCountResetUrl, 
				{
					msgCountId: msgCountId,
				},
				{ 
					'headers': {
						'Authorization': this.props.authToken,
						'Content-Type': 'application/json'
					}
				}
			);

			const resUser = await axios.get(userUrl, 
				{ 
					'headers': 
					{
						'Authorization': this.props.authToken,
						'Content-Type': 'application/json'
					}
				}
			);

			const users = resUser.data;

			const userChannelResults = await axios.get(associatedChannelsUrl, 
				{ 
					'headers': 
					{
						'Authorization': this.props.authToken,
						'Content-Type': 'application/json'
					}
				}
			);

			const userChannels = userChannelResults.data;

			let options = [];
			let msgCountRecords = [];
			const currentUser = decode(this.props.authToken);

			for(let key in users){
				let umcs = users[key].userMsgCount;
				for(let umcKey in umcs){
					if(umcs[umcKey].recipient == currentUser._id){

						msgCountRecords.push(umcs[umcKey]);
					}
				}
				options.push(users[key].email);
			}

			this.props.loadChannel(users, msgCountRecords, options, chId, msgList, directedTo)

		} catch(error) {
			console.log(error);
			console.error(error);
		}
	}

	async selectGroupChannel(event, groupChannelId, groupName){
		const url = configConsts.chatServerDomain + 'messages/getMessagesInChannel?&channelId='+groupChannelId;
		var self = this;

		this.removeSelectedIndicator(this.userRef);
		this.removeSelectedIndicator(this.groupRef);
		
		event.currentTarget.style.backgroundColor = configConsts.selectedUser;


		try {

			const msgsInChannelResults = await axios.get(url, 
				{ 
					'headers': 
					{
						'Authorization': this.props.authToken,
						'Content-Type': 'application/json'
					}
				}
			);

			const msgsInChannel = msgsInChannelResults.data;

			if(!self.isEmptyObject(self.props.channel)){
				configConsts.socket.emit('leave conversation', self.props.channel[0]._id);
			}
			configConsts.socket.emit('enter conversation', groupChannelId);

			this.props.channelSelect(groupChannelId, msgsInChannel, groupName);

		} catch (error){
			console.log(error);
			console.error(error);
		}
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
 
    async handleCreateGroup(event) {

		event.preventDefault();
    	const userIds=[];
		const channelName = event.target.groupName.value;
		const url = configConsts.chatServerDomain + 'channel';

		for (let key in this.props.tags){
			userIds.push(this.props.tags[key].id);
		}

		try {
			const newGroupData = await axios.post(url, 
				{
				    channelName: channelName,
				    channelUsers:userIds,
				    type:'group'
				},
				{ 
					'headers': {
						'Authorization': this.props.authToken,
						'Content-Type': 'application/json'
					}
				}
			);

			const newGroup = newGroupData.data;
			this.addGroupChannel(newGroup);
		} catch (error) {
			console.log(error);
			console.error(error);
		}
    }

	render(){
        let logoutButton = <Logout logoutAndRedirect={this.logoutAndRedirect}/>;

        if (this.props.users === undefined || this.props.users.length == 0) {
			return (
				<Container className="container-fluid">
					<Row>
						<Col xs="12">
							Loading....
						</Col>
					</Row>
				</Container>
				)
		} else if(!this.isEmptyObject(this.props.channel)){
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
        loadChannel: (users, msgCounts, suggestions, channel, messages, channelName) => dispatch(setUsersSuggestionsChannel(users, msgCounts, suggestions, channel, messages, channelName)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ConversationPanel));



