import React from 'react';

class Login extends React.Component {
	render(){
		return(
			<div className="container-fluid">
				<div className="row">
					<form>
						<div className="form-group">
							<input name="username" />
							<input type="password" name="password" />
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default Login;