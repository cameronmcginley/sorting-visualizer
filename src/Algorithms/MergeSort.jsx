export default function getMergeSortAnimations(bars_state) {
    // Work on a copy of the state
    let bars = [...bars_state]

    const animations = [];
    if (bars.length <= 1) return bars;
    const auxBars = bars.slice();
    
    mergeSort(bars, auxBars, animations, 0, bars.length-1)

    return animations;
}

function mergeSort(bars, auxBars, animations, firstIndex, lastIndex) {
    // Base case, only merge/sort if 2 or more vals
    if (firstIndex === lastIndex) return;

    const midIndex = Math.floor((firstIndex + lastIndex) / 2);

    // Basic merge sort, split bars array in half and sort
    mergeSort(auxBars, bars, animations, firstIndex, midIndex);
    mergeSort(auxBars, bars, animations, midIndex+1, lastIndex);
    
    // Merge the two halves
    merge(bars, auxBars, animations, firstIndex, midIndex, lastIndex);
}

function merge(bars, auxBars, animations, firstIndex, midIndex, lastIndex) {
    // aux array
    let i = firstIndex;
    let j = midIndex + 1;

    // main array, pts to index to replace
    // after comparison on aux
    let k = firstIndex;

    // push until one array is empty
    while (i <= midIndex && j <= lastIndex) {
        // Change color of bars we're looking at
        animations.push({
            type: "Highlight",
            indexes: [i,j],
        })

        // Push the smaller val from aux array into main array
        if (auxBars[i].height <= auxBars[j].height) {
            animations.push({
                type: "Replace",
                i: k, 
                val: auxBars[i].height,
            })
            // Swap them and incrememnt the indices after
            bars[k++] = auxBars[i++];
        }
        else {
            animations.push({
                type: "Replace",
                i: k,
                val: auxBars[j].height,
            })
            bars[k++] = auxBars[j++];
        }
    }

    // if any remainder if first half
    while (i <= midIndex) {
        // hightlight bar being looked at
        animations.push({
            type: "Highlight",
            indexes: [i],
        });

        // push remainders from aux
        animations.push({
            type: "Replace",
            i: k,
            val: auxBars[i].height,
        })
        bars[k++] = auxBars[i++];
    }

    // if any remainder in second half
    // same process as for first half
    while (j <= lastIndex) {
        animations.push({
            type: "Highlight",
            indexes: [j],
        });

        animations.push({
            type: "Replace",
            i: k,
            val: auxBars[j].height,
        })
        bars[k++] = auxBars[j++];
    }
}