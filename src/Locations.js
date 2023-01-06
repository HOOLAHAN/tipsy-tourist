async function Locations(lat, lng) {
  const resp = await fetch("http://localhost:4000/places", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

<<<<<<< HEAD
    //make sure to serialize your JSON body
    body: JSON.stringify({
      lat: lat,
      lng: lng,
    }),
  });

  const data = await resp.json();
  console.log(data);
  return data;
=======
async function Locations() {
  const resp = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=51.501476%2C-0.140634&radius=1000&keyword=bar&rankby=prominence&key=${apiKey}`
  )
  const data = await resp.json()
  console.log(data)
  return data
>>>>>>> main
}

module.exports = Locations;
