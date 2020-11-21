import "./App.css";
import SortingVisualizer from "./SortingVisualizer/SortingVisualizer";
import React, { Component } from "react";
import { HashRouter, Route, Link } from "react-router-dom";

function App() {
    return (
        <HashRouter basename="/">
            <div className="App">
                <SortingVisualizer></SortingVisualizer>
            </div>
        </HashRouter>
    );
}

export default App;
