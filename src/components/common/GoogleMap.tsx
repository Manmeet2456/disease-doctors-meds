
import React, { useEffect, useRef } from 'react';

// Add TypeScript declaration for the google global namespace
declare global {
  interface Window {
    google: {
      maps: {
        Map: typeof google.maps.Map;
        MapOptions: google.maps.MapOptions;
        Marker: typeof google.maps.Marker;
        LatLngBounds: typeof google.maps.LatLngBounds;
        InfoWindow: typeof google.maps.InfoWindow;
        Animation: {
          DROP: number;
        };
        SymbolPath: {
          CIRCLE: number;
        };
      };
    };
  }
}

interface GoogleMapProps {
  apiKey: string;
  locations: {
    lat: number;
    lng: number;
    title: string;
  }[];
}

const GoogleMap = ({ apiKey, locations = [] }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Load Google Maps API if not already loaded
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', initializeMap);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', initializeMap);
    };
  }, [apiKey]);

  // Re-initialize markers when locations change
  useEffect(() => {
    if (mapInstanceRef.current && locations.length > 0) {
      addMarkers();
    }
  }, [locations]);

  const initializeMap = () => {
    if (!mapRef.current) return;

    const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco
    const center = locations.length > 0 ? { lat: locations[0].lat, lng: locations[0].lng } : defaultCenter;

    const mapOptions: google.maps.MapOptions = {
      center,
      zoom: 12,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi.medical',
          elementType: 'labels.icon',
          stylers: [{ color: '#1047BA' }, { weight: 2 }]
        },
        {
          featureType: 'poi.medical',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#1047BA' }]
        }
      ]
    };

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);
    
    // Add markers once the map is initialized
    if (locations.length > 0) {
      addMarkers();
    }
  };

  const addMarkers = () => {
    if (!mapInstanceRef.current) return;

    const bounds = new window.google.maps.LatLngBounds();
    const infoWindow = new window.google.maps.InfoWindow();

    locations.forEach((location) => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: mapInstanceRef.current,
        title: location.title,
        animation: window.google.maps.Animation.DROP,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#1047BA',
          fillOpacity: 0.9,
          scale: 8,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });

      marker.addListener('click', () => {
        infoWindow.setContent(`<div class="p-2"><strong>${location.title}</strong></div>`);
        infoWindow.open(mapInstanceRef.current, marker);
      });

      bounds.extend(marker.getPosition()!);
    });

    // Fit map to show all markers
    if (locations.length > 1) {
      mapInstanceRef.current.fitBounds(bounds);
    }
  };

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-md">
      {!apiKey ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-center p-4">
            <p className="text-lg font-semibold text-gray-800">Google Maps API Key Required</p>
            <p className="text-sm text-gray-600">Please connect your Supabase project and add your Google Maps API key in the Supabase Edge Function Secrets.</p>
          </div>
        </div>
      ) : (
        <div ref={mapRef} className="w-full h-full" />
      )}
    </div>
  );
};

export default GoogleMap;
