const apiKey = require("./apiKey")

async function Locations() {
  const resp = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=51.501476%2C-0.140634&radius=1000&keyword=bar&rankby=prominence&key=${apiKey}`
  )
  const data = await resp.json()
  console.log(data)
  return data
}

//Locations()

module.exports = Locations;

