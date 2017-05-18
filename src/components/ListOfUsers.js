import React from 'react';
import ReactDOM from 'react-dom';
import User from './User';
import 'whatwg-fetch';

class ListOfUsers extends React.Component{

	constructor(){
		super();
		this.state={
			users:[]
		};
	}

	componentWillMount(){
		var url = 'http://localhost:8000/users';

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
				users:responseJson.users
			});
      	})
		.catch((error) => {
			console.log(error);
			console.error(error);
		});
	}

	render(){
		return(
			<ul>
				{
					Object
					.keys(this.state.users)
					.map(key => <User key={key} index={key} details={this.state.users[key]}/>)
				}
			</ul>
		)
	}
}

export default ListOfUsers;