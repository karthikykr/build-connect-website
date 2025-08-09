'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  MapPin, 
  Home, 
  Layers, 
  ZoomIn, 
  ZoomOut,
  RotateCcw,
  Maximize,
  Filter
} from 'lucide-react';
import { Property } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface MapViewProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onPropertySelect?: (property: Property) => void;
  onMapClick?: (lat: number, lng: number) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

// Mock map implementation (in real app, this would use Google Maps or Mapbox)
export function MapView({ 
  properties, 
  selectedProperty, 
  onPropertySelect, 
  onMapClick,
  center = { lat: 12.9716, lng: 77.5946 }, // Bangalore coordinates
  zoom = 11,
  className 
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [currentCenter, setCurrentCenter] = useState(center);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');
  const [showFilters, setShowFilters] = useState(false);

  // Mock property markers data
  const propertyMarkers = properties.map(property => ({
    id: property.id,
    lat: property.location.latitude,
    lng: property.location.longitude,
    property,
  }));

  const handleZoomIn = () => {
    setCurrentZoom(prev => Math.min(prev + 1, 20));
  };

  const handleZoomOut = () => {
    setCurrentZoom(prev => Math.max(prev - 1, 1));
  };

  const handleReset = () => {
    setCurrentCenter(center);
    setCurrentZoom(zoom);
  };

  const handleMarkerClick = (property: Property) => {
    onPropertySelect?.(property);
  };

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (onMapClick) {
      // Mock coordinates calculation
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Convert pixel coordinates to lat/lng (simplified)
      const lat = currentCenter.lat + (y - rect.height / 2) * 0.001;
      const lng = currentCenter.lng + (x - rect.width / 2) * 0.001;
      
      onMapClick(lat, lng);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
      <div 
        ref={mapRef}
        className="w-full h-full bg-gray-light rounded-lg overflow-hidden relative cursor-crosshair"
        onClick={handleMapClick}
        style={{ minHeight: '500px' }}
      >
        {/* Mock Map Background */}
        <div 
          className={`w-full h-full ${
            mapType === 'satellite' 
              ? 'bg-gradient-to-br from-green-800 to-brown-600' 
              : mapType === 'hybrid'
              ? 'bg-gradient-to-br from-green-700 to-gray-600'
              : 'bg-gradient-to-br from-gray-100 to-gray-300'
          }`}
        >
          {/* Grid overlay for roadmap */}
          {mapType === 'roadmap' && (
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#666" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          )}

          {/* Property Markers */}
          {propertyMarkers.map((marker, index) => {
            const isSelected = selectedProperty?.id === marker.property.id;
            
            // Calculate marker position (simplified)
            const x = 50 + (marker.lng - currentCenter.lng) * 1000 * currentZoom;
            const y = 50 + (currentCenter.lat - marker.lat) * 1000 * currentZoom;
            
            return (
              <div
                key={marker.id}
                className={`absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-200 ${
                  isSelected ? 'z-20 scale-110' : 'z-10 hover:scale-105'
                }`}
                style={{ 
                  left: `${Math.max(0, Math.min(100, x))}%`, 
                  top: `${Math.max(0, Math.min(100, y))}%` 
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkerClick(marker.property);
                }}
              >
                {/* Marker Pin */}
                <div className={`relative ${isSelected ? 'animate-bounce' : ''}`}>
                  <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                    isSelected ? 'bg-error' : 'bg-primary'
                  }`}>
                    <Home className="w-4 h-4 text-white" />
                  </div>
                  <div className={`w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent ${
                    isSelected ? 'border-t-error' : 'border-t-primary'
                  } absolute left-1/2 transform -translate-x-1/2`}></div>
                </div>

                {/* Property Info Popup */}
                {isSelected && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64">
                    <Card className="shadow-lg">
                      <CardContent className="p-3">
                        <h4 className="font-semibold text-sm mb-1 line-clamp-1">
                          {marker.property.title}
                        </h4>
                        <p className="text-xs text-text-secondary mb-2 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {marker.property.location.city}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-primary">
                            {formatCurrency(marker.property.price)}
                          </span>
                          <span className="text-xs text-text-secondary">
                            {marker.property.area} {marker.property.unit}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            );
          })}

          {/* Center Marker (for location selection) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
            <MapPin className="w-6 h-6 text-error drop-shadow-lg" />
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        {/* Zoom Controls */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            className="rounded-none border-b"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            className="rounded-none"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>

        {/* Map Type Controls */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : mapType === 'satellite' ? 'hybrid' : 'roadmap')}
            title="Change map type"
          >
            <Layers className="w-4 h-4" />
          </Button>
        </div>

        {/* Reset View */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            title="Reset view"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Fullscreen */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            title="Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Map Info */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
            <span>Available Properties</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-error rounded-full mr-2"></div>
            <span>Selected</span>
          </div>
          <div className="text-text-secondary">
            Zoom: {currentZoom}x
          </div>
        </div>
      </div>

      {/* Property Count */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3">
        <div className="flex items-center space-x-2">
          <Home className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">
            {properties.length} Properties
          </span>
        </div>
      </div>
    </div>
  );
}
