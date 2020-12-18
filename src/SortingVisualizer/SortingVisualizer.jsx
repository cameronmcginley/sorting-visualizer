import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Checkbox, Grid, Typography, Slider, Input, FormControlLabel } from '@material-ui/core';

import { getMergeSortAnimations } from '../SortingAlgorithms/SortingAlgorithms.js';
import './SortingVisualizer.css';

// This is the main color of the array bars.
const PRIMARY_COLOR = '#4054d6';

// This is the color of array bars that are being compared throughout the animations.
const SECONDARY_COLOR = '#1f2e92';

//Where to starting queueing frames from animations[]
let pauseFrame = 0;

//Running is true from the time animation is started until it is stopped
//Stays true when paused
let running = false;

let pause = false;
let animations = [];
let maxFrames = 0;

const sizeSlider = {
    initVal: 51,
    minVal: 10,
    maxVal: 500,
}

const speedSlider = {
    initVal: 5,
    minVal: 1,
    maxVal: 100,
}

// Change this value for the number of bars (value) in the array.
let NUMBER_OF_ARRAY_BARS = sizeSlider.initVal;

// Change this value for the speed of the animations.
let ANIMATION_SPEED_MS = speedSlider.initVal;

// let audioCtx = new(window.AudioContext || window.webkitAudioContext)();
// let oscillator = audioCtx.createOscillator();
// let gainNode = audioCtx.createGain();
// //Default to mute
// gainNode.gain.value = 0.000001;
// let oscillatorRunning = false;
// oscillator.start();

let audioCtx;
let oscillator;
let gainNode;
let oscillatorRunning;

let soundOn = false;
let perfectArray = false;

let oscillatorInitialized = false;

