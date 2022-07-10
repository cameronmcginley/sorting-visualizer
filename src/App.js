import "./App.css";
import SortingVisualizer from "./Components/SortingVisualizer";
import Navbar from "./Components/Navbar";
import React from "react";

//"homepage": "http://cameronmcginley.com/sorting-visualizer",

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="content">
        <SortingVisualizer />
      </div>
    </div>
  );
}

export default App;
