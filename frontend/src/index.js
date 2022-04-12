import React from 'react';
import ReactDOM from 'react-dom/client';
import 'styles/index.css';
import 'leaflet/dist/leaflet';
import App from './App';
import {Provider} from 'react-redux'
import store from 'utils/store';


const container = document.getElementById('root');

const root = ReactDOM.createRoot(container);

root.render(
  <React.Fragment>
    {/*Redux Provider is included access the store values from anywhere inside the child components.*/}
    <Provider store={store()}>
      <App/>
    </Provider>
  </React.Fragment>
);
