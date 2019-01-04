import * as React from 'react';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ITodo } from 'components/Todos/namespace';
import Todo from './components/Todo/Todo';
import { connect } from 'components/shared';

import './TodoList.scss';

type Filter = 'all' | 'completed' | 'active';

const filters: Filter[] = ['all', 'completed', 'active'];

interface IOwnProps {
  selectedTodo: number | null;
  todos: ITodo[];
  onChangeStatus(id: number, completed: boolean): void;
  onSelect(id: number): void;

}

interface IActionProps {
  onChangeFilter(filter: Filter): void;
}

interface IStateProps {
  selectedFilter: Filter;
}

type IProps = IOwnProps & IActionProps & IStateProps;

class TodoList extends React.PureComponent<IProps> {

  public render() {
    const { todos, selectedFilter, selectedTodo } = this.props;

    const filteredTodos = selectedFilter === 'all' ? todos :
      todos.filter(todo => selectedFilter === 'completed' ? todo.completed : !todo.completed);
    return (
      <div className="todoList">
        {filters.map(filter => (
          <div key={filter} className="radio">
            <label>
              <input
                type="radio"
                value={filter}
                checked={selectedFilter === filter}
                onChange={this.handleOptionChange}
              />
              {filter}
            </label>
          </div>
        ))}
        {filteredTodos.map(todo => (
          <div
            className="todoList__todo"
            style={{ border: todo.id === selectedTodo ? 'solid #7e191b 1px' : 'unset' }}
            onClick={this.props.onSelect.bind(null, todo.id)}
            key={todo.id}
          >
            <Todo onChange={this.onChangeStatus} todo={todo}>{todo}</Todo>
          </div>
        ))}
      </div>
    );
  }

  public onChangeStatus = (id: number, completed: boolean) => {
    this.props.onChangeStatus(id, completed);
  }

  public handleOptionChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChangeFilter(changeEvent.target.value as Filter);
  }
}

const selectedFilter$ = new BehaviorSubject<Filter>('all');

export default connect<IProps, IStateProps, IActionProps>(() => {

  return selectedFilter$.pipe(map(filter => ({ selectedFilter: filter })));
},
  {
    onChangeFilter: (filter: Filter) => selectedFilter$.next(filter),
  },
)(TodoList);
