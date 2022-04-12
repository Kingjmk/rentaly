import React from 'react';
import ReactDOM from 'react-dom/client';
import 'styles/index.scss';
import 'leaflet/dist/leaflet';
import App from './App';
import {ProviderWrapper} from 'store/init';

const container = document.getElementById('root');

const root = ReactDOM.createRoot(container);

root.render(
  <React.Fragment>
    <ProviderWrapper>
      <App/>
    </ProviderWrapper>
  </React.Fragment>
);
