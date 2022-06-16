import React, { useEffect } from 'react';
import './App.css';
import { Paper, Box, Button, Link } from "@mui/material";
import BubbleSort from './Algorithms/BubbleSort';
import getMergeSortAnimations from './Algorithms/MergeSort';

export default function SortingVisualizer(props) {
    const [barCount, setBarCount] = React.useState(100);
    const [bars, setBars] = React.useState([]);
    const [delay, setDelay] = React.useState(10);

    // States used to prevent re-writing variables in this component
    // on renders.
    const [animationQueue, setAnimationQueue] = React.useState([])
    let [animationFrames, setAnimationFrames] = React.useState([])

    // This is max height - 1
    const MAX_HEIGHT = 99;








    // const swap = (i, j) => {
    //     // Must use setState to trigger re-render
    //     setBars(bars => {
    //         let data = [...bars];
    //         let temp = data[i];
    //         data[i] = data[j];
    //         data[j] = temp;

    //         return data ;
    //     })
    // }

    const playAnimation = () => {
        // bubbleSort(bars)
        // animationFrames = BubbleSort(bars)
        animationFrames = getMergeSortAnimations(bars)

        // Animation frame types: "Swap", "Replace", "Highlight"
        // Manually track number of frames queued
        // Since one frame can result in multiple animations
        let frameNum = 0

        for (let idx = 0; idx < animationFrames.length; idx++) {
            if (animationFrames[idx].type == "Highlight") {
                // Queue an animation to change color of every
                // index in the object
                // Passing array to timeout was odd
                // https://stackoverflow.com/questions/30390993/passing-an-array-as-function-argument-to-settimeout-acts-not-like-passing-a-vari
                (function (indexes) {
                    animationQueue.push(setTimeout(function(arr) { 
                        for (let i = 0; i < indexes.length; i++) {
                            setBars(bars => {
                                let data = [...bars];
                                data[arr[i]].color = "red"
                                return data;
                            })
                        }
                    }, delay*frameNum, indexes));
                })(animationFrames[idx].indexes.slice());

                frameNum++;

                // Unhighlight
                // Consolidate into other
                (function (indexes) {
                    animationQueue.push(setTimeout(function(arr) { 
                        for (let i = 0; i < indexes.length; i++) {
                            setBars(bars => {
                                let data = [...bars];
                                data[arr[i]].color = "blue"
                                return data;
                            })
                        }
                    }, delay*frameNum, indexes));
                })(animationFrames[idx].indexes.slice());

                frameNum++;

                continue;
            }

            if (animationFrames[idx].type == "Swap") {
                animationQueue.push(setTimeout((i, j) => {
                    console.log("Swap")
                    setBars(bars => {
                        let data = [...bars];
                        let temp = data[i];
                        data[i] = data[j];
                        data[j] = temp;
                        return data ;
                    })
                }, delay*frameNum, animationFrames[idx].i, animationFrames[idx].j))

                frameNum++;
            }

            if (animationFrames[idx].type == "Replace") {
                // Replace value at index i with val
                animationQueue.push(setTimeout((i, val) => {
                    setBars(bars => {
                        let data = [...bars];
                        data[i].height = val;
                        return data ;
                    })
                }, delay*frameNum, animationFrames[idx].i, animationFrames[idx].val))

                frameNum++;
            }
        }


        // Need to overhaul pausing
        // Only delete frames already played
        // Resume from where left off, don't regen from start

        // // Clear frames after they've all been queued
        // // On pause-unpause, frames will be generated fresh
        animationFrames.length = 0;
    }

    const pauseAnim = () => {
        // Clear the queued timeout swap funcs
        for (let i = 0; i < animationQueue.length; i++) {
            clearTimeout(animationQueue[i])
        }
    }

    const generateArray = () => {
        // Dequeue animations if they're still playing
        pauseAnim()

        // Generate n bars, add to bars state array
        let generated_bars = []
        for (let i = 0; i < barCount; i++) {
            generated_bars.push({
                height: Math.floor(Math.random() * MAX_HEIGHT) + 1,
                color: "blue",   
            })
        }

        setBars(generated_bars)
    }












    // const swap = (i, j) => {
    //     // Must use setState to trigger re-render
    //     setBars(bars => {
    //         let data = [...bars];
    //         let temp = data[i];
    //         data[i] = data[j];
    //         data[j] = temp;

    //         return data ;
    //     })
    // }

    // const playAnimation = () => {
    //     // bubbleSort(bars)
    //     // animationFrames = BubbleSort(bars)
    //     animationFrames = getMergeSortAnimations(bars)
    //     console.log(animationFrames)

    //     // Queue up the frames in animationFrames
    //     for (let idx = 0; idx < animationFrames.length; idx++) {
    //         animationQueue.push(setTimeout((i, j) => {
    //             swap(i, j)
    //         }, idx*delay, animationFrames[idx].i, animationFrames[idx].j))
    //     }

    //     // Clear frames after they've all been queued
    //     // On pause-unpause, frames will be generated fresh
    //     animationFrames.length = 0;
    // }

    // const pauseAnim = () => {
    //     // Clear the queued timeout swap funcs
    //     for (let i = 0; i <animationQueue.length; i++) {
    //         clearTimeout(animationQueue[i])
    //     }
    // }

    // const generateArray = () => {
    //     // Dequeue animations if they're still playing
    //     pauseAnim()

    //     // Generate n bars, add to bars state array
    //     let generated_bars = []
    //     for (let i = 0; i < barCount; i++) {
    //         generated_bars.push({
    //             height: Math.floor(Math.random() * MAX_HEIGHT) + 1,
    //             color: "blue",   
    //         })
    //     }

    //     setBars(generated_bars)
    // }

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