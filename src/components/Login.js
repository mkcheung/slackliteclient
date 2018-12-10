import React, { Component } from 'react';
import 'whatwg-fetch';
import { Route, Redirect }  from 'react-router';
import 'react-responsive-modal/lib/react-responsive-modal.css';
import Modal from 'react-responsive-modal';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Form, FormGroup, Label, Input } from 'reactstrap';
var NotificationSystem = require('react-notification-system');
import { connect } from 'react-redux';

import ConversationPanel from './ConversationPanel';
import * as configConsts from '../config/config';
import { openRegistrationModal, setIsModalOpenStatus } from '../actions/login';

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

class Login extends Component {
	constructor(){
		super();

		this.notificationSystem= null,
		this.handleSubmit=this.handleSubmit.bind(this);
		this.handleRegisterSubmit=this.handleRegisterSubmit.bind(this);
		this.onOpenModal=this.onOpenModal.bind(this);
		this.onCloseModal=this.onCloseModal.bind(this);
		this.toggle = this.toggle.bind(this);
	}

	componentWillMount(){
		if (this.props.checkIfLoggedIn()){
			this.props.history.push('/conversations');
		}
	}

	componentDidMount() {
		this.notificationSystem = this.notifSys;
	}

	onOpenModal(){
		this.props.openRegModal(true);
  	};
 
	onCloseModal(){
		this.props.openRegModal(false);
	};

	toggle() {
		this.props.toggleModalOnOff(this.props.isOpen);
	}

	render(){
		return(
			<div className="container-fluid">
				<Navbar color="faded" light expand="md">
				<NavbarBrand href="/">MultiChat</NavbarBrand>
				<NavbarToggler onClick={this.toggle} />
					<Collapse isOpen={this.props.isOpen} navbar>
						<Nav className="ml-auto" navbar>
 							<Form inline onSubmit={this.handleSubmit}>
								<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
									<Label className="mr-sm-2">Email:</Label>
									<Input name="email" type="text" />
								</FormGroup>
								<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
									<Label className="mr-sm-2">Password:</Label>
									<Input type="password" name="password" />
								</FormGroup>
								<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
									<Button color="primary" className="btn btn-primary mr-sm-2">Submit</Button>
									<Button color="primary" onClick={this.onOpenModal}>Register User</Button>
								</FormGroup>
							</Form>
							<Modal open={this.props.open} onClose={this.onCloseModal}>
							<h2>New User Registration</h2>

 								<Form onSubmit={this.handleRegisterSubmit}>
									<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
										<Label className="mr-sm-2">First Name: </Label>
										<Input name="firstName" type="text" />
									</FormGroup>
									<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
										<Label className="mr-sm-2">Last Name: </Label>
										<Input name="lastName" type="text" />
									</FormGroup>
									<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
										<Label className="mr-sm-2">Email: </Label>
										<Input name="email" type="text" />
									</FormGroup>
									<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
										<Label className="mr-sm-2">Password: </Label>
										<Input name="password" type="text" />
									</FormGroup>
									<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
										<Button color="primary" className="btn btn-primary mr-sm-2">Submit</Button>
									</FormGroup>
								</Form>
							</Modal>
							<NotificationSystem ref={(ref) => this.notifSys = ref} />
						</Nav>
					</Collapse>
				</Navbar>
			</div>
		);
	}

	async handleSubmit(event){
		event.preventDefault();
		var email = event.target.email.value;
		var password = event.target.password.value;
		let loginUrl = configConsts.chatServerDomain + 'token';

		try {
			const loginRes = await fetch(loginUrl, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: email,
					password: password,
				})
			});

			if(!loginRes.ok){
				await loginRes.json().then((responseJson) => {
					throw new Error(responseJson.message);
				});
			}

			let loginStat = await loginRes.json().then((responseJson) => {

				this.props.setAuthentication('JWT '+responseJson.token);
				configConsts.socket.connect();
				configConsts.socket.emit('loggedIn', responseJson.userid);
				this.props.history.push('/conversations');
	      	});
		} catch(error) {
			this.notificationSystem.addNotification({
				message: error.message,
				level: 'error'
			});
		}
	}

	async handleRegisterSubmit(event){
		event.preventDefault();
		var firstName = event.target.firstName.value;
		var lastName = event.target.lastName.value;
		var email = event.target.email.value;
		var password = event.target.password.value;
		var regUserUrl = configConsts.chatServerDomain + 'users';

		try {

			const regUser = await fetch(regUserUrl, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					firstName: firstName,
					lastName: lastName,
					email: email,
					password: password
				})
			});

			if(!regUser.ok){
				await regUser.json().then((responseJson) => {
					this.onCloseModal();
					throw new Error(responseJson.message);
				});
			}

			let regUserResult = await regUser.json().then((responseJson) => {

				this.onCloseModal();
				this.notificationSystem.addNotification({
					message: "New User Registered",
					level: 'success'
				});
	      	});

		} catch (error) {
			this.notificationSystem.addNotification({
				message: error.toString(),
				level: 'error'
			});
		}
	}
}

const mapStateToProps = (state) => {
    return {
        open: state.login.open,
        isOpen: state.login.isOpen,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        openRegModal: (open) => dispatch(openRegistrationModal(open)),
        toggleModalOnOff: (isOpen) => dispatch(setIsModalOpenStatus(isOpen)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);