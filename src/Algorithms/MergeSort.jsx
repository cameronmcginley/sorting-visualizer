const getMergeSortanimationFrames = (bars_state, highlightEnabled) => {
  // Work on a copy of the state
  let bars = [...bars_state];

  const animationFrames = [];
  if (bars.length <= 1) return bars;
  const auxBars = bars.slice();

  mergeSort(
    bars,
    auxBars,
    animationFrames,
    0,
    bars.length - 1,
    highlightEnabled
  );

  return animationFrames;
};

const mergeSort = (
  bars,
  auxBars,
  animationFrames,
  firstIndex,
  lastIndex,
  highlightEnabled
) => {
  // Base case, only merge/sort if 2 or more vals
  if (firstIndex === lastIndex) return;

  const midIndex = Math.floor((firstIndex + lastIndex) / 2);

  // Basic merge sort, split bars array in half and sort
  mergeSort(
    auxBars,
    bars,
    animationFrames,
    firstIndex,
    midIndex,
    highlightEnabled
  );
  mergeSort(
    auxBars,
    bars,
    animationFrames,
    midIndex + 1,
    lastIndex,
    highlightEnabled
  );

  // Merge the two halves
  merge(
    bars,
    auxBars,
    animationFrames,
    firstIndex,
    midIndex,
    lastIndex,
    highlightEnabled
  );
};

const merge = (
  bars,
  auxBars,
  animationFrames,
  firstIndex,
  midIndex,
  lastIndex,
  highlightEnabled
) => {
  // aux array
  let i = firstIndex;
  let j = midIndex + 1;

  // main array, pts to index to replace
  // after comparison on aux
  let k = firstIndex;

  // push until one array is empty
  while (i <= midIndex && j <= lastIndex) {
    // Change color of bars we're looking at
    if (highlightEnabled) {
      animationFrames.push({
        type: "Highlight",
        indexes: [i, j],
      });
    }

    // Push the smaller val from aux array into main array
    if (auxBars[i].height <= auxBars[j].height) {
      animationFrames.push({
        type: "Replace",
        i: k,
        val: auxBars[i].height,
      });
      // Swap them and incrememnt the indices after
      bars[k++] = auxBars[i++];
    } else {
      animationFrames.push({
        type: "Replace",
        i: k,
        val: auxBars[j].height,
      });
      bars[k++] = auxBars[j++];
    }
  }

  // if any remainder if first half
  while (i <= midIndex) {
    // hightlight bar being looked at
    if (highlightEnabled) {
      animationFrames.push({
        type: "Highlight",
        indexes: [i],
      });
    }

    // push remainders from aux
    animationFrames.push({
      type: "Replace",
      i: k,
      val: auxBars[i].height,
    });
    bars[k++] = auxBars[i++];
  }

  // if any remainder in second half
  // same process as for first half
  while (j <= lastIndex) {
    if (highlightEnabled) {
      animationFrames.push({
        type: "Highlight",
        indexes: [j],
      });
    }

    animationFrames.push({
      type: "Replace",
      i: k,
      val: auxBars[j].height,
    });
    bars[k++] = auxBars[j++];
  }
};

export default getMergeSortanimationFrames;
