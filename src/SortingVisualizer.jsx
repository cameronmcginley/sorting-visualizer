import './App.css';
import { Paper, Box, Button, Link } from "@mui/material";

export default function SortingVisualizer(props) {
    return (<>
        <div className="visualizer-container">
            {/* Visualizer View */}
            <Paper variant="outlined" className='visualizer'>
                {/* Holds the bars */}
                <div className="bars-container">

                </div>
            </Paper>

            {/* Settings */}
            <Paper variant="outlined" className='visualizer-settings'>
                Test
            </Paper>
        </div>
    </>)
}