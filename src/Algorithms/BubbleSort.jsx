const getBubbleSortAnimations = (bars_state) => {
    // Make a copy of the state to work on
    let bars = [...bars_state];
    let animationFrames = [];

    for(var i = 0; i < bars.length; i++){
        for(var j = 0; j < ( bars.length - i -1 ); j++){
            // Push frame for coloring
            animationFrames.push({
                type: "Highlight",
                indexes: [j, j+1]
            })

            if(bars[j].height > bars[j+1].height){
                let temp = bars[j];
                bars[j] = bars[j+1];
                bars[j+1] = temp;
                
                // Push the swap frame
                animationFrames.push({
                    type: "Swap",
                    i: j, 
                    j: j+1,
                })
            }
        }
    }

    return animationFrames;
}

export default getBubbleSortAnimations