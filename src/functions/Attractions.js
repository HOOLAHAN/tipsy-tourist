async function Attractions(lat, lng) {
  const resp = await fetch("https://t5jalxqqsb.execute-api.eu-west-2.amazonaws.com/attractions", {
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
  return data.data;
}

export default Attractions;
