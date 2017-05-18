import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Login from './components/Login';
import NotFound from './components/NotFound';
import ConversationPanel from './components/ConversationPanel';
import { BrowserRouter, Redirect, Route, Link, Switch, browserHistory  } from 'react-router-dom';
import { isLoggedIn } from './util/AuthServices';
import './index.css';

const Root = () => {
	return(
		<BrowserRouter history={browserHistory}>
			<App />
		</BrowserRouter>
	)
}

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);
