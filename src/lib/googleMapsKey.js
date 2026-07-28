const developmentKey =
  process.env.REACT_APP_TIPSY_TOURIST_GOOGLE_MAPS_KEY_DEVELOPMENT ||
  window.REACT_APP_TIPSY_TOURIST_GOOGLE_MAPS_KEY_DEVELOPMENT;

const productionKey =
  process.env.REACT_APP_TIPSY_TOURIST_GOOGLE_MAPS_KEY_PRODUCTION ||
  window.REACT_APP_TIPSY_TOURIST_GOOGLE_MAPS_KEY_PRODUCTION;

export const googleMapsApiKey =
  process.env.NODE_ENV === "production" ? productionKey : developmentKey;
