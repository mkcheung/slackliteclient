import React from 'react';
import 'whatwg-fetch';
import { Route, Redirect }  from 'react-router';
import Modal from 'react-responsive-modal';
import ConversationPanel from './ConversationPanel';
import 'react-responsive-modal/lib/react-responsive-modal.css';
import * as configConsts from '../config/config';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Form, FormGroup, Label, Input } from 'reactstrap';
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

class Login extends React.Component {
	constructor(){
		super();
		this.state={
			open: false,
			isOpen: false
		}
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
		this.notificationSystem = this.refs.notificationSystem;
	}

	onOpenModal(){
    	this.setState({ open: true });
  	};
 
	onCloseModal(){
		this.setState({ open: false });
	};

	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}

	render(){
		const { open } = this.state;
		return(
			<div className="container-fluid">
				<Navbar color="faded" light expand="md">
				<NavbarBrand href="/">MultiChat</NavbarBrand>
				<NavbarToggler onClick={this.toggle} />
					<Collapse isOpen={this.state.isOpen} navbar>
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
							<Modal open={open} onClose={this.onCloseModal} little>
							<h2>New User Registration</h2>
								<form onSubmit={this.handleRegisterSubmit}>
									<br/>
									<div className="form-group">
										<label>First Name</label>
										<input name="firstName" type="text" />
										<br/>
										<label>Last Name</label>
										<input name="lastName" type="text" />
										<br/>
										<label>Email</label>
										<input name="email" type="text" />
										<br/>
										<label>Password</label>
										<input type="password" name="password" />
										<br/>
										<input type="submit" className="btn btn-primary"/>
									</div>
								</form>
							</Modal>
							<NotificationSystem ref="notificationSystem" />
						</Nav>
					</Collapse>
				</Navbar>
			</div>
		);
	}

	handleSubmit(event){
		event.preventDefault();
		var email = event.target.email.value;
		var password = event.target.password.value;
		var url = configConsts.chatServerDomain + 'token';
		return fetch(url, {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
		    email: email,
		    password: password,
		  })
		})
		.then((response) => response.json())
		.then((responseJson) => {
			this.props.setAuthentication('JWT '+responseJson.token);

			configConsts.socket.connect();
			configConsts.socket.emit('loggedIn', responseJson.userid);
			this.props.history.push('/conversations');
      	})
		.catch((error) => {
			console.log(error);
			console.error(error);
		});
	}

	handleRegisterSubmit(event){
		event.preventDefault();
		var firstName = event.target.firstName.value;
		var lastName = event.target.lastName.value;
		var email = event.target.email.value;
		var password = event.target.password.value;
		var url = configConsts.chatServerDomain + 'users';
		return fetch(url, {
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
			})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);
				if(typeof responseJson.errmsg != "undefined"){
					this.notificationSystem.addNotification({
					  message: "User could not be registered. Please try again.",
					  level: 'error'
					});

				} else {
					this.notificationSystem.addNotification({
					  message: "New User Registered",
					  level: 'success'
					});
				}
				this.onCloseModal();
			})
			.catch((error) => {
				console.log(error);
				console.error(error);
		});
	}
}

export default Login;