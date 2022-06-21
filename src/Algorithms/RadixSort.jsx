
const getNum = (num, index) => {
    const strNum = String(num);
    let end = strNum.length - 1;
    const foundNum = strNum[end - index];
  
    if (foundNum === undefined) return 0;
    else return foundNum;
};

const largestNum = arr => {
    let largest = "0";

    arr.forEach(num => {
        const strNum = String(num.height);

        if (strNum.length > largest.length) largest = strNum;
    });

    return largest.length;
};

const animatedFlatten = (buckets, animationFrames) => {
    let flattened = [];
    let current_index = 0;

    buckets.forEach((bucket) => {
        bucket.forEach((item) => {
            flattened.push(item);

            animationFrames.push({
                type: "Replace",
                i: current_index, 
                val: item.height,
            })

            current_index++;
        })
    })

    return [flattened, animationFrames];

}

const getRadixSortAnimations = (bars_state, highlightEnabled) => {
    let bars = [...bars_state]
    let maxLength = largestNum(bars);
    let animationFrames = [];

    for (let i = 0; i < maxLength; i++) {
        let buckets = Array.from({ length: 10 }, () => []);

        for (let j = 0; j < bars.length; j++) {
            // Animate the highlight of each index
            if (true) {
                animationFrames.push({
                    type: "Highlight",
                    indexes: [j],
                })
            }

            let num = getNum(bars[j].height, i);

            if (num !== undefined) {
                buckets[num].push(bars[j]);
            }
        };
        
        let result = animatedFlatten(buckets, animationFrames)
        bars = result[0];
        animationFrames = result[1];
    };

    return animationFrames;
};

export default getRadixSortAnimations;