import Geocode from "react-geocode";

const geocode = async (address) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || window.REACT_APP_GOOGLE_MAPS_API_KEY;
  Geocode.setApiKey(apiKey);
  const response = await Geocode.fromAddress(address);

  const { lat, lng } = response.results[0].geometry.location;
  const array = [lat, lng];
  return array;
};

export default geocode;