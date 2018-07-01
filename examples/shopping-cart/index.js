import "babel-polyfill"
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/App'

import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './reducers'
import rootSaga from './sagas'
import { DockableSagaView, createSagaMonitor } from '../../src'

const monitor = window["__SAGA_MONITOR_EXTENSION__"]
const sagaMiddleware = createSagaMiddleware({ sagaMonitor: monitor })
const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
)
sagaMiddleware.run(rootSaga)


ReactDOM.render(
  <div>
    <Provider store={store}>
      <App />
    </Provider>
    <DockableSagaView monitor={monitor} />
  </div>,
  document.getElementById('root')
)
