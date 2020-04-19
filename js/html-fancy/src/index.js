import 'spectre.css/dist/spectre.css';

import {render} from 'preact';

import App from './App';


render(
  <App
    environment={global.ENVIRONMENT}
    home_page={global.HOMEPAGE}
    />,
  document.getElementById('__root__'),
);