export default class SortingVisualizer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            array: [],
        };

        this.timeouts = [];
        this.timeoutsClear = [];
    }

    componentDidMount() {
        this.resetArray();
    }

    resetArray() {
        //Reset variables
        const array = [];
        this.timeouts = [];
        this.timeoutsClear = [];
        animations = [];
        pauseFrame = 0;
        maxFrames = 0;
        pause = false;
        running = false;
        this.enableButtons();

        //Disconnect oscillator
        if (oscillatorRunning) this.playSound(-1);

        //Disable pause button when not running
        document.querySelector(".pause").disabled = true;

        //Fill out the array
        if (perfectArray) {
            //Build array
            for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
                array.push((i+1) * (445 / NUMBER_OF_ARRAY_BARS));
            }
            //Shuffle it
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
        else {
            for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
                array.push(randomIntFromInterval(5, 450));
            }
        }
        this.setState({ array });
    }

    enableButtons(){
        //Static NodeList of all buttons to toggle
        let buttons = document.querySelectorAll('.lock');

        //Enable buttons
        for (let btn of buttons){
            btn.disabled = false;
        }
        //Keep size slider and dropdown menu disabled
        if (running === true) {
            let size = document.querySelector('.size');
            let dropdown = document.querySelector('.dropdown');

            if (size) size.disabled = true;
            if (dropdown) dropdown.disabled = true;
        }
    }

    disableButtons(){
        //Static NodeList of all buttons to toggle
        let buttons = document.querySelectorAll('.lock');
        
        //Disable buttons
        for (let btn of buttons){
            btn.disabled = true;
        }
    }

    //https://stackoverflow.com/questions/879152/how-do-i-make-javascript-beep
    //Oscillator always plays during animation. If sound checkbox is unchecked,
    //the oscillitor is muted. This allows starting/stopping it by making the checkbox
    //simply control volume
    playSound(barHeight) {
        if (oscillatorInitialized) {
            //Start (connect) oscillator on first iteration
            if (oscillatorRunning === false) {
                oscillatorRunning = true;

                console.log("Start Oscillator");

                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                oscillator.type = 'triangle';
            }

            oscillator.frequency.value = (parseInt(barHeight, 10) * 2) + 110;
        }
    }

    muteSound() {
        if (oscillatorInitialized) gainNode.gain.value = 0.000001;
    }

    unmuteSound() {
        if (oscillatorInitialized) gainNode.gain.value = 0.03;
    }

    //Disconnect oscillator
    endSound() {
        if (soundOn){
            console.log("Stop Oscillator");
            oscillatorRunning = false;
            setTimeout(() => {
                oscillator.disconnect(gainNode);
                gainNode.disconnect(audioCtx.destination);
            }, ANIMATION_SPEED_MS)
        }
    }

    //First time oscillator set up
    initializeSound() {
        oscillatorInitialized = true;

        audioCtx = new(window.AudioContext || window.webkitAudioContext)();
        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        oscillatorRunning = false;
        oscillator.start();

        console.log("Sound initialized");
    }

    mergeSort() {
        //Don't get new animations if resuming
        if (animations.length === 0) animations = getMergeSortAnimations(this.state.array);

        //Animate
        for (let i = pauseFrame; i < animations.length; i++) {
            const arrayBars = document.getElementsByClassName('array-bar');
            const isColorChange = i % 3 !== 2;
            if (isColorChange) {
                const [barOneIdx, barTwoIdx] = animations[i];
                const barOneStyle = arrayBars[barOneIdx].style;
                const barTwoStyle = arrayBars[barTwoIdx].style;
                const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;

                //Push animation timeouts to timeouts array
                this.timeouts.push(setTimeout(() => {
                    barOneStyle.backgroundColor = color;
                    barTwoStyle.backgroundColor = color;

                    //console.log("AnimColorPlayed");
                }, (i-pauseFrame) * ANIMATION_SPEED_MS));

            } else {
                //Push animation timeouts to timeouts array
                this.timeouts.push(setTimeout(() => {
                    const [barOneIdx, newHeight] = animations[i];
                    const barOneStyle = arrayBars[barOneIdx].style;
                    barOneStyle.height = `${newHeight}px`;

                    //Play oscillator and/or modify frequency
                    this.playSound(barOneStyle.height);
                    //console.log("Sound played");

                    //On last frame of animation
                    if (i === animations.length -1){
                        animations = [];
                        maxFrames = 0;
                        running = false;

                        //Disconnect oscillator
                        this.endSound();

                        document.querySelector(".play").disabled = false;
                        document.querySelector(".pause").disabled = true;
                        this.enableButtons();

                        console.log("Animation Finished");
                    }

                    //console.log("AnimPlayed");
                }, (i-pauseFrame) * ANIMATION_SPEED_MS));
            }

            //Clears completed setTimeout, then removes from timeouts array
            this.timeoutsClear.push(setTimeout(() => {
                clearTimeout(this.timeouts[0]);
                this.timeouts.shift();

               // console.log("AnimCleared");
            }, (i-pauseFrame) * ANIMATION_SPEED_MS));
        }
        //Doesn't update when calling resume, since the length will be shorter
        //since it is building timeouts from just the pause point
        if (this.timeouts.length > maxFrames) maxFrames = this.timeouts.length;
    }

    pauseAnim(){
        //Toggle buttons
        document.querySelector(".play").disabled = false;
        document.querySelector(".pause").disabled = true;
        this.enableButtons();

        //Mute oscillator
        this.muteSound();

        pause = true;
        pauseFrame = maxFrames - this.timeouts.length;

        console.log("Paused on frame:")
        console.log(pauseFrame);

        //Iterates through all queued frames and clears them
        for (let i = 0; i < this.timeouts.length; i++) {
            clearTimeout(this.timeouts[i]);
        }

        //Iterates through all queued frames and clears them
        for (let i = 0; i < this.timeoutsClear.length; i++) {
            clearTimeout(this.timeoutsClear[i]);
        }
        this.timeouts = [];
        this.timeoutsClear = [];
    }

    playAnim(){
        //Toggle buttons
        document.querySelector(".play").disabled = true;
        document.querySelector(".pause").disabled = false;

        //Unmute oscillator if needed
        if (soundOn) this.unmuteSound();

        this.disableButtons();

        //Act as a resume button if paused
        if (pause === true){
            console.log("Resuming on frame");
            console.log(pauseFrame);
            pause = false;

            //Requeue frames after pauseFrame
            this.mergeSort();
        }
        //Start button, initiate selected sorting algorithm
        else if (running === false) {
            running = true;

             //Get the drop down menu
             let input = document.querySelector(".dropdown");
             if (input) console.log(input.text)

             switch (input.value){
                 case "1":
                     this.mergeSort();
                     break;
                 case "2":
                     this.mergeSort();
                     break;
                 case "3":
                     this.mergeSort();
                     break;
                 case "4":
                     this.mergeSort();
                     break;
                 default:
                     console.log("Unkown Selection");
                     break;
             }
        }
    }

    getInfo(){
        console.log("pauseFrame");
        console.log(pauseFrame);
        console.log("timeouts");
        console.log(this.timeouts);
        console.log("timeoutsClear");
        console.log(this.timeoutsClear);
        console.log("animations");
        console.log(animations);
        console.log("maxFrames");
        console.log(maxFrames);
        console.log("Frames Completed");
        console.log(maxFrames - this.timeouts.length);
        console.log("gain");
        console.log(gainNode.gain.value);
        console.log("size");
        console.log(NUMBER_OF_ARRAY_BARS);
        console.log("speed");
        console.log(ANIMATION_SPEED_MS);
    }

    render() {
        const { array } = this.state;

        return (
            <div>
                <div className="array-container">
                    {array.map((value, idx) => (
                        <div
                            className="array-bar"
                            key={idx}
                            style={{
                                backgroundColor: PRIMARY_COLOR,
                                height: `${value}px`,
                                width: 100 / NUMBER_OF_ARRAY_BARS + `%`,
                            }}></div>
                    ))}

                    {/* Invisible bar at max height placed at end, makes it so generating new arrays doesn't change div height */}
                    <div
                        className="array-bar"
                        style={{
                            backgroundColor: PRIMARY_COLOR,
                            height: `450px`,
                            width: `0%`,
                        }}></div>
                </div>

                <div className="options">
                    <button className="lock" onClick={() => this.resetArray()}>Generate New Array</button>

                    <select className="lock dropdown">
                        <option value="1">Merge Sort</option>
                        <option value="2">Quick Sort</option>
                        <option value="3">Bubble Sort</option>
                        <option value="4">Insertion Sort</option>
                    </select>

                    <button className="play" onClick={() => this.playAnim()}>Play</button>

                    <button className="pause" onClick={() => this.pauseAnim()}>Pause</button>

                    <button onClick={() => this.getInfo()}>Info</button>

                    {/* Array size */}
                    {/*<input className="lock size" type="range" min="10" max="500" defaultValue="250"></input>*/}
                    <SliderSize></SliderSize>
                    
                    {/* Animation speed */}
                    {/*<input className="lock speed" type="range" min="1" max="50" defaultValue="5"></input>*/}
                    <SliderSpeed></SliderSpeed>

                    {/* Enable Sound */}
                    <FormControlLabel
                        value="top"
                        control={
                            <CustomCheckbox
                                value="checkedA"
                                inputProps={{ 'aria-label': 'Checkbox A' }}
                                onChange={e => {
                                    soundOn = !soundOn;

                                    //Mute/unmute oscillator when toggling checkbox
                                    if (soundOn === false) {
                                        this.muteSound();
                                    }
                                    else {
                                        //First time set up if needed
                                        if (!oscillatorInitialized) this.initializeSound();

                                        if (pause === false) this.unmuteSound();
                                    }

                                    console.log(gainNode.gain.value);
                                }}
                            />
                        }
                        label="Enable Sound"
                        labelPlacement="top"
                    />

                    {/* Perfect Array */}
                    <FormControlLabel
                        value="top"
                        control={
                            <CustomCheckbox
                                value="checkedA"
                                inputProps={{ 'aria-label': 'Checkbox A' }}
                                onChange={e => {perfectArray = !perfectArray}}
                            />
                        }
                        label="Perfect Array"
                        labelPlacement="top"
                    />
                </div>
            </div>
        );
    }
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const useStyles = makeStyles({
    root: {
        width: 250,
    },
    input: {
        width: 42,
    },
});

function SliderSize() {
    const classes = useStyles();
    const [value, setValue] = React.useState(sizeSlider.initVal);

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
        NUMBER_OF_ARRAY_BARS = newValue;
    };

    const handleInputChange = (event) => {
        let inputVal = Number(event.target.value);
        setValue(event.target.value === '' ? '' : inputVal);

        if (inputVal < sizeSlider.minVal) {
            inputVal = sizeSlider.minVal;
        } else if (inputVal > sizeSlider.maxVal) {
            inputVal = sizeSlider.maxVal;
        }
        
        NUMBER_OF_ARRAY_BARS = inputVal;
    };

    const handleBlur = () => {
        if (value < sizeSlider.minVal) {
            setValue(sizeSlider.minVal);
        } else if (value > sizeSlider.maxVal) {
            setValue(sizeSlider.maxVal);
        }
    };

    return (
        <div className={classes.root}>
        <Typography id="input-slider" gutterBottom>
            Size
        </Typography>
        <Grid container spacing={2} alignItems="center">
            <Grid item>
            </Grid>
            <Grid item xs>
            <Slider
                value={typeof value === 'number' ? value : 0}
                onChange={handleSliderChange}
                aria-labelledby="input-slider"
                min={sizeSlider.minVal}
                max={sizeSlider.maxVal}
            />
            </Grid>
            <Grid item>
            <Input
                className={classes.input}
                value={value}
                margin="dense"
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{
                step: 10,
                min: sizeSlider.minVal,
                max: sizeSlider.maxVal,
                type: 'number',
                'aria-labelledby': 'input-slider',
                }}
            />
            </Grid>
        </Grid>
        </div>
    );
}

function SliderSpeed() {
    const classes = useStyles();
    const [value, setValue] = React.useState(speedSlider.initVal);

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
        ANIMATION_SPEED_MS = newValue;
    };

    const handleInputChange = (event) => {
        let inputVal = Number(event.target.value);
        setValue(event.target.value === '' ? '' : inputVal);

        if (inputVal < speedSlider.minVal) {
            inputVal = speedSlider.minVal;
        } else if (inputVal > speedSlider.maxVal) {
            inputVal = speedSlider.maxVal;
        }
        
        ANIMATION_SPEED_MS = inputVal;
    };

    const handleBlur = () => {
        if (value < speedSlider.minVal) {
            setValue(speedSlider.minVal);
        } else if (value > speedSlider.maxVal) {
            setValue(speedSlider.maxVal);
        }
    };

    return (
        <div className={classes.root}>
        <Typography id="input-slider" gutterBottom>
            Speed (ms)
        </Typography>
        <Grid container spacing={2} alignItems="center">
            <Grid item>
            </Grid>
            <Grid item xs>
            <Slider
                value={typeof value === 'number' ? value : 0}
                onChange={handleSliderChange}
                aria-labelledby="input-slider"
                min={speedSlider.minVal}
                max={speedSlider.maxVal}
            />
            </Grid>
            <Grid item>
            <Input
                className={classes.input}
                value={value}
                margin="dense"
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{
                step: 10,
                min: speedSlider.minVal,
                max: speedSlider.maxVal,
                type: 'number',
                'aria-labelledby': 'input-slider',
                }}
            />
            </Grid>
        </Grid>
        </div>
    );
}

const styles={
    root:{
        '&$checked':{
        color: PRIMARY_COLOR,
        }
    },
    checked:{}
}

const CustomCheckbox = withStyles(styles)(Checkbox);
