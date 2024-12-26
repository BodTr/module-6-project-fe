const initialState = {
    playingSong: {

    }
}

const playingSongReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_SONG':
            return {
                ...state,
                playingSong: action.payload
            }
        
        default:
            return state
    }
}

export default playingSongReducer