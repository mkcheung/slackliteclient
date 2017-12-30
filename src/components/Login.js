import React from 'react';
import 'whatwg-fetch';
import { Route, Redirect }  from 'react-router';
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
		this.handleSubmit=this.handleSubmit.bind(this);
	}

	componentWillMount(){
		if (this.props.checkIfLoggedIn()){
			this.props.history.push('/conversations');
		}
	}

	render(){
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
				</div>
		);
	}

	handleSubmit(event){
		event.preventDefault();
		var email = event.target.email.value;
		var password = event.target.password.value;
		var url = 'http://localhost:3000/token';

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
}

export default Login;