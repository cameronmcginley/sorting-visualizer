
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
        console.log("num height: ", num.height)
        const strNum = String(num.height);

        if (strNum.length > largest.length) largest = strNum;
    });

    console.log("largest: ", largest.length)
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

    console.log(bars)

    for (let i = 0; i < maxLength; i++) {
        console.log("i: ", i)
        let buckets = Array.from({ length: 10 }, () => []);
        console.log(buckets)

        for (let j = 0; j < bars.length; j++) {
            console.log("j: ", j)
            // Animate the highlight of each index
            if (true) {
                animationFrames.push({
                    type: "Highlight",
                    indexes: [j],
                })
            }

            // console.log(bars)
            // console.log(bars[j])
            // console.log(bars[j].height)
            let num = getNum(bars[j].height, i);
            // console.log(bars[j].height)
            // console.log("num: ", num)

            if (num !== undefined) {
                buckets[num].push(bars[j]);
            }
        };
        console.log(buckets)
        // bars = buckets.flat();
        let result = animatedFlatten(buckets, animationFrames)
        bars = result[0];
        animationFrames = result[1];
        // Animate the flattening
    };

    return animationFrames;
};

export default getRadixSortAnimations;