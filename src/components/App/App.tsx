import * as React from 'react';

import { Todos } from 'components';
import './app.scss';

export default class App extends React.PureComponent {

  public render() {
    return (
      <div className="app"><Todos /></div>
    );
  }

}
