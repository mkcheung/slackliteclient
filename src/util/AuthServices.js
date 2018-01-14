import decode from 'jwt-decode';
import { BrowserRouter, Route, Link, Switch, browserHistory  } from 'react-router-dom';

export function login() {
  browserHistory.push('/login');
}

function getTokenExpirationDate(encodedToken) {
  const token = decode(encodedToken);
  if (!token.iat) { return null; }

  const expDate = token.iat + 600;

  const date = new Date(0);
  date.setUTCSeconds(expDate);

  return date;
}

export function isTokenExpired(token) {
	if (token == null){
		return true;
	}
	const expirationDate = getTokenExpirationDate(token);
	return expirationDate < new Date();
}

// export function setIdToken(jwtToken) {
//   let idToken = jwtToken;
//   localStorage.setItem(ID_TOKEN_KEY, idToken);
// }

export function requireAuth(nextState, replace) {
  if (!isLoggedIn()) {
    replace({pathname: '/login'});
  }
}
export function isLoggedIn() {
	alert('check login status');
	return true;
  // const idToken = getIdToken();
  // return !!idToken && !isTokenExpired(idToken);
}