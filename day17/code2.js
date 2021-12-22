// // test input
// const nearX = 20;
// const farX = 30;

// const topY = -5;
// const bottomY = -10;


// my input
const nearX = 128;
const farX = 160;

const topY = -88;
const bottomY = -142;



// to find every possible combination of initial x and y velocities
// both negative and positive y velocities must be considered
// x velocity must be positive, and can be as high as far x



// find a range of possible x velocities

// min x velocity is 1. 0 or negative x velocity will never reach the target area
let minXVelocity = 1;

// the highest possible x velocity that doesn't overshoot in the first step is far x
let maxXVelocity = farX;


// find a range of possible y velocities

// min y velocity is bottom y, any more negative velocity will overshoot in the first step
let minYVelocity = bottomY;

// maximum y velocity is a bit more complicated, but all positive initial velocities will
// make the probe go up to its maximal height, and then fall downwards
// the probe will always make a stop at 0, in step (initial y velocity) * 2 + 1
// the next step will have a velocity equal to -(initial y velocity) - 1
// this means that an initial y velocitiy greater than the absolute value
// of the bottom border of the target area will always fail
const maxYVelocity = Math.abs(bottomY);


// find all possible combinations of x velocities and y velocities
let numberOfPossibleCombinations = 0;

for (let xVelocity = minXVelocity; xVelocity <= maxXVelocity; xVelocity++) {

  for (let yVelocity = minYVelocity; yVelocity <= maxYVelocity; yVelocity++) {

    // initiate variables for this run
    let xPosition = 0;
    let yPosition = 0;
    let currentXVelocity = xVelocity;
    let currentYVelocity = yVelocity;
    let inTargetArea = false;

    // run this test until target area has been reached or overshot
    while (true) {

      // check if the probe is in the target area
      if (xPosition >= nearX && xPosition <= farX && yPosition <= topY && yPosition >= bottomY) {

        // mark this test as a success
        inTargetArea = true;

        // add this combination to possible combinations
        numberOfPossibleCombinations++;

        // end this test
        break;
      }

      // check if this test run should be ended due to overshoot
      if (xPosition > farX || yPosition < bottomY) {

        break;
      }

      // update position and velocity
      xPosition += currentXVelocity;
      yPosition += currentYVelocity;
      currentXVelocity = currentXVelocity > 0 ? currentXVelocity - 1 : 0;
      currentYVelocity--;
    }

    // determine why this test was ended, and take action accordingly

    // test was a success
    if (inTargetArea) {

      // continue with next test
      continue;
    }

    // test overshot the target area
    if (xPosition > farX && yPosition > topY) {

      // this test passed the target area on the x axis and didn't reach it on the y axis
      // any higher initial y velocity will only make it overshoot even higher
      // this is our time to break out of testing different y velocities
      break;
    }
  }
}

console.log('Number of possible combinations:', numberOfPossibleCombinations);
