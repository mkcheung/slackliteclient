export function updateMsgCount(msgCount) {
	console.log('user action:'+msgCount);
    return {
        type: 'MSG_COUNT_UPDATED',
        msgCount
    };
}