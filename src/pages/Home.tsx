import { createQuery } from "@tanstack/solid-query";
import { For, Suspense } from "solid-js";
import { createStore } from "solid-js/store";

import server from "../backend";

type Todo = {
  readonly id: number;
  readonly text: string;
  completed: boolean;
};

function Home() {
  let input!: HTMLInputElement;

  const [todos, setTodos] = createStore<Todo[]>([]);

  const addTodo = (text: string) => {
    setTodos(todos.length, { id: todos.length, text, completed: false });
  };

  const toggleTodo = (id: number) => {
    setTodos(id, "completed", (c) => !c);
  };

  const query = createQuery(() => ({
    queryKey: ["hello"],
    queryFn: async () => {
      const result = await server.api.hello.get();
      if (!result.data) throw new Error("Failed to fetch data");
      return result.data;
    },
    throwOnError: true, // Throw an error if the query fails
  }));

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <div>{query.data?.message}</div>
      </Suspense>
      <div>
        <input placeholder="new todo here" ref={input} />
        <button
          onClick={() => {
            if (!input.value.trim()) return;
            addTodo(input.value);
            input.value = "";
          }}
        >
          Add Todo
        </button>
      </div>
      <For each={todos}>
        {(todo) => {
          const { id, text } = todo;
          return (
            <div>
              <input type="checkbox" checked={todo.completed} onChange={[toggleTodo, id]} />
              <span
                style={{
                  "text-decoration": todo.completed ? "line-through" : "none",
                }}
              >
                {text}
              </span>
            </div>
          );
        }}
      </For>
    </div>
  );
}

export default Home;
