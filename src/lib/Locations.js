// src/lib/Locations.js

async function Locations(lat, lng) {
  const resp = await fetch("https://t5jalxqqsb.execute-api.eu-west-2.amazonaws.com/places", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    //make sure to serialize your JSON body
    body: JSON.stringify({
      lat: lat,
      lng: lng,
    }),
  });

  const data = await resp.json();
  // console.log(data);
  return data.data;
}

export default Locations;
