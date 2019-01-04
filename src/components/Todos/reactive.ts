import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { ITodo, TodosOperation } from './namespace';
import { map, scan } from 'rxjs/operators';

const newTodo$ = new BehaviorSubject({ title: 'react' });
const selectTodo$ = new BehaviorSubject<number | null>(null);

const update$ = new BehaviorSubject((todos: ITodo[]) => todos);
const addTodo$ = new Subject();
const deleteTodo$ = new Subject();
const changeTodoStatus$ = new Subject();

export const mapStateToProps = () => {

  const initialTodos: ITodo[] = [
    { id: 1, title: 'tot1', completed: false },
    { id: 2, title: 'tot2', completed: true },
  ];

  const todos$ = update$.pipe(
    scan((todos: ITodo[], operation: TodosOperation) => operation(todos), initialTodos),
    map(todos => ({ todos })),
  );

  addTodo$.pipe(
    map((todo: ITodo) => (todos: ITodo[]) => todos.concat(todo)),
  ).subscribe(update$);

  deleteTodo$.pipe(
    map((id: number) => (todos: ITodo[]) => todos.filter(todo => todo.id !== id)),
  ).subscribe(update$);

  changeTodoStatus$.pipe(
    map(({ id, completed }: { id: number, completed: boolean }) =>
      (todos: ITodo[]) => todos.map(todo => todo.id === id ? { ...todo, completed } : todo),
    ),
  ).subscribe(update$);

  return combineLatest(
    newTodo$,
    todos$,
    selectTodo$,
    (newTodo, todos, selectedTodo) => ({ ...newTodo, ...todos, selectedTodo }),
  );
};

export const actionProps = {
  onChangeQuery: (value: string) => newTodo$.next({ title: value }),
  addTodo: (todo: ITodo) => addTodo$.next(todo),
  deleteTodo: (id: number) => {
    deleteTodo$.next(id);
    selectTodo$.next(null);
  },
  changeTodoStatus: (id: number, completed: boolean) => changeTodoStatus$.next({ id, completed }),
  selectTodo: (id: number) => selectTodo$.next(id),
};
