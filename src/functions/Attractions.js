async function Attractions(lat, lng) {
  const resp = await fetch("http://localhost:4000/attractions", {
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
  console.log(data);
  return data;
}

export default Attractions;
