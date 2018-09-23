import { combineReducers } from 'redux';
import { textInput } from './chat';
import conversationDashboard from './conversationDashboard';
import login from './login';
import user from './user';
import app from './app';
export default combineReducers({
    app,
    conversationDashboard,
    login,
    textInput,
    user,
});