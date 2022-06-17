import React, { useEffect } from 'react';
import './App.css';
import { FormControl, InputLabel, Select, MenuItem, Paper, Box, Button, Link, Input, Slider, Grid, Checkbox, FormGroup, FormControlLabel } from "@mui/material";
// import * as Tone from 'tone';
import getBubbleSortAnimations from './Algorithms/BubbleSort';
import getMergeSortAnimations from './Algorithms/MergeSort';

// function Oscillator() {
//     let audioCtx;
//     let oscillator;
//     let gainNode;
//     let oscillatorRunning;

//     // First time set up
//     if (!oscillatorInitialized) {
//         setOscillatorInitialized(true)
//         audioCtx = new(window.AudioContext || window.webkitAudioContext)();
//         oscillator = audioCtx.createOscillator();
//         gainNode = aud
//         ioCtx.createGain();
//     }

//     oscillator.start()
//     oscillator.connect(gainNode);
//     gainNode.connect(audioCtx.destination);
//     oscillator.type = 'triangle';
//     // oscillator.frequency.value = (height * 2) + 110;
//     oscillator.frequency.value = currFrequency;
// }

export default function SortingVisualizer(props) {
    const [barCount, setBarCount] = React.useState(100);
    const [bars, setBars] = React.useState([]);
    const [delay, setDelay] = React.useState(1);
    const [sortType, setSortType] = React.useState("BubbleSort")
    

    // States used to prevent re-writing variables in this component
    // on renders.
    const [animationQueue, setAnimationQueue] = React.useState([])
    let [animationFrames, setAnimationFrames] = React.useState([])

    // This is max height - 1
    const MAX_HEIGHT = 99;
    const MAX_BARS = 100;
    const MAX_DELAY = 500;
    const PRIMARY_COLOR = "blue"
    const HIGHLIGHT_COLOR = "red"


    const [isPlaying, setIsPlaying] = React.useState(false);
    let [isPaused, setIsPaused] = React.useState(true);

    const [doPerfectArray, setDoPerfectArray] = React.useState(false);


    // Generate new array on load
    useEffect(() => {
        generateArray();
    }, [])

    // const osc = new Tone.Oscillator(0, "sine").toDestination().start();

    // First time oscillator setup

    const [oscillatorInitialized, setOscillatorInitialized] = React.useState(false)
    const [soundEnabled, setSoundEnabled] = React.useState(false)
    const [currFrequency, setCurrFrequency] = React.useState(500)

    const [audioCtx, setAudioCtx] = React.useState(null)
    const [oscillator, setOscillator] = React.useState(null)
    const [gainNode, setGainNode] = React.useState(null)

    const enableSound = () => {
        // First time set up
        // if (!setAudioCtx) {
        setAudioCtx(new(window.AudioContext || window.webkitAudioContext)());
            // setOscillator(audioCtx.createOscillator());
            // setGainNode(audioCtx.createGain());
        // }

        // oscillator.start()
        // oscillator.connect(gainNode);
        // gainNode.connect(audioCtx.destination);
        // oscillator.type = 'triangle';
        // // oscillator.frequency.value = (height * 2) + 110;
        // oscillator.frequency.value = currFrequency;
    }

    // Initialize oscillator and gain after audioctx
    useEffect(() => {
        console.log("audioCtx changed")
        if (audioCtx) {
            setOscillator(audioCtx.createOscillator());
            setGainNode(audioCtx.createGain());
        }
    }, [audioCtx])

    // Fires when either changes
    useEffect(() => {
        console.log("oscillator or gainNode changed")
        if (oscillator && gainNode) {
            if (!oscillatorInitialized) {
                setOscillatorInitialized(true)
                oscillator.start()
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.type = 'triangle';
                // oscillator.frequency.value = (height * 2) + 110;
                // oscillator.frequency.value = currFrequency;
            }
        }
        if (oscillator) {
            oscillator.frequency.value = currFrequency;
        }
    }, [oscillator, gainNode, currFrequency])


    useEffect(() => {
        console.log("sound enabled")
        if (soundEnabled) {
            // First time setup
            setAudioCtx(new(window.AudioContext || window.webkitAudioContext)());

        }
        else {
            setAudioCtx(null)
            if (oscillator) {
                oscillator.stop()
            }
        }
    }, [soundEnabled])

    useEffect(() => {
        // changeFreq(currFrequency)
    }, [currFrequency])

    






    // const setFrequency = (height) => {
    //     // osc.set({ frequency: (height * 3) + 400 })
    //     oscillator.frequency.value = height
        
    // }

    const playAnimation = () => {
        setIsPlaying(true)
        setIsPaused(false)

        // Don't regen frames after a pause-unpause
        if (animationFrames.length == 0) {
            // Get frames for immediate use
            switch (sortType) {
                case "BubbleSort":
                    animationFrames = getBubbleSortAnimations(bars)
                    break;
                case "MergeSort":
                    animationFrames = getMergeSortAnimations(bars)
                    break;
            }

            // Push a frame indicating end of animation
            animationFrames.push({
                type: "End",
            })

            // Push to state so we can see frames from other funcs
            setAnimationFrames(animationFrames)
        }

        // Append hasPlayed flag to frames
        for (let i = 0; i < animationFrames.length; i++) {
            animationFrames[i].hasPlayed = false;
        }

        // Being the oscillator
        // const osc = new Tone.Oscillator(0, "sine").toDestination().start();
        // osc.set({frequency: 500})

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
                (function (frame, indexes) {
                    animationQueue.push(setTimeout(function(frame, arr) { 
                        frame.hasPlayed = true;
                        for (let i = 0; i < indexes.length; i++) {
                            setCurrFrequency((bars[arr[i]].height * 2) + 110);
                            setBars(bars => {
                                let data = [...bars];
                                data[arr[i]].color = HIGHLIGHT_COLOR
                                return data;
                            })
                        }
                    }, delay*frameNum, frame, indexes));
                })(animationFrames[idx], animationFrames[idx].indexes.slice());

                frameNum++;

                // Unhighlight, don't increment frameNum, want it to turn
                // off right after swap/done comparing
                (function (frame, indexes) {
                    animationQueue.push(setTimeout(function(frame, arr) { 
                        frame.hasPlayed = true;
                        for (let i = 0; i < indexes.length; i++) {
                            setBars(bars => {
                                let data = [...bars];
                                data[arr[i]].color = PRIMARY_COLOR
                                return data;
                            })
                        }
                    }, delay*frameNum, frame, indexes));
                })(animationFrames[idx], animationFrames[idx].indexes.slice());

                continue;
            }

            if (animationFrames[idx].type == "Swap") {
                animationQueue.push(setTimeout((frame) => {
                    frame.hasPlayed = true;
                    // setFrequency(bars[frame.i].height)
                    setBars(bars => {
                        let data = [...bars];
                        let temp = data[frame.i];
                        data[frame.i] = data[frame.j];
                        data[frame.j] = temp;

                        // Put color back
                        // data[frame.i].color = "blue" 
                        // data[frame.j].color = "blue" 
                        return data ;
                    })
                }, delay*frameNum, animationFrames[idx]))

                frameNum++;
            }

            if (animationFrames[idx].type == "Replace") {
                // Replace value at index i with val
                animationQueue.push(setTimeout((frame) => {
                    frame.hasPlayed = true;
                    // setFrequency(bars[frame.i].height)
                    setBars(bars => {
                        let data = [...bars];
                        data[frame.i].height = frame.val;
                        return data ;
                    })
                }, delay*frameNum, animationFrames[idx]))

                frameNum++;
            }

            if (animationFrames[idx].type == "End") {
                // Replace value at index i with val
                animationQueue.push(setTimeout((frame) => {
                    // osc.set({frequency: 0})
                    setCurrFrequency(0)
                    frame.hasPlayed = true;
                    pauseAnim()
                }, delay*(frameNum-1), animationFrames[idx]))

                // frameNum++;
            }
        }
    }

    const pauseAnim = () => {
        setIsPaused(true)
        setIsPlaying(false)

        // Clear any leftover colors from animations
        for (let i = 0; i < bars.length; i++) {
            setBars(bars => {
                let data = [...bars];
                data[i].color = PRIMARY_COLOR
                return data ;
            })
        }

        // Clear the queued timeout swap funcs
        for (let i = 0; i < animationQueue.length; i++) {
            clearTimeout(animationQueue[i])
        }

        // Clean out already played frames
        let i = 0;
        while (animationFrames[i] && animationFrames[i].hasPlayed) {
            animationFrames.shift();
            // console.log("Shifted")
        }
    }

    // Fisher yates algorithm
    const shuffle = (array) => {
        let i = array.length;
        while (i--) {
          const ri = Math.floor(Math.random() * i);
          [array[i], array[ri]] = [array[ri], array[i]];
        }
        return array;
      }

    const generateArray = () => {
        // Dequeue animations if they're still playing
        pauseAnim()
        setAnimationFrames([])

        // Generate n bars, add to bars state array
        let generated_bars = []
        if (doPerfectArray) {
            // Generate perfectly spaced in height bars
            for (let i = 1; i <= barCount; i++) {
                generated_bars.push({
                    height: i * MAX_HEIGHT/barCount,
                    color: PRIMARY_COLOR,   
                })
            }
            // Shuffle them
            generated_bars = shuffle(generated_bars)
        }
        else {
            for (let i = 0; i < barCount; i++) {
                generated_bars.push({
                    height: Math.floor(Math.random() * MAX_HEIGHT) + 1,
                    color: PRIMARY_COLOR,   
                })
            }
        }


        setBars(generated_bars)
    }


    // Wait for flag to change before regenerating array
    useEffect(() => {
        generateArray()
    }, [doPerfectArray, barCount, sortType])

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
                                // height: `${val.height}px`,
                                height: `${val.height}%`,
                                width: `${100/barCount}%`,
                            }}
                        />
                    ))}
                </div>
            </Paper>

            {/* Settings */}
            <Paper variant="outlined" className='visualizer-settings'>
                {/* Generate array */}
                <Button
                    className='visualizer-setting'
                    onClick={() => {generateArray()}}
                    // disabled={isPlaying}
                    variant="outlined"
                    disabled={isPlaying}
                >
                    Generate
                </Button>

                {/* Play animation */}
                <Button
                    className='visualizer-setting'
                    onClick={() => {playAnimation()}}
                    disabled={isPlaying}
                    variant="outlined"
                >
                    Play
                </Button>

                {/* Pause animation */}
                <Button
                    className='visualizer-setting'
                    onClick={() => {pauseAnim()}}
                    disabled={isPaused}
                    variant="outlined"
                >
                    Pause
                </Button>
                
                {/* Bar count slider/input */}
                <Grid container spacing={2} alignItems="center">
                    {/* <Grid item>
                        <VolumeUp />
                    </Grid> */}
                    <Grid item xs>
                        <Slider
                            className='visualizer-setting'
                            value={barCount}
                            onChange={(e) => {
                                // Don't keep updating if sliding past MAX_BARS
                                if (e.target.value == MAX_BARS && barCount == MAX_BARS) {
                                    return
                                }
                                setBarCount(e.target.value)
                            }}
                            max={MAX_BARS}
                            min={5}
                            disabled={isPlaying}
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            className='visualizer-setting'
                            value={barCount}
                            size="small"
                            onChange={(e) => {
                                setBarCount(e.target.value)
                            }}
                            // onBlur={handleBlur}
                            inputProps={{
                                step: 10,
                                min: 5,
                                max: MAX_BARS,
                                type: 'number',
                            }}
                            disabled={isPlaying}
                        />
                    </Grid>
                </Grid>

                {/* Delay slider/input */}
                <Grid container spacing={2} alignItems="center">
                    {/* <Grid item>
                        <VolumeUp />
                    </Grid> */}
                    <Grid item xs>
                        <Slider
                            className='visualizer-setting'
                            value={delay}
                            onChange={(e) => {
                                // Don't keep updating if sliding past MAX_BARS
                                if (e.target.value == MAX_DELAY && delay == MAX_DELAY) {
                                    return
                                }
                                setDelay(e.target.value)
                            }}
                            max={MAX_DELAY}
                            min={1}
                            disabled={isPlaying}
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            className='visualizer-setting'
                            value={delay}
                            size="small"
                            onChange={(e) => {
                                setDelay(e.target.value)
                            }}
                            // onBlur={handleBlur}
                            inputProps={{
                                step: 1,
                                min: 1,
                                max: MAX_DELAY,
                                type: 'number',
                            }}
                            disabled={isPlaying}
                        />
                    </Grid>
                </Grid>

                {/* Uniform/perfect array */}
                <FormGroup>
                    <FormControlLabel 
                        control={
                            <Checkbox
                                className='visualizer-setting'
                                checked={doPerfectArray}
                                onChange={async () => {
                                    // Use above useEffect to regen array on state change
                                    setDoPerfectArray(!doPerfectArray)
                                }}
                                disabled={isPlaying}
                            />
                        }
                        label="Uniform Array" 
                    />
                </FormGroup>

                {/* Sounds */}
                <FormGroup>
                    <FormControlLabel 
                        control={
                            <Checkbox
                                className='visualizer-setting'
                                checked={soundEnabled}
                                onChange={async () => {
                                    // Use above useEffect to regen array on state change
                                    setSoundEnabled(!soundEnabled)
                                }}
                                // disabled={isPlaying}
                            />
                        }
                        label="Uniform Array" 
                    />
                </FormGroup>

                <FormControl sx={{ m: 1, minWidth: 80 }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Sorting Algorithm</InputLabel>
                    <Select
                        className='visualizer-setting'
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={sortType}
                        onChange={(e) => {setSortType(e.target.value)}}
                        autoWidth
                        label="Sorting Algorithm"
                        disabled={isPlaying}
                    >
                    <MenuItem value={"BubbleSort"}>Bubble Sort</MenuItem>
                    <MenuItem value={"MergeSort"}>Merge Sort</MenuItem>
                    </Select>
                </FormControl>
            </Paper>
        </div>
    </>)
}