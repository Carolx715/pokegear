import { useState, useRef, useEffect } from 'react';

// Define the type for map markers/points of interest
interface MapMarker {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
}

// Sample data for demonstration
const sampleMarkers: MapMarker[] = [
  { id: '1', x: 150, y: 100, title: 'Mountain Peak', description: 'Highest point in the region' },
  { id: '2', x: 300, y: 220, title: 'Lake', description: 'Freshwater lake with fishing opportunities' },
  { id: '3', x: 450, y: 150, title: 'Forest', description: 'Dense woodland with diverse wildlife' },
  { id: '4', x: 200, y: 350, title: 'Village', description: 'Small settlement with local market' }
];

export default function CustomMap() {
  // State for position, zoom and selected marker
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Handle mouse down for dragging
  const handleMouseDown = (e: { clientX: number; clientY: number; }) => {
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - position.x, 
      y: e.clientY - position.y 
    });
  };
  
  // Handle mouse move for dragging
  const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };
  
  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Handle scroll for zooming
  const handleWheel = (e: { preventDefault: () => void; clientX: number; clientY: number; deltaY: number; }) => {
    e.preventDefault();
    
    // Calculate cursor position relative to map
    const rect = mapContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left - position.x;
    const mouseY = e.clientY - rect.top - position.y;
    
    // Calculate new zoom level
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.5, Math.min(5, zoom * zoomFactor));
    
    // Adjust position to zoom toward cursor position
    const newPosition = {
      x: position.x - mouseX * (zoomFactor - 1),
      y: position.y - mouseY * (zoomFactor - 1)
    };
    
    setZoom(newZoom);
    setPosition(newPosition);
  };
  
  // Handle marker click
  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
  };
  
  // Close info window
  const closeInfoWindow = () => {
    setSelectedMarker(null);
  };
  
  // Set up and clean up event listeners
  useEffect(() => {
    const mapContainer = mapContainerRef.current;
    if (!mapContainer) return;
    
    const handleMouseLeave = () => {
      setIsDragging(false);
    };
    
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    mapContainer.addEventListener('wheel', handleWheel, { passive: false });
    mapContainer.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
      if (mapContainer) {
        mapContainer.removeEventListener('wheel', handleWheel);
        mapContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isDragging, dragStart, position, zoom]);
  
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Interactive Custom Map</h2>
      <div className="mb-4 text-sm">
        <span className="mr-4">Drag to move</span>
        <span className="mr-4">Scroll to zoom</span>
        <span>Click markers for details</span>
      </div>
      
      <div 
        ref={mapContainerRef}
        className="relative overflow-hidden border-2 border-gray-300 rounded-lg w-full h-96 cursor-move bg-gray-100"
        onMouseDown={handleMouseDown}
      >
        {/* Map container with transformation */}
        <div 
          className="absolute"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          {/* Map image */}
          <div className="relative">
            <img 
              src="/api/placeholder/800/600" 
              alt="Map background" 
              className="select-none"
            />
            
            {/* Map markers */}
            {sampleMarkers.map(marker => (
              <div
                key={marker.id}
                className="absolute w-6 h-6 bg-red-500 rounded-full flex items-center justify-center cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                style={{ left: marker.x, top: marker.y }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkerClick(marker);
                }}
              >
                <span className="text-white font-bold text-xs">{marker.id}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Info window for selected marker */}
        {selectedMarker && (
          <div 
            className="absolute bg-white p-4 rounded-lg shadow-lg z-10"
            style={{
              left: selectedMarker.x * zoom + position.x,
              top: (selectedMarker.y * zoom + position.y) + 20,
              transform: 'translateX(-50%)'
            }}
          >
            <button 
              className="absolute top-1 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeInfoWindow}
            >
              ×
            </button>
            <h3 className="font-bold mb-2">{selectedMarker.title}</h3>
            <p>{selectedMarker.description}</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex gap-4">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setZoom(prev => Math.min(prev * 1.2, 5))}
        >
          Zoom In
        </button>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setZoom(prev => Math.max(prev * 0.8, 0.5))}
        >
          Zoom Out
        </button>
        <button 
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          onClick={() => {
            setPosition({ x: 0, y: 0 });
            setZoom(1);
          }}
        >
          Reset View
        </button>
      </div>
    </div>
  );
}