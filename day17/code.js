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



// to reach as high as possible, y velocity has to be positive
// x velocity need to be as low as possible, but still reach the target area


// find minimum number of steps required to reach target area
// the higher initial y velocity, the more steps it will take
// to fall to the target area
// here 0 y velocity is used to find the minimum number of steps,
// though some higher value will be more useful
let minNumberOfSteps = 0;
let yPosition = 0;
let yVelocity = 0;

while (yPosition > topY) {

  yPosition -= minNumberOfSteps;
  yVelocity--;
  minNumberOfSteps++;
}

console.log('Minimum number of steps:', minNumberOfSteps);



// find a range of possible x velocities
let minXVelocity = 0;
let maxXVelocity = 0;

// for the minimum, it is possible to count "backwards"
// to reach the target area, the initial velocity has to be at least
// enough that the sum of the distance added in each step
// is equal to or greater than the near border of the target area
let xPosition = 0;

for (let xVelocity = 0; xPosition < nearX; xVelocity++) {

  // find minimum x velocity
  xPosition += xVelocity;
  minXVelocity = xVelocity;
}

console.log('Minimum X velocity:', minXVelocity);


// find maximum x velocity

// since we know the minimum number of steps to fall to the target area,
// we can now determine the highest x velocity that doesn't overshoot

// first, calculate the loss in distance traveled due to drag
let lossToDrag = 0;

for (let i = 0; i < minNumberOfSteps; i++) {

  lossToDrag += i;
}

// add this to the far x border
const maxDistance = farX + lossToDrag

console.log('Loss to drag:', lossToDrag, 'Maximum distance:', maxDistance);

// divide this distance with the minimum number of steps, to get the highest possible x velocity
maxXVelocity = Math.floor(maxDistance / minNumberOfSteps);

console.log('Maximum X velocity:', maxXVelocity);


// find a range of useful y velocities
// negative y velocities are not useful, so minimum y velocity is somewhat naively set to 0
const minYVelocity = 0;

// maximum y velocity is a bit more complicated, but all positive initial velocities will
// make the probe go up to its maximal height, and then fall downwards
// the probe will always make a stop at 0, in step (initial y velocity) * 2 + 1
// the next step will have a velocity equal to -(initial y velocity) - 1
// this means that an initial y velocitiy greater than the absolute value
// of the bottom border of the target area will always fail
const maxYVelocity = Math.abs(bottomY);

console.log('Maximum Y velocity:', maxYVelocity);


// try all possible combinations of x velocities and y velocities
let bestMaxY = 0;

for (let xVelocity = minXVelocity; xVelocity <= maxXVelocity; xVelocity++) {

  for (let yVelocity = minYVelocity; yVelocity <= maxYVelocity; yVelocity++) {

    // initiate variables for this run
    let maxY = 0;
    let xPosition = 0;
    let yPosition = 0;
    let currentXVelocity = xVelocity;
    let currentYVelocity = yVelocity;
    let inTargetArea = false;

    // run this test until target area has been reached or overshot
    while (true) {

      // update max Y in this test run
      if (yPosition > maxY) {

        maxY = yPosition;
      }

      // check if the probe is in the target area
      if (xPosition >= nearX && xPosition <= farX && yPosition <= topY && yPosition >= bottomY) {

        // mark this test as a success
        inTargetArea = true;

        // check if this combination of velocities is better than the best so far
        if (maxY > bestMaxY) {

          bestMaxY = maxY;
        }

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
      // skip testing higher y velocities for this x velocity
      break;
    }
  }
}

console.log('Best max Y', bestMaxY);
