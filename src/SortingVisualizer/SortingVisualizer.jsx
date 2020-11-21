import React from 'react';
import { getMergeSortAnimations } from '../SortingAlgorithms/SortingAlgorithms.js';
import './SortingVisualizer.css';

// Change this value for the speed of the animations.
const ANIMATION_SPEED_MS = 1;

// Change this value for the number of bars (value) in the array.
const NUMBER_OF_ARRAY_BARS = 500;

// This is the main color of the array bars.
const PRIMARY_COLOR = '#4054d6';

// This is the color of array bars that are being compared throughout the animations.
const SECONDARY_COLOR = '#1f2e92';

let pauseFrame = 0;

//Running is true from the time animation is started until it is stopped
//Stays true when paused
let running = false;

let pause = false;
let animations = [];
let maxFrames = 0;

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
        const array = [];
        this.timeouts = [];
        this.timeoutsClear = [];
        animations = [];
        pauseFrame = 0;
        maxFrames = 0;
        pause = false;
        running = false;

        for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
            array.push(randomIntFromInterval(5, 450));
        }
        this.setState({ array });
    }

    enableButtons(){
        //Static NodeList of all buttons to toggle
        const buttons = document.querySelectorAll('.lock');

        //Enable buttons
        for (let btn of buttons){
            btn.disabled = false;
        }
    }

    disableButtons(){
        //Static NodeList of all buttons to toggle
        const buttons = document.querySelectorAll('.lock');
        
        //Disable buttons
        for (let btn of buttons){
            btn.disabled = true;
        }
    }

    mergeSort() {
        this.disableButtons();
        running = true;

        //Don't get new animations if resuming
        if (animations.length === 0) animations = getMergeSortAnimations(this.state.array);
        
        //Reset async animations
        this.timeouts = [];
        this.timeoutsClear = [];

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
        
                    //On last frame:
                    if (i === animations.length -1){
                        this.enableButtons();
                        animations = [];
                        maxFrames = 0;
                        running = false;
                        console.log("Animation Finished");
                    }

                    //console.log("AnimPlayed");
                }, (i-pauseFrame) * ANIMATION_SPEED_MS));
            }

            this.timeoutsClear.push(setTimeout(() => {
                //Clears completed setTimeout, then removes from timeouts array
                clearTimeout(this.timeouts[0]);
                this.timeouts.shift();

                //console.log("AnimCleared");
            }, (i-pauseFrame) * ANIMATION_SPEED_MS +  ANIMATION_SPEED_MS));

            //console.log(this.timeouts);
        }
        //Doesn't update when calling resume, since the length will be shorter
        //since it is building timeouts from just the pause point
        if (this.timeouts.length > maxFrames) maxFrames = this.timeouts.length;
    }

    pauseAnim(){
        //Only pause while running
        if (running === true){
            console.log("Pause");
            pause = true;
            pauseFrame = maxFrames - this.timeouts.length;

            //Iterates through all frames and clears them
            for (let i = 0; i < this.timeouts.length; i++) {
                clearTimeout(this.timeouts[i]);
            }
            this.timeouts = [];

            //Iterates through all frames and clears them
            for (let i = 0; i < this.timeoutsClear.length; i++) {
                clearTimeout(this.timeoutsClear[i]);
            }
            this.timeoutsClear = [];

            console.log("pauseFrame");
            console.log(pauseFrame);

            this.enableButtons();
        }
    }

    playAnim(){
        //Act as a resume button if paused
        if (pause === true){
            console.log("Resuming on frame ");
            console.log(pauseFrame);
            pause = false;

            this.mergeSort();
        }
        //Start button, initiate selected sorting algorithm
        else if (running === false) {
             //Get the drop down menu
             let input = document.querySelector("#test");
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
    }

    render() {
        const { array } = this.state;

        return (
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
                
                <button className="lock" onClick={() => this.resetArray()}>Generate New Array</button>

                <select className="lock" id="test">
                    <option value="1">Merge Sort</option>
                    <option value="2">Quick Sort</option>
                    <option value="3">Bubble Sort</option>
                    <option value="4">Insertion Sort</option>
                </select>

                <button onClick={() => this.playAnim()}>Play</button>

                <button onClick={() => this.pauseAnim()}>Pause</button>

                <button onClick={() => this.getInfo()}>Info</button>
            </div>
        );
    }
}
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}