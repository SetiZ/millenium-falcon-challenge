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
const url = 'http://localhost:3000/routes'
fetch(url, {
  method: 'GET',
  headers: {'Content-Type': 'application/json'}
}).then(res => res.json())
.then((data) => {
  console.log(data)
})


async function fetchURLs() {
  try {
    let [routes, autonomy, departure, arrival] = await Promise.all([
      fetch('http://localhost:3000/routes').then((response) => response.json()),
      fetch('http://localhost:3000/autonomy').then((response) => response.json()),
      fetch('http://localhost:3000/departure').then((response) => response.json()),
      fetch('http://localhost:3000/arrival').then((response) => response.json())
    ]);

    console.log(routes.data, autonomy, departure, arrival)

  } catch (error) {
    console.log(error);
  }
}

fetchURLs()