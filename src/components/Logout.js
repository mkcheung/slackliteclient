import React from 'react';
import { Button } from 'reactstrap';

const Logout = (props) => {
	return(
		<Button color="primary" onClick={props.logoutAndRedirect}>Logout</Button>

	);
}

export default Logout;