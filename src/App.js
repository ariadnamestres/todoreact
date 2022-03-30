import { useEffect, useRef, useState } from "react";
import "./styles.css";
const EndPoint = "https://tc-todo-2022.herokuapp.com/todos";
function AfegirTodo({ onTodoAdded }) {
  const titleRef = useRef();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const title = titleRef.current.value;
        titleRef.current.value = "";
        fetch(EndPoint, {
          method: "POST",
          body: JSON.stringify({ title }),
        })
          .then((response) => response.json())
          .then((json) => onTodoAdded(json));
      }}
    >
      <input ref={titleRef} />
      <input type="submit" value="Afegir" />
    </form>
  );
}

function TodoItem({ todo, onUpdated }) {
  return (
    <li
      className={todo.completed ? "completed" : "pending"}
      onClick={() => {
        fetch(`${EndPoint}/${todo.id}`, {
          method: "POST",
          body: JSON.stringify({ completed: !todo.completed }),
        })
          .then((response) => response.json())
          .then((json) => onUpdated(json));
      }}
    >
      {todo.title}
    </li>
  );
}

export function getTodos() {
  return fetch(EndPoint).then((response) => response.json());
}

export default function App() {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    getTodos().then(setTodos);

    const intervalID = setInterval(() => {
      getTodos().then(setTodos);
    }, 1000);
    return () => clearInterval(intervalID);
  }, []);

  return (
    <div className="App">
      <h1> LListat de TODOS </h1>
      <button onClick={() => getTodos().then(setTodos)}>Refresh</button>
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdated={(updatedTodo) =>
              setTodos(
                todos.map((currentTodo) =>
                  currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo
                )
              )
            }
          />
        ))}
      </ul>
      <AfegirTodo onTodoAdded={(todo) => setTodos([...todos, todo])} />
      {/* <pre> {JSON.stringify(todos, null, 2)} </pre> */}
    </div>
  );
}
