import "./styles.css";

import * as React from "react";
import { createRoot } from "react-dom/client";

import Location from "./components/Location";

function App() {
  return (
    <div className="app">
      <Location />
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
