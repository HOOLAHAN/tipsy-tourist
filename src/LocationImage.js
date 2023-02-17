async function LocationImage(photo_reference) {
  const resp = await fetch(`http://localhost:4000/location_image`, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      
    },

    //make sure to serialize your JSON body
    body: JSON.stringify({ photo_reference: photo_reference })
  });

  const data = await resp
  console.log(data);
  return data;
}

// LocationImage('ARywPAIoaE7UlpNIKImvFxvlK_IIQJ3CWc63uhZ_VpJnJ3GgFgnlzEb0c4GwMSKv848mUQ7Jslly0a112RhqvhFOJGklA6ncPt8ZD6ZC9tForddfMCKZWL6sN_hy3I5JdkIy2Yg56lW95nSGWdaFLePYq5EEbHs2PVjxnAh9-4gEQj8QXc1B')
// module.exports = LocationImage;
export default LocationImage;

