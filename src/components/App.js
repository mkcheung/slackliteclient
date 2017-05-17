import React, { Component } from 'react';
import Login from './Login';
import Users from './Users';
import ConversationPanel from './ConversationPanel';
import NotFound from './NotFound';
import { BrowserRouter, Redirect, Route, Link, Switch, browserHistory, withRouter  } from 'react-router-dom';
import { isTokenExpired, getTokenExpirationDate } from '../util/AuthServices';
// import { renderMergedProps, PropsRoute } from '../util/RouteMethods';

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }}/>
  );
}

class App extends Component {

  constructor(){
    super()
    this.setAuthentication = this.setAuthentication.bind(this);
    this.checkIfLoggedIn = this.checkIfLoggedIn.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      isLoggedIn:false,
      authToken:null
    };
  }

  setAuthentication(authToken) {
    this.setState({
      isLoggedIn:true,
      authToken:authToken
    });
  }

  logout() {
    this.setState({
      isLoggedIn:null,
      authToken:null
    });
    // return(
    //   <Redirect to={'/'}/>
    // );
    // this.props.history.push('/');
  }

  checkIfLoggedIn(){
    if(isTokenExpired(this.state.authToken)){
      this.setState({
        isLoggedIn:false,
        authToken:null
      });
      return false;
    } else{
      return true;
    }
  }

  render() {
        return (
          <div>
            <Switch>
              <PropsRoute 
                exact 
                path='/' 
                component={Login} 
                authToken={this.state.authToken}
                setAuthentication={this.setAuthentication}
                checkIfLoggedIn={this.checkIfLoggedIn}
              />
              <PropsRoute 
                path='/conversations' 
                component={ConversationPanel} 
                authToken={this.state.authToken}
                checkIfLoggedIn={this.checkIfLoggedIn}
                logout={this.logout}
              />
              <Route component={NotFound}/>
            </Switch>
          </div>
        );
  }
}

export default withRouter(App);
