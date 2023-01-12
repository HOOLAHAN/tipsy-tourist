async function Details(place_id) {
  const resp = await fetch(`http://localhost:4000/place_details`, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    //make sure to serialize your JSON body
    body: JSON.stringify({ place_id: place_id })
  });

  const data = await resp.json();
  // console.log(data);
  return data;
}

export default Details;
