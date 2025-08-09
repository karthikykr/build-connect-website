'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  MapPin, 
  Search, 
  Crosshair, 
  Navigation,
  Loader2
} from 'lucide-react';

interface MapSelectorProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    address?: string;
  }) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
  className?: string;
  height?: string;
}

interface GoogleMapsWindow extends Window {
  google?: {
    maps: {
      Map: any;
      Marker: any;
      Geocoder: any;
      places: {
        Autocomplete: any;
        PlacesService: any;
      };
      event: {
        addListener: (instance: any, eventName: string, handler: Function) => void;
      };
      LatLng: any;
    };
  };
}

declare const window: GoogleMapsWindow;

export function MapSelector({ 
  onLocationSelect, 
  initialLocation = { latitude: 12.9716, longitude: 77.5946 }, // Bangalore default
  className = '',
  height = '400px'
}: MapSelectorProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [geocoder, setGeocoder] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  // Initialize Google Maps
  const initializeMap = useCallback(() => {
    if (!window.google || !mapRef.current) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: selectedLocation.latitude, lng: selectedLocation.longitude },
      zoom: 15,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: false,
    });

    const markerInstance = new window.google.maps.Marker({
      position: { lat: selectedLocation.latitude, lng: selectedLocation.longitude },
      map: mapInstance,
      draggable: true,
      title: 'Selected Location',
    });

    const geocoderInstance = new window.google.maps.Geocoder();

    // Handle map clicks
    window.google.maps.event.addListener(mapInstance, 'click', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      markerInstance.setPosition({ lat, lng });
      setSelectedLocation({ latitude: lat, longitude: lng });
      
      // Reverse geocode to get address
      geocoderInstance.geocode(
        { location: { lat, lng } },
        (results: any[], status: string) => {
          if (status === 'OK' && results[0]) {
            onLocationSelect({
              latitude: lat,
              longitude: lng,
              address: results[0].formatted_address,
            });
          } else {
            onLocationSelect({ latitude: lat, longitude: lng });
          }
        }
      );
    });

    // Handle marker drag
    window.google.maps.event.addListener(markerInstance, 'dragend', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      setSelectedLocation({ latitude: lat, longitude: lng });
      
      // Reverse geocode to get address
      geocoderInstance.geocode(
        { location: { lat, lng } },
        (results: any[], status: string) => {
          if (status === 'OK' && results[0]) {
            onLocationSelect({
              latitude: lat,
              longitude: lng,
              address: results[0].formatted_address,
            });
          } else {
            onLocationSelect({ latitude: lat, longitude: lng });
          }
        }
      );
    });

    setMap(mapInstance);
    setMarker(markerInstance);
    setGeocoder(geocoderInstance);
    setIsLoading(false);
  }, [selectedLocation, onLocationSelect]);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, [initializeMap]);

  // Search for location
  const handleSearch = async () => {
    if (!geocoder || !searchQuery.trim()) return;

    setIsSearching(true);
    
    geocoder.geocode(
      { address: searchQuery },
      (results: any[], status: string) => {
        setIsSearching(false);
        
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();
          
          // Update map and marker
          map.setCenter({ lat, lng });
          marker.setPosition({ lat, lng });
          setSelectedLocation({ latitude: lat, longitude: lng });
          
          onLocationSelect({
            latitude: lat,
            longitude: lng,
            address: results[0].formatted_address,
          });
        } else {
          console.error('Geocoding failed:', status);
        }
      }
    );
  };

  // Get current location
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported');
      return;
    }

    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Update map and marker
        if (map && marker) {
          map.setCenter({ lat, lng });
          marker.setPosition({ lat, lng });
        }
        
        setSelectedLocation({ latitude: lat, longitude: lng });
        
        // Reverse geocode to get address
        if (geocoder) {
          geocoder.geocode(
            { location: { lat, lng } },
            (results: any[], status: string) => {
              setIsLoading(false);
              
              if (status === 'OK' && results[0]) {
                onLocationSelect({
                  latitude: lat,
                  longitude: lng,
                  address: results[0].formatted_address,
                });
              } else {
                onLocationSelect({ latitude: lat, longitude: lng });
              }
            }
          );
        } else {
          setIsLoading(false);
          onLocationSelect({ latitude: lat, longitude: lng });
        }
      },
      (error) => {
        setIsLoading(false);
        console.error('Error getting current location:', error);
      }
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Select Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <Input
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            variant="outline"
            size="sm"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
          <Button
            onClick={handleCurrentLocation}
            disabled={isLoading}
            variant="outline"
            size="sm"
            title="Use current location"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Map Container */}
        <div className="relative">
          <div
            ref={mapRef}
            style={{ height }}
            className="w-full rounded-lg border border-gray-200"
          />
          
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading map...</span>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <Crosshair className="w-4 h-4" />
          Click on the map or drag the marker to select a location
        </div>

        {/* Selected Coordinates */}
        {selectedLocation && (
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <strong>Selected:</strong> {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
