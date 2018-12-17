import React, { Component } from 'react';
import Login from './Login';
import Users from './Users';
import ConversationPanel from './ConversationPanel';
import NotFound from './NotFound';
import { BrowserRouter, Redirect, Route, Link, Switch, browserHistory, withRouter  } from 'react-router-dom';
import { isTokenExpired, getTokenExpirationDate } from '../util/AuthServices';
import { connect } from 'react-redux';
import { performLogin, performLogout } from '../actions/app';

class App extends Component {

  constructor(){
    super()
    this.setAuthentication = this.setAuthentication.bind(this);
    this.checkIfLoggedIn = this.checkIfLoggedIn.bind(this);
    this.logout = this.logout.bind(this);
  }

  setAuthentication(authToken) {
    this.props.toLogin(authToken);
  }

  logout() {
    this.props.toLogout();
  }

  checkIfLoggedIn(){
    if(isTokenExpired(this.props.authToken)){
      this.props.toLogout();
      return false;
    } else{
      return true;
    }
  }

  render() {
    return (
      <div>
        <Route exact path="/" render={(loginProps) => (<Login authToken={this.props.authToken} setAuthentication={this.setAuthentication} checkIfLoggedIn={this.checkIfLoggedIn}/>)}/>
        <Route exact path="/conversations" render={(convPanelProps) => (<ConversationPanel authToken={this.props.authToken} logout={this.logout} checkIfLoggedIn={this.checkIfLoggedIn}/>)}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.app.isLoggedIn,
        authToken: state.app.authToken,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        toLogin: (authToken) => dispatch(performLogin(authToken)),
        toLogout: () => dispatch(performLogout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
