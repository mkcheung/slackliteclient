import React from 'react';

const Logout = (props) => {
	return(
		<button onClick={props.logoutAndRedirect}>Logout</button>
	);
}

export default Logout;