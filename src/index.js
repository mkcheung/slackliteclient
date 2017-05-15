import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import NotFound from './components/NotFound';
import Users from './components/Users';
import ConversationPanel from './components/ConversationPanel';
import { BrowserRouter, Route, Link, Switch  } from 'react-router-dom';
import './index.css';

const Root = () => {
	return(
		<BrowserRouter>
			<div>
				<ul>
					<li><Link to="/">Conversation</Link></li>
					<li><Link to="/users">Users</Link></li>
				</ul>

				<Switch>
					<Route exact path="/" component={ConversationPanel} />
					<Route path="/users" component={Users} /> 
					<Route component={NotFound}/>
				</Switch>
			</div>
		</BrowserRouter>
	)
}

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);
