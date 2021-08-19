import ReduxThunk from "redux-thunk";
import { createStore, combineReducers, applyMiddleware } from "redux";
import authReducer from "./reducers/auth";
import userReducer from "./reducers/user";
import { composeWithDevTools } from "redux-devtools-extension";

const middleware = [ReduxThunk];

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
});

export default store = createStore(
    rootReducer,
    //applyMiddleware(ReduxThunk),
    applyMiddleware(...middleware),
    composeWithDevTools()
);
