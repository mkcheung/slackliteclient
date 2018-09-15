import { combineReducers } from 'redux';
import { textInput } from './chat';
import conversationDashboard from './conversationDashboard';
export default combineReducers({
    textInput,
    conversationDashboard
});