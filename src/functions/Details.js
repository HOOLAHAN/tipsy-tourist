async function details(place_id) {
  const resp = await fetch(`https://t5jalxqqsb.execute-api.eu-west-2.amazonaws.com/get-details`, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",      
    },
    //make sure to serialize your JSON body
    body: JSON.stringify({ place_id: place_id })
  });

  const data = await resp.json();
  return data.data;
}

export default details;
