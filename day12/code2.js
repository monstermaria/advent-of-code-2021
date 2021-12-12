const fs = require('fs/promises');
const { start } = require('repl');

// const inputPromise = fs.readFile('./test-input.txt', 'utf-8');
const inputPromise = fs.readFile('./input.txt', 'utf-8');

const buildConnectionsTree = (inputData) => {

  // prepare the input data
  const connections = inputData.split('\n');
  const connectionInformation = {};

  console.log(connections);

  for (const connection of connections) {

    const [pointA, pointB] = connection.split('-');

    if (pointA && pointB) {

      if (!connectionInformation[pointA]) {

        // there is no entry for point A, add one now
        connectionInformation[pointA] = [];
      }

      // add the new connection information
      connectionInformation[pointA].push(pointB);

      if (!connectionInformation[pointB]) {

        // there is no entry for point B, add one now
        connectionInformation[pointB] = [];
      }

      // add the new connection information
      connectionInformation[pointB].push(pointA);
    }
  }

  console.log(connectionInformation);

  return connectionInformation;
};

const findAllRoutesRecursively = (currentPoint, connectionTree, route, routes, doubleSmallInRoute) => {

  // traverse the tree and register all legal routes

  // when the end point has been reached, the route should be added to routes
  if (currentPoint === 'end') {

    // make a copy of route and add the current point
    const fullRoute = route.slice();

    fullRoute.push(currentPoint);

    // add full route to routes
    routes.push(fullRoute);

    return;
  }

  // handle points already in the route
  if (route.indexOf(currentPoint) > -1) {

    // start can only be visited one time
    if (currentPoint === 'start') {

      // discard this route
      return;
    }

    // only one point described by small letters can be visited twice, all others will be discarded
    if (currentPoint === currentPoint.toLowerCase() ) {

      if (doubleSmallInRoute) {

        // discard this route
        return;

      } else {

        // allow this double small to pass, but mark all others as illegal
        doubleSmallInRoute = true;
      }
    }
  }

  // explore all possible paths from this point
  for (let i = 0; i < connectionTree[currentPoint].length; i++) {

    const nextPoint = connectionTree[currentPoint][i];

    // make a copy of route and add the current point
    const subRoute = route.slice();

    subRoute.push(currentPoint);

    // pass it on to the next iteration
    findAllRoutesRecursively(nextPoint, connectionTree, subRoute, routes, doubleSmallInRoute);
  }
};

const handleStringResult = (result) => {

  const connectionsTree = buildConnectionsTree(result);
  const routes = [];

  findAllRoutesRecursively('start', connectionsTree, [], routes, false);

  console.log(routes.length);
};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });
