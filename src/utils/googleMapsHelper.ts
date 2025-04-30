// This file is kept with minimal functionality since we're removing Google Maps support
// We're keeping the file to prevent import errors, but removing all functionality

export const setGoogleMapsApiKey = (apiKey: string) => {
  // Function kept for backward compatibility but no functionality
  console.warn('Google Maps API support has been removed from this application');
};

export const getGoogleMapsApiKey = (): string => {
  // Return empty string as Google Maps support is removed
  return '';
};

export const hasValidGoogleMapsApiKey = (): boolean => {
  // Always return false as Google Maps support is removed
  return false;
};

export const formatCoordinates = (lat: number | null, lng: number | null) => {
  // Return dummy values as Google Maps support is removed
  return { lat: 0, lng: 0 };
};
