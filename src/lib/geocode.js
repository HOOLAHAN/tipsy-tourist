// src/lib/geocode.js

const geocode = async (address) => {
  try {
    // Construct the URL for your API endpoint
    const url = `https://t5jalxqqsb.execute-api.eu-west-2.amazonaws.com/geocode`;

    // Prepare the request body with the address
    const body = JSON.stringify({ address });

    // Make a POST request to your geocode endpoint
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    // Check if the fetch request was successful
    if (!response.ok) {
      // If the response was not OK, throw an error
      throw new Error(`Failed to fetch geocode: ${response.statusText}`);
    }

    // Parse the response body as JSON to get the location
    const jsonResponse = await response.json();

    // Extract lat and lng from the response
    const { lat, lng } = jsonResponse.location;

    // Return an array with lat and lng
    return [lat, lng];
  } catch (error) {
    // Log the error to the console
    console.error('Error fetching geocode:', error);

    // Optionally, handle the error more gracefully in your UI
    return [null, null]; // Indicate failure
  }
};

export default geocode;
