import { combineReducers } from 'redux';
import { textInput } from './chat';
import conversationDashboard from './conversationDashboard';
import login from './login';
import user from './user';
import app from './app';

const appReducer = combineReducers({
    app,
    conversationDashboard,
    login,
    textInput,
    user,
})

export default (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined
  }

  return appReducer(state, action)
}