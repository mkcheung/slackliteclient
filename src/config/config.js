'use strict';
import io from 'socket.io-client';

// Settings configured here will be merged into the final config object.
export const chatServerDomain = 'http://localhost:3000/';
export const socket = io.connect(chatServerDomain);

// styles
export const currentUserMessageStyle = {height:'75px',width:'315px',borderRadius:'15px',float:'right',clear:'both',backgroundColor:'#334CFF',color:'white',listStyle:'none'};
export const interlocutorUserMessageStyle = {height:'75px',width:'315px',borderRadius:'15px',float:'left',clear: 'both',backgroundColor:'#C9E1E5',listStyle:'none'};
export const selectedUser = '#E7FFE7'
export const loggedInIconPadding = { paddingRight: 5 };
export const loggedInIcon = require('../icons/icons8-communicate-16.png');