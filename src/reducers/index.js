import { combineReducers } from 'redux';
import { textInput } from './chat';
import conversationDashboard from './conversationDashboard';
import login from './login';
export default combineReducers({
    conversationDashboard,
    login,
    textInput,
});