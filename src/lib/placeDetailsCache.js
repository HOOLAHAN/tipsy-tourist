import details from "./details";

const placeDetailsCache = new Map();

export async function getCachedPlaceDetails(placeId) {
  if (!placeId) return null;

  if (!placeDetailsCache.has(placeId)) {
    placeDetailsCache.set(
      placeId,
      details(placeId)
        .then((response) => response?.result || null)
        .catch((error) => {
          placeDetailsCache.delete(placeId);
          throw error;
        })
    );
  }

  return placeDetailsCache.get(placeId);
}
