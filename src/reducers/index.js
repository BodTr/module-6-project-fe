import { combineReducers } from "redux";
import playingSongReducer from "./playingSongReducer";
import changeState from "./appStateReducer";

const rootReducer = combineReducers({
    playingSong: playingSongReducer,
    changeState: changeState,
});

export default rootReducer;