
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PharmacyCard from '@/components/pharmacies/PharmacyCard';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from 'lucide-react';
import GoogleMap from '@/components/common/GoogleMap';

// Mock data - this would come from your Supabase database
const pharmaciesData = [
  {
    id: 1,
    name: 'Central Pharmacy',
    location: '123 Main Street, San Francisco, CA 94103',
    contact_info: '(555) 123-7890',
    open_hours: 'Mon-Fri: 8AM-9PM, Sat-Sun: 9AM-6PM',
    image: 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80',
    coordinates: { lat: 37.7749, lng: -122.4194 }
  },
  {
    id: 2,
    name: 'MediCare Pharmacy',
    location: '456 Market Street, San Francisco, CA 94105',
    contact_info: '(555) 234-5678',
    open_hours: 'Mon-Sat: 9AM-10PM, Sun: 10AM-7PM',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80',
    coordinates: { lat: 37.7935, lng: -122.3964 }
  },
  {
    id: 3,
    name: 'Health First Pharmacy',
    location: '789 Mission Street, San Francisco, CA 94103',
    contact_info: '(555) 345-6789',
    open_hours: '24 Hours Daily',
    image: 'https://images.unsplash.com/photo-1584308878768-57d3e1a17f8a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80',
    coordinates: { lat: 37.7857, lng: -122.4064 }
  },
  {
    id: 4,
    name: 'Community RX',
    location: '321 Valencia Street, San Francisco, CA 94110',
    contact_info: '(555) 456-7890',
    open_hours: 'Mon-Fri: 8AM-8PM, Sat: 9AM-5PM, Sun: Closed',
    image: 'https://images.unsplash.com/photo-1612016319158-4a4e69064a9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80',
    coordinates: { lat: 37.7637, lng: -122.4221 }
  },
  {
    id: 5,
    name: 'Wellness Pharmacy',
    location: '555 Geary Street, San Francisco, CA 94102',
    contact_info: '(555) 567-8901',
    open_hours: 'Mon-Sun: 9AM-9PM',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80',
    coordinates: { lat: 37.7871, lng: -122.4123 }
  },
  {
    id: 6,
    name: 'Golden Gate Pharmacy',
    location: '777 Fulton Street, San Francisco, CA 94102',
    contact_info: '(555) 678-9012',
    open_hours: 'Mon-Fri: 8:30AM-7PM, Sat: 10AM-4PM, Sun: Closed',
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80',
    coordinates: { lat: 37.7791, lng: -122.4327 }
  }
];

// Mock stock data - this would come from your Supabase database
const stockData = [
  { pharmacy_id: 1, medicine_id: 1, quantity: 150, price_store: 16.99 },
  { pharmacy_id: 1, medicine_id: 3, quantity: 100, price_store: 19.50 },
  { pharmacy_id: 1, medicine_id: 5, quantity: 80, price_store: 39.99 },
  { pharmacy_id: 2, medicine_id: 2, quantity: 120, price_store: 24.99 },
  { pharmacy_id: 2, medicine_id: 4, quantity: 90, price_store: 13.75 },
  { pharmacy_id: 2, medicine_id: 6, quantity: 60, price_store: 69.99 },
  { pharmacy_id: 3, medicine_id: 1, quantity: 200, price_store: 15.99 },
  { pharmacy_id: 3, medicine_id: 3, quantity: 180, price_store: 17.99 },
  { pharmacy_id: 3, medicine_id: 7, quantity: 50, price_store: 49.99 },
  { pharmacy_id: 4, medicine_id: 2, quantity: 100, price_store: 21.99 },
  { pharmacy_id: 4, medicine_id: 4, quantity: 70, price_store: 11.99 },
  { pharmacy_id: 4, medicine_id: 8, quantity: 40, price_store: 54.99 },
  { pharmacy_id: 5, medicine_id: 5, quantity: 90, price_store: 36.99 },
  { pharmacy_id: 5, medicine_id: 7, quantity: 60, price_store: 47.99 },
  { pharmacy_id: 6, medicine_id: 6, quantity: 70, price_store: 64.99 },
  { pharmacy_id: 6, medicine_id: 8, quantity: 30, price_store: 51.99 }
];

const Pharmacies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [filteredPharmacies, setFilteredPharmacies] = useState(pharmaciesData);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };
  
  const applyFilters = () => {
    let result = [...pharmaciesData];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(pharmacy => 
        pharmacy.name.toLowerCase().includes(term) || 
        pharmacy.location.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    setFilteredPharmacies(result);
  };
  
  const mapLocations = filteredPharmacies.map(pharmacy => ({
    lat: pharmacy.coordinates.lat,
    lng: pharmacy.coordinates.lng,
    title: pharmacy.name
  }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find a Pharmacy</h1>
          <p className="text-gray-600">Locate pharmacies near you and check medicine availability.</p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Pharmacies in Your Area</h2>
          <GoogleMap 
            apiKey="" 
            locations={mapLocations}
          />
          <div className="mt-2 text-sm text-gray-500">
            <p>Please connect your Supabase project and add your Google Maps API key to see pharmacy locations.</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Filter className="h-5 w-5 mr-2" /> Filter Pharmacies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search pharmacies by name or location..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        </div>
        
        {filteredPharmacies.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">No pharmacies found</h3>
            <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPharmacies.map(pharmacy => (
              <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Pharmacies;
