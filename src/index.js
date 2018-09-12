import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Login from './components/Login';
import NotFound from './components/NotFound';
import ConversationPanel from './components/ConversationPanel';
import { BrowserRouter, Redirect, Route, Link, Switch, browserHistory  } from 'react-router-dom';
import { isLoggedIn } from './util/AuthServices';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

let initialState = {
	textInput:''
};

const store = configureStore(initialState); // You can also pass in an initialState here

const Root = () => {
	return(
	    <Provider store={store}>
			<BrowserRouter history={browserHistory}>
				<App />
			</BrowserRouter>
	    </Provider>
	)
}

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);
