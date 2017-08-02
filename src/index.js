import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history';
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import promise from "redux-promise";
import freeze from 'redux-freeze';
import promiseMiddleware from 'redux-promise-middleware';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import { composeWithDevTools } from 'redux-devtools-extension';


import reducers from "./reducers";

// Containers
import Full from './containers/Full/'

const history = createBrowserHistory();

// add the middlewares
let middlewares = [];
middlewares.push(promiseMiddleware());
middlewares.push(freeze);

let socket = io('http://localhost:5000');
let socketIoMiddleware = createSocketIoMiddleware(socket, "server/");
middlewares.push(socketIoMiddleware);

const store = createStore(reducers, composeWithDevTools(
  applyMiddleware(...middlewares)
));

ReactDOM.render((
  <Provider store={store}>
    <HashRouter history={history}>
      <Switch>
        <Route path="/" name="Home" component={Full}/>
      </Switch>
    </HashRouter>
  </Provider>
), document.getElementById('root'));
