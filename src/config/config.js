'use strict';
import io from 'socket.io-client';

// Settings configured here will be merged into the final config object.
export const chatServerDomain = 'http://localhost:3000/';
export const socket = io.connect(chatServerDomain);
