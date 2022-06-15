import React, { useEffect } from 'react';
import './App.css';
import { Paper, Box, Button, Link } from "@mui/material";

export default function SortingVisualizer(props) {
    const [barCount, setBarCount] = React.useState(100);
    const [bars, setBars] = React.useState([]);
    const [delay, setDelay] = React.useState(1);

    // This is max height - 1
    const MAX_HEIGHT = 99;
    let bars_updating= false;

    // Generate full array of bars, then replace the bars state with it

    let generated_bars = []
    let animQueue = [];
    let animQueuePaused = [];
    let animPlaying = [];

    const swap = (i, j) => {
        // Must use setState to trigger re-render
        setBars(bars => {
            let data = [...bars];
            let temp = data[i];
            data[i] = data[j];
            data[j] = temp;

            return data ;
        })
    }
    const [animationQueue, setAnimationQueue] = React.useState([])
    const [animationFrames, setAnimationFrames] = React.useState([])

    const playAnimation = () => {
        bubbleSort(bars)

        // Queue up the frames in animationFrames
        for (let idx = 0; idx < animationFrames.length; idx++) {
            animationQueue.push(setTimeout((i, j) => {
                swap(i, j)
            }, idx*delay, animationFrames[idx].i, animationFrames[idx].j))
        }

        // Clear frames after they've all been queued
        // On pause-play, frames will be generated fresh
        animationFrames.length = 0;
    }

    const pauseAnim = () => {
        // Clear the queued timeout swap funcs
        for (let i = 0; i <animationQueue.length; i++) {
            clearTimeout(animationQueue[i])
        }
    }

    const bubbleSort = (bars_state) => {
        // Make a copy of the state to work on
        let bars_temp = [...bars_state];
        let curr_timer = 50;

        for(var i = 0; i < bars_temp.length; i++){
            for(var j = 0; j < ( bars_temp.length - i -1 ); j++){
              if(bars_temp[j].height > bars_temp[j+1].height){
                let temp = bars_temp[j];
                bars_temp[j] = bars_temp[j+1];
                bars_temp[j+1] = temp;

                animationFrames.push({
                    i: j,
                    j: j+1,
                })
              }
            }
        }
        // console.log(animationQueue)
    }


    const generateArray = () => {
        // Generate n bars, add to bars state array
        for (let i = 0; i < barCount; i++) {
            generated_bars.push({
                height: Math.floor(Math.random() * MAX_HEIGHT) + 1,
                color: "blue",   
            })
        }

        setBars(generated_bars)
    }

    // useEffect(() => {
    //     console.log("Bars changed")
    // }, [bars])
    
    // Each animation frame should store a bool for whether
    // it has played or not, change it on async anim play
    return (<>
        <div className="visualizer-container">
            {/* Visualizer View */}
            <Paper variant="outlined" className='visualizer'>
                {/* Holds the bars */}
                <div className="bars-container">
                    {bars.map((val, i) => (
                        <div
                            className='bar'
                            key={i}
                            style={{
                                backgroundColor: val.color,
                                height: `${val.height}px`,
                            }}
                        />
                    ))}
                </div>
            </Paper>

            {/* Settings */}
            <Paper variant="outlined" className='visualizer-settings'>
                <Button
                    onClick={() => {
                        generateArray();
                    }}
                >
                    Generate
                </Button>
                <Button
                    onClick={() => {
                        // bubbleSort(bars)
                        playAnimation()
                        // swap(5,7);
                        // swap(3,9);
                        // swap(3,34);
                        // swap(1,73);
                        // swap(2,57);
                        // swap(53,7);
                        // swap(3,5);
                    }}
                >
                    Play
                </Button>
                <Button
                    onClick={() => {
                        pauseAnim()
                    }}
                >
                    Pause
                </Button>
            </Paper>
        </div>
    </>)
}