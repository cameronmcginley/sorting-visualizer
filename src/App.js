import "./App.css";
import SortingVisualizer from "./SortingVisualizer/SortingVisualizer";
import React from "react";
import { BrowserRouter } from "react-router-dom";

//In package.json:
//"homepage": "http://cameronmcginley.com/sorting-visualizer",

function App() {
    return (
        <BrowserRouter basename="/">
            <div className="App">
                <SortingVisualizer></SortingVisualizer>
            </div>
        </BrowserRouter>
    );
}

export default App;
