import 'reflect-metadata';
import 'babel-polyfill';
import { App } from 'components';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { AppContainer } from 'react-hot-loader';

const version: string = '0.0.3';

/* Start application */
render(<App />);

function render(component: React.ReactElement<any>) {
  ReactDOM.hydrate(
    <AppContainer>{component}</AppContainer>,
    document.getElementById('root'),
    () => {
      // We don't need the static css any more once we have launched our application.
      const ssStyles = document.getElementById('server-side-styles');
      if (ssStyles && ssStyles.parentNode) {
        ssStyles.parentNode.removeChild(ssStyles);
      }
    },
  );
}

/* tslint:disable */
console.info(`%cApp version: ${version}`, 'background: #EBF5F8; color: gray; font-size: x-medium; border-radius: 5px; padding: 5px;');
/* tslint:enable */
