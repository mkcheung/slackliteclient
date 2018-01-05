import React from 'react';
import 'whatwg-fetch';
import { Route, Redirect }  from 'react-router';
import Modal from 'react-responsive-modal';
import ConversationPanel from './ConversationPanel';

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
		}
		this.handleSubmit=this.handleSubmit.bind(this);
		this.handleRegisterSubmit=this.handleRegisterSubmit.bind(this);
		this.onOpenModal=this.onOpenModal.bind(this);
		this.onCloseModal=this.onCloseModal.bind(this);
	}

	componentWillMount(){
		if (this.props.checkIfLoggedIn()){
			this.props.history.push('/conversations');
		}
	}

	onOpenModal(){
    	this.setState({ open: true });
  	};
 
	onCloseModal(){
		this.setState({ open: false });
	};

	render(){
		const { open } = this.state;
		return(
				<div className="container-fluid">
					<div className="row">
						<form onSubmit={this.handleSubmit}>
							<br/>
							<div className="form-group">
								<label>Email</label>
								<input name="email" type="text" />
								<br/>
								<label>Password</label>
								<input type="password" name="password" />
								<br/>
								<input type="submit" className="btn btn-primary"/>
							</div>
						</form>
					</div>
					<button onClick={this.onOpenModal}>Open modal</button>
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
				</div>
		);
	}

	handleSubmit(event){
		event.preventDefault();
		var email = event.target.email.value;
		var password = event.target.password.value;
		var url = 'http://localhost:3000/token';
console.log(this);
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
			this.props.history.push('/conversations');
      	})
		.catch((error) => {
			console.log(error);
			console.error(error);
		});
	}

	handleRegisterSubmit(event){
		event.preventDefault();
		console.log(this);
		var self = this;
		var firstName = event.target.firstName.value;
		var lastName = event.target.lastName.value;
		var email = event.target.email.value;
		var password = event.target.password.value;
		var url = 'http://localhost:3000/users';
		console.log(event);
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
				this.onCloseModal();
			})
			.catch((error) => {
				console.log(error);
				console.error(error);
		});
	}
}

export default Login;