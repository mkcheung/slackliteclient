import React from 'react';
import ReactDOM from 'react-dom';
import User from './User';
import 'whatwg-fetch';
import { WithContext as ReactTags } from 'react-tag-input';
import Modal from 'react-responsive-modal';

class ListOfUsers extends React.Component{

	constructor(){
		super();
		this.state={
			users:[],
			suggestions:[],
            tags:[],
            open:false
		};
		this.onOpenModal=this.onOpenModal.bind(this);
		this.onCloseModal=this.onCloseModal.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleCreateGroup = this.handleCreateGroup.bind(this);
	}

	componentWillMount(){
		var url = 'http://localhost:3000/users';

		return fetch(url, {
		  method: 'GET',
		  headers: {
		    'Authorization': this.props.authToken,
		    'Content-Type': 'application/json'
		  }
		})
		.then((response) => response.json())
		.then((responseJson) => {
			let options = [];
			for(let key in responseJson){
				options.push(responseJson[key].email);
			}
			this.setState({
				users:responseJson,
				suggestions:options
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
		var url = 'http://localhost:3000/channel';
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
			this.props.addGroupChannel(responseJson);
      	})
		.catch((error) => {
			console.log(error);
		});
    }

	render(){
		const { tags, suggestions } = this.state;
		const { open } = this.state;
		return(
			<div>
				<button onClick={this.onOpenModal}>Create Group:</button>
				<ul>
					{
						Object
						.keys(this.state.users)
						.map(key => <User key={key} index={key} selectChannel={this.props.selectChannel} details={this.state.users[key]}/>)
					}
				</ul>
				<Modal open={open} onClose={this.onCloseModal} little>
					<h2>Create Group Channel</h2>
					<form onSubmit={this.handleCreateGroup}>
						<br/>
						<div className="form-group">
							<label>Group Name</label>
							<input name="groupName" type="text" />
							<br/>
							<div>
				                <ReactTags tags={tags}
				                    suggestions={suggestions}
				                    handleDelete={this.handleDelete}
				                    handleAddition={this.handleAddition}
				                    handleDrag={this.handleDrag} />
            				</div>
							<input type="submit" className="btn btn-primary"/>
						</div>
					</form>
				</Modal>
			</div>
		)
	}
}

export default ListOfUsers;