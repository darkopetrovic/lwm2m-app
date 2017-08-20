import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom'
import { createBrowserHistory, createHashHistory } from 'history';
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import promise from "redux-promise";
import freeze from 'redux-freeze';
import promiseMiddleware from 'redux-promise-middleware';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import { composeWithDevTools } from 'redux-devtools-extension';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk';
import reducers from "./reducers"
import {createLogger} from 'redux-logger'

// Containers
import Full from './containers/Full/'
// add the middlewares
let middlewares = [];

// Build the middleware for intercepting and dispatching navigation actions


middlewares.push(promiseMiddleware());
middlewares.push(freeze);
middlewares.push(thunk);

if (process.env.NODE_ENV === `development`) {
    const logger = createLogger({
        diff: true,
        collapsed: true,
        predicate: (getState, action) => action.type.indexOf('@@redux-form') < 0
    });


    middlewares.push(logger);
}

let history = createHashHistory();
const router_Middleware = routerMiddleware(history);
middlewares.push(router_Middleware);

let socket = io('http://localhost:5000');
let socketIoMiddleware = createSocketIoMiddleware(socket, "server/");
middlewares.push(socketIoMiddleware);


const store = createStore(reducers, composeWithDevTools(
  applyMiddleware(...middlewares)
));

history = syncHistoryWithStore(history, store);


ReactDOM.render((
  <Provider store={store}>
    <HashRouter history={history}>
      <Switch>
        <Route path="/" name="Home" component={Full}/>
      </Switch>
    </HashRouter>
  </Provider>
), document.getElementById('root'));
