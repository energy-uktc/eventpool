import ReduxThunk from "redux-thunk";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

const middleware = [ReduxThunk];

const rootReducer = combineReducers({
  // auth: authReducer,
  // quiz: quizReducer,
  // loading: loadingReducer,
});

export default store = createStore(
  rootReducer,
  //applyMiddleware(ReduxThunk),
  applyMiddleware(...middleware),
  composeWithDevTools()
);
