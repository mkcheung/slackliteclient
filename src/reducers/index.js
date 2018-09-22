import { combineReducers } from 'redux';
import { textInput } from './chat';
import conversationDashboard from './conversationDashboard';
import login from './login';
import user from './user';
export default combineReducers({
    conversationDashboard,
    login,
    textInput,
    user,
});