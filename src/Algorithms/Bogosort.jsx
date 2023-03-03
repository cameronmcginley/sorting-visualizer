const isSorted = (bars) => {
  for (let i = 1; i < bars.length; i++) {
    if (bars[i].height < bars[i-1].height) {
      return false
    }
  }
  return true
}

const getBogosortAnimations = (bars_state) => {
  // Make a copy of the state to work on
  let bars = [...bars_state];
  let animationFrames = [];

  console.log("starting")
  console.log(bars)
  while(!isSorted(bars)) {
    // Scrambles with Fisher Yates algo
    let currentIndex = bars.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [bars[currentIndex], bars[randomIndex]] = [
        bars[randomIndex], bars[currentIndex]];
    }

    // Push the frame
    console.log("frame i")
    console.log(bars[0].height)
    animationFrames.push({
      type: "Rebuild",
      newBars: [...bars],
    });

    if (animationFrames.length > 10000) {
      return "error"
    }
  }

  return animationFrames;
};

export default getBogosortAnimations;
