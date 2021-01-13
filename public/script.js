const empire = {
  "countdown": 7,
  "bounty_hunters": [
    {
      "planet": "Hoth",
      "day": 6
    },
    {
      "planet": "Hoth",
      "day": 7
    },
    {
      "planet": "Hoth",
      "day": 8
    }
  ]
}
console.log(empire)


function travel(dep, arr, routes) {
  let travelRoute = [];
  let travelRoutes = [];

  let myRoutes = routes.filter((route) => dep === route.origin)
  while (myRoutes.length != 0) {
    let myRoute = myRoutes.shift()
    for (let i = 0; i < routes.length; i ++) {
      if (myRoute.destination === routes[i].origin) {
        travelRoute.push(myRoute)
        travelRoute.push(routes[i])
        if (arr === routes[i].destination) {
          travelRoutes.push(travelRoute)
          travelRoute = []
          break;
        }
      }
    }
  }
  return travelRoutes
}

function checkTime(route, countdown, autonomy) {
  let sum = route.reduce((a, b) => {
    return parseInt(a) + parseInt(b.travel_time)
  }, 0)
  if (sum > autonomy) {
    sum++
  }
  // console.log(sum, countdown)
  return countdown >= sum;
}

async function fetchURLs() {
  try {
    let [routes, autonomyObj, departureObj, arrivalObj] = await Promise.all([
      fetch('http://localhost:3000/routes').then((response) => response.json()),
      fetch('http://localhost:3000/autonomy').then((response) => response.json()),
      fetch('http://localhost:3000/departure').then((response) => response.json()),
      fetch('http://localhost:3000/arrival').then((response) => response.json())
    ]);

    console.log(routes.data)
    const countdown = empire.countdown;
    const bountyHunters = empire.bounty_hunters;
    const autonomy = autonomyObj.autonomy;
    const departure = departureObj.departure;
    const arrival = arrivalObj.arrival;

    console.log(countdown, bountyHunters, departure, arrival, autonomy)

    let travelRoutes = travel(departure, arrival, routes.data);

    console.log(travelRoutes);

    const timing = travelRoutes.filter((route) => {
      return checkTime(route, countdown, autonomy)
    })

    if (timing.length === 0) {
      console.log(0)
    } else {
      console.log("check bounty")
    }

  } catch (error) {
    console.log(error);
  }
}

fetchURLs()