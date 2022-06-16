const BubbleSort = (bars_state) => {
    // Make a copy of the state to work on
    let bars_temp = [...bars_state];
    let animationFrames = [];

    for(var i = 0; i < bars_temp.length; i++){
        for(var j = 0; j < ( bars_temp.length - i -1 ); j++){
            if(bars_temp[j].height > bars_temp[j+1].height){
                let temp = bars_temp[j];
                bars_temp[j] = bars_temp[j+1];
                bars_temp[j+1] = temp;
                
                // Push the swap frame
                animationFrames.push({
                    i: j,
                    j: j+1,
                })
            }
        }
    }

    return animationFrames;
}

export default BubbleSort