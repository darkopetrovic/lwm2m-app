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
import { syncHistoryWithStore } from 'react-router-redux'
import thunk from 'redux-thunk';
import reducers from "./reducers";

// Containers
import Full from './containers/Full/'
// add the middlewares
let middlewares = [];

// Build the middleware for intercepting and dispatching navigation actions
//const router_Middleware = routerMiddleware(history);
//middlewares.push(router_Middleware);

middlewares.push(promiseMiddleware());
middlewares.push(freeze);
middlewares.push(thunk);

let socket = io('http://localhost:5000');
let socketIoMiddleware = createSocketIoMiddleware(socket, "server/");
middlewares.push(socketIoMiddleware);

const store = createStore(reducers, composeWithDevTools(
  applyMiddleware(...middlewares)
));

const history = syncHistoryWithStore(createHashHistory(), store);

ReactDOM.render((
  <Provider store={store}>
    <HashRouter history={history}>
      <Switch>
        <Route path="/" name="Home" component={Full}/>
      </Switch>
    </HashRouter>
  </Provider>
), document.getElementById('root'));
