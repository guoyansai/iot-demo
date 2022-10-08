interface IntToDoList {
  id: number;
  title: string;
  type: boolean;
}

interface IntToDo {
  title: string;
  list: IntToDoList[];
}
export type todoListData = IntToDo;
