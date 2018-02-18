'use strict';
import io from 'socket.io-client';

// Settings configured here will be merged into the final config object.
export const chatServerDomain = 'https://mkcheung-multichat.now.sh/';
export const socket = io.connect(chatServerDomain);

// styles
export const currentUserMessageStyle = {float:'right',clear:'both',color:'white',listStyle:'none', margin:'5px', whiteSpace: 'normal', wordWrap: 'break-word'};
export const interlocutorUserMessageStyle = {float:'left',clear: 'both',listStyle:'none', margin:'5px', whiteSpace: 'normal', wordWrap: 'break-word'};
export const textBoxStyleCurrent = {width: '400px', overflow:'auto', borderRadius:'15px',backgroundColor:'#334CFF',padding:'20px'};
export const textBoxStyleInterlocutor = {width: '400px', overflow:'auto', borderRadius:'15px',backgroundColor:'#C9E1E5',padding:'20px'};
export const selectedUser = '#E7FFE7'
export const loggedInIconPadding = { paddingRight: 5 };
export const loggedInIcon = require('../icons/icons8-communicate-16.png');