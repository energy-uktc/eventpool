import ReduxThunk from "redux-thunk";
import { createStore, combineReducers, applyMiddleware } from "redux";
import authReducer from "./reducers/auth";
import userReducer from "./reducers/user";
import activityReducer from "./reducers/activity";
import eventsReducer from "./reducers/event";
import { composeWithDevTools } from "redux-devtools-extension";

const middleware = [ReduxThunk];

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  event: eventsReducer,
  activity: activityReducer,
});

export default store = createStore(
  rootReducer,
  //applyMiddleware(ReduxThunk),
  applyMiddleware(...middleware),
  composeWithDevTools()
);
