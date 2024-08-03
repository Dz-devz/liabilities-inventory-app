import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Vite + React</h1>
      <div className="flex justify-center items-center">
        <button onClick={() => setCount((count) => count + 1)}>Add</button>
        <button onClick={() => setCount((count) => count - 1)}>Minus</button>
        <p>count is {count}</p>
      </div>
    </>
  );
}

export default App;
