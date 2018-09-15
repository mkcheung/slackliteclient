import * as configConsts from '../config/config';

export function channelPicked(channel, messages, channelName) {
    return {
        type: 'CHANNEL_PICKED',
        channel, 
        messages, 
        channelName
    };
}
export function establishMsgs(messages) {
    return {
        type: 'ESTABLISH_MSGS',
        messages
    };
}

export function retrieveGroupChannels(groupChannels) {
    return {
        type: 'GET_GROUP_CHANNELS',
        groups: groupChannels
    };
}

export function setModalOpenStatus(modalStatus) {
    return {
        type: 'SET_MODAL_STATUS',
        open: modalStatus
    };
}

export function reloadUsers(users) {
    return {
        type: 'RELOAD_USERS',
        users
    };
}

export function establishTags(tags) {
    return {
        type: 'ESTABLISH_TAGS',
        tags
    };
}

export function setUsersAndSuggestions(users, suggestions) {
    return {
        type: 'SET_USERS_AND_SUGG',
        users,
        suggestions
    };
}