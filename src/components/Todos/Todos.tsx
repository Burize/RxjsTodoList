import * as React from 'react';
import { connect } from 'components/shared';

import { actionProps, mapStateToProps } from './reactive';
import { TodoList } from './view';

import { ITodo } from './namespace';

import './Todos.scss';

interface IStateProps {
  todos: ITodo[];
  selectedTodo: number | null;
  title: string;
}

interface IActionProps {
  onChangeQuery(value: string): void;
  addTodo(todo: ITodo): void;
  changeTodoStatus(id: number, completed: boolean): void;
  selectTodo(id: number): void;
  deleteTodo(id: number): void;
}

type IProps = IStateProps & IActionProps;
class Todos extends React.PureComponent<IProps> {

  public render() {
    const { todos, title, selectedTodo, selectTodo } = this.props;
    return (
      <div className="todos">
        <input
          type="text"
          value={title}
          onChange={this.onValueChange}
        />
        <button onClick={this.onAddTodo}>add todo</button>
        <div className="todos__list">
          {todos &&
            <TodoList
              onSelect={selectTodo}
              selectedTodo={selectedTodo}
              todos={todos}
              onChangeStatus={this.onChangeTodoStatus}
            />}
        </div>
        <button disabled={!selectedTodo} onClick={this.onDeleteTodo}>remove todo</button>
      </div>
    );
  }

  public onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChangeQuery(event.target.value);
  }

  public onAddTodo = () => {
    const { addTodo, title } = this.props;
    addTodo({ title, id: Date.now(), completed: false });
  }

  public onChangeTodoStatus = (id: number, completed: boolean) => {
    this.props.changeTodoStatus(id, completed);
  }

  public onDeleteTodo = () => {
    const { selectedTodo, deleteTodo } = this.props;
    if (selectedTodo) {
      deleteTodo(selectedTodo);
    }
  }
}

export default connect<IProps, IStateProps, IActionProps>(mapStateToProps, actionProps)(Todos);
