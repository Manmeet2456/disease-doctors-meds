
import React, { useEffect, useRef } from 'react';
import { getGoogleMapsApiKey } from '@/utils/googleMapsHelper';

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

const GoogleMap = ({ locations = [], height = '400px', zoom = 13 }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    // Function to initialize the map
    const initMap = () => {
      if (!window.google || !mapRef.current) return;

      // Default center (first location or San Francisco)
      const center = locations.length > 0 ? 
        { lat: locations[0].lat, lng: locations[0].lng } : 
        { lat: 37.7749, lng: -122.4194 }; // San Francisco

      // Create the map instance
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
      });

      // Add markers for each location
      locations.forEach(location => {
        const marker = new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: mapInstanceRef.current,
          title: location.title || '',
        });

        if (location.title) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div><strong>${location.title}</strong></div>`
          });

          marker.addListener('click', () => {
            infoWindow.open({
              anchor: marker,
              map: mapInstanceRef.current,
            });
          });
        }
      });
    };

    // Load Google Maps API if not already loaded
    const loadGoogleMaps = () => {
      const key = getGoogleMapsApiKey();
      if (!key) return;
      
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initGoogleMap`;
        script.async = true;
        script.defer = true;
        
        window.initGoogleMap = () => {
          initMap();
        };
        
        document.head.appendChild(script);
        return () => {
          document.head.removeChild(script);
          delete window.initGoogleMap;
        };
      } else {
        initMap();
      }
    };

    loadGoogleMaps();
    
    // Update the map when locations change
    if (window.google && mapInstanceRef.current) {
      initMap();
    }
  }, [locations, zoom]);

  return (
    <div 
      ref={mapRef} 
      style={{ height, width: '100%', borderRadius: '0.5rem', overflow: 'hidden' }}
    ></div>
  );
};

export default GoogleMap;
