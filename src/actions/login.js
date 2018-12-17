export function openRegistrationModal(open) {
    return {
        type: 'OPEN_REG_MODAL',
        open
    };
}
export function setIsModalOpenStatus(isOpen) {
    return {
        type: 'SET_MODAL_OPEN_STATUS',
        isOpen:(!isOpen)
    };
}
