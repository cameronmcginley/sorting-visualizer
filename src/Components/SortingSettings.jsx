import React from "react";
import "../App.css";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Button,
  Input,
  Slider,
  Grid,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";

export default function SortingSettings(props) {
  return (
    <>
      {/* Settings */}
      <Paper variant="outlined" className="visualizer-settings">
        <div className="visualizer-settings-buttons">
          {/* Play animation */}
          <Button
            className="visualizer-setting"
            onClick={() => {
              props.playAnimation();
            }}
            disabled={props.isPlaying}
            variant="outlined"
          >
            Play
          </Button>

          {/* Pause animation */}
          <Button
            className="visualizer-setting"
            onClick={() => {
              props.pauseAnim();
            }}
            disabled={props.isPaused}
            variant="outlined"
          >
            Pause
          </Button>

          {/* Generate array */}
          <Button
            className="visualizer-setting"
            onClick={() => {
              props.generateArray();
            }}
            // disabled={isPlaying}
            variant="outlined"
            disabled={props.isPlaying}
          >
            Regenerate
          </Button>

          {/* Sorting type selecter */}
          <FormControl sx={{ m: 1, minWidth: 80 }}>
            <InputLabel id="demo-simple-select-autowidth-label">
              Sorting Algorithm
            </InputLabel>
            <Select
              className="visualizer-setting"
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={props.sortType}
              onChange={(e) => {
                props.setSortType(e.target.value);
              }}
              autoWidth
              label="Sorting Algorithm"
              disabled={props.isPlaying}
            >
              <MenuItem value={"RadixSort"}>Radix Sort</MenuItem>
              <MenuItem value={"BubbleSort"}>Bubble Sort</MenuItem>
              <MenuItem value={"MergeSort"}>Merge Sort</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="visualizer-settings-options">
          {/* Bar count slider/input */}
          <p className="slider-text">Array Size</p>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <Slider
                className="visualizer-settings-slider"
                value={props.barCount}
                onChange={(e) => {
                  // Don't keep updating if sliding past MAX_BARS
                  if (
                    e.target.value === props.MAX_BARS[props.sortType] &&
                    props.barCount === props.MAX_BARS[props.sortType]
                  ) {
                    return;
                  }
                  props.setBarCount(e.target.value);
                }}
                max={props.MAX_BARS[props.sortType]}
                min={5}
                disabled={props.isPlaying}
              />
            </Grid>
            <Grid item>
              <Input
                className="visualizer-settings-slider"
                value={props.barCount}
                size="small"
                onChange={(e) => {
                  props.setBarCount(e.target.value);
                }}
                // onBlur={handleBlur}
                inputProps={{
                  step: 10,
                  min: 5,
                  max: props.MAX_BARS[props.sortType],
                  type: "number",
                }}
                disabled={props.isPlaying}
              />
            </Grid>
          </Grid>

          {/* Delay slider/input */}
          <p className="slider-text">Delay (ms)</p>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <Slider
                className="visualizer-setting"
                value={props.delay}
                onChange={(e) => {
                  // Don't keep updating if sliding past MAX_BARS
                  if (
                    e.target.value === props.MAX_DELAY &&
                    props.delay === props.MAX_DELAY
                  ) {
                    return;
                  }
                  props.setDelay(e.target.value);
                }}
                max={props.MAX_DELAY}
                min={1}
                disabled={props.isPlaying}
              />
            </Grid>
            <Grid item>
              <Input
                className="visualizer-setting"
                value={props.delay}
                size="small"
                onChange={(e) => {
                  props.setDelay(e.target.value);
                }}
                // onBlur={handleBlur}
                inputProps={{
                  step: 1,
                  min: 1,
                  max: props.MAX_DELAY,
                  type: "number",
                }}
                disabled={props.isPlaying}
              />
            </Grid>
          </Grid>

          {/* Uniform/perfect array */}
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  className="visualizer-setting"
                  checked={props.doPerfectArray}
                  onChange={async () => {
                    // Use above useEffect to regen array on state change
                    props.setDoPerfectArray(!props.doPerfectArray);
                  }}
                  disabled={props.isPlaying}
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
                  className="visualizer-setting"
                  checked={props.soundEnabled}
                  onChange={async () => {
                    // Use above useEffect to regen array on state change
                    props.setSoundEnabled(!props.soundEnabled);
                  }}
                  // disabled={isPlaying}
                />
              }
              label="Enable Sounds"
            />
          </FormGroup>

          {/* Color */}
          {/* <FormGroup>
                    <FormControlLabel 
                        control={
                            <Checkbox
                                className='visualizer-setting'
                                checked={highlightEnabled}
                                onChange={async () => {
                                    // Use above useEffect to regen array on state change
                                    setHighlightEnabled(!highlightEnabled)
                                }}
                                // disabled={isPlaying}
                            />
                        }
                        label="Enable Color on Comparison" 
                    />
                </FormGroup> */}
        </div>
      </Paper>
    </>
  );
}
