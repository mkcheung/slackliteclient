export function textInput(state = false, action) {
    switch (action.type) {
        case 'TEXT_INPUTTED':
            return action.msg;
        default:
            return state;
    }
}