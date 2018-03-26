import React from 'react';
import ReactDOM from 'react-dom';
import Group from './Group';
import 'whatwg-fetch';
import { WithContext as ReactTags } from 'react-tag-input';
import Modal from 'react-responsive-modal';

class ListofGroups extends React.Component{

	constructor(props){
		super(props);
	}


	render(){
		const { tags, suggestions, open, onOpenModal, onCloseModal } = this.props;
		return(
			<div>
				<ul ref={(ref) => this.groupList = ref}>
					{
						Object
						.keys(this.props.groups)
						.map(key => <Group key={key} authToken={this.props.authToken} index={key} selectGroupChannel={this.props.selectGroupChannel} details={this.props.groups[key]}/>)
					}
				</ul>
				<Modal open={open} onClose={onCloseModal} little>
					<h2>Create Group Channel</h2>
					<form onSubmit={this.props.handleCreateGroup}>
						<br/>
						<div className="form-group">
							<label>Group Name</label>
							<input name="groupName" type="text" />
							<br/>
							<div>
				                <ReactTags tags={tags}
				                    suggestions={suggestions}
				                    handleDelete={this.props.handleDelete}
				                    handleAddition={this.props.handleAddition}
				                    handleDrag={this.props.handleDrag} />
            				</div>
							<input type="submit" className="btn btn-primary"/>
						</div>
					</form>
				</Modal>
			</div>
		)
	}
}

export default ListofGroups;