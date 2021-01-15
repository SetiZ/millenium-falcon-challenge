let odds = 0;
const results = document.getElementById("odds");
const launchButton = document.getElementById("launch");
launchButton.addEventListener("click", (e) => {
  console.log(empire)
  fetchURLs()
}, false)


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

function calculateOdds(route, bountyHunters) {
  console.log(route, bountyHunters)
  if (route.length > 1) { // have to stop at a planet
    odds++
  }

  let time = 0
  for (let i = 0; i < route.length; i ++) {
    time = route[i].travel_time
    bountyHunters.forEach((bounty) => {
      if (bounty.day === time && route[i].destination === bounty.planet) {
        odds++
      }
    })
  }
  return odds
}

function calculatePercent(odd) {
  let calculate = 0
  if (odd > 0) {
    console.log(odd, Math.pow(9, odd-1)/Math.pow(10, odd))
    calculate = (Math.pow(9, odd-1)/Math.pow(10, odd) + calculatePercent(odd-1))
  }
  return calculate
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
      results.innerHTML = 0
    } else {
      console.log("check bounty", timing)
      timing.forEach((odd) => {
        let oddScore = calculateOdds(odd, bountyHunters)
        let finalOdd = 1 - calculatePercent(oddScore);
        results.innerHTML = finalOdd * 100
      })
    }

  } catch (error) {
    console.log(error);
  }
}

// fetchURLs()