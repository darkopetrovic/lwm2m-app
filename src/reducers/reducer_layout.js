
const initState = {
    left_side_bar_open: true,
    right_side_bar_open: false
};


export default function (state = initState, action) {
    switch (action.type) {
        case 'TOGGLE_LEFT_SIDEBAR':
            return {...state, left_side_bar_open: !state.left_side_bar_open};
        case 'TOGGLE_RIGHT_SIDEBAR':
            return {...state, right_side_bar_open: !state.right_side_bar_open};

        default:
            return state;
    }
}