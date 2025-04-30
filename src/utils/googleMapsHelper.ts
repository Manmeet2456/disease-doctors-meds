
// Store Google Maps API key
let googleMapsApiKey = '';

// Function to set Google Maps API key
export const setGoogleMapsApiKey = (apiKey: string) => {
  googleMapsApiKey = apiKey;
  localStorage.setItem('googleMapsApiKey', apiKey);
};

// Function to get Google Maps API key
export const getGoogleMapsApiKey = (): string => {
  if (!googleMapsApiKey) {
    googleMapsApiKey = localStorage.getItem('googleMapsApiKey') || '';
  }
  return googleMapsApiKey;
};

// Function to determine if we have a valid Google Maps API key
export const hasValidGoogleMapsApiKey = (): boolean => {
  const apiKey = getGoogleMapsApiKey();
  return apiKey !== null && apiKey.length > 0;
};

// Function to format coordinates for Google Maps
export const formatCoordinates = (lat: number | null, lng: number | null) => {
  if (lat === null || lng === null) {
    return { lat: 0, lng: 0 };
  }
  return { lat, lng };
};
