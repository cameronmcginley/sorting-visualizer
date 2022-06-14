import './App.css';
import SortingVisualizer from './SortingVisualizer';
import Navbar from './Components/Navbar';

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
