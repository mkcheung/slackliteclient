import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Login from './components/Login';
import NotFound from './components/NotFound';
import Users from './components/Users';
import ConversationPanel from './components/ConversationPanel';
import { BrowserRouter, Route, Link, Switch, browserHistory  } from 'react-router-dom';
import './index.css';

const Root = () => {
	return(
		<BrowserRouter>
			<div>
				<ul>
					<li><Link to="/">Home</Link></li>
					<li><Link to="/conversations">Conversation</Link></li>
					<li><Link to="/users">Users</Link></li>
				</ul>

				<Switch>
					<Route exact path="/" component={Login}/>
					<Route path="/conversations" component={ConversationPanel} />
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
