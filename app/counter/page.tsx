"use client";

import { useState } from "react";

export default function CounterPage() {
  const [count, setCount] = useState(0);

  return (
    <section data-testid="counter-page">
      <h1>Counter</h1>
      <p>Click the buttons to change the value. Useful for click and state tests.</p>
      <div className="counter-display" data-testid="counter-value">
        {count}
      </div>
      <div className="counter-controls">
        <button
          type="button"
          data-testid="counter-decrement"
          onClick={() => setCount((c) => c - 1)}
        >
          -1
        </button>
        <button
          type="button"
          data-testid="counter-reset"
          onClick={() => setCount(0)}
        >
          Reset
        </button>
        <button
          type="button"
          data-testid="counter-increment"
          onClick={() => setCount((c) => c + 1)}
        >
          +1
        </button>
      </div>
    </section>
  );
}
