export interface ITodo {
  id: number;
  title: string;
  completed: boolean;
}

export type TodosOperation = (todos: ITodo[]) => ITodo[];
