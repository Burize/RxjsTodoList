import * as React from 'react';

import { ITodo } from 'components/Todos/namespace';

import './Todo.scss';

interface IProps {
  todo: ITodo;
  onChange(id: number, completed: boolean): void;
}

export default class Todo extends React.PureComponent<IProps> {

  public render() {
    const { todo: { title, completed } } = this.props;
    return (
      <div className="todo">
        <div>{title}</div>
        <input type="checkbox" checked={completed} onChange={this.onChange} />
      </div>
    );
  }

  public onChange = () => {
    const { todo: { id, completed }, onChange } = this.props;
    onChange(id, !completed);
  }
}
