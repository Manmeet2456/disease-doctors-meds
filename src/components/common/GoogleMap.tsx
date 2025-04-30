
import React from 'react';

interface Location {
  lat: number;
  lng: number;
  title?: string;
}

interface GoogleMapProps {
  apiKey?: string;
  locations: Location[];
  height?: string;
  zoom?: number;
}

// This component is disabled as Google Maps API support is removed
const GoogleMap = ({ locations = [], height = '400px', zoom = 13 }: GoogleMapProps) => {
  return (
    <div 
      style={{ height, width: '100%', borderRadius: '0.5rem', overflow: 'hidden', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <p className="text-gray-500">Maps functionality has been disabled</p>
    </div>
  );
};

export default GoogleMap;
