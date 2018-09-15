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
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

const store = createStore(rootReducer, applyMiddleware(thunk));

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
