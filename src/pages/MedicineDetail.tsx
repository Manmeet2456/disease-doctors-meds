
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Info, PillIcon, Tag, Star } from 'lucide-react';
import { fetchMedicineById, fetchMedicineCompositions } from '@/services/supabase';
import { Medicine } from '@/types/medicine';

interface MedicineComposition {
  composition_id: number;
  compositions?: {
    composition_id: number;
    name: string;
  };
}

const MedicineDetail = () => {
  const { id } = useParams();
  const medicineId = parseInt(id || '0');
  
  const { data: medicine, isLoading: isMedicineLoading } = useQuery<Medicine>({
    queryKey: ['medicine', medicineId],
    queryFn: () => fetchMedicineById(medicineId),
    enabled: !!medicineId
  });
  
  const { data: compositions, isLoading: isCompositionsLoading } = useQuery<MedicineComposition[]>({
    queryKey: ['medicineCompositions', medicineId],
    queryFn: () => fetchMedicineCompositions(medicineId),
    enabled: !!medicineId
  });
  
  if (isMedicineLoading || isCompositionsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-lg">Loading medicine details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!medicine) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Medicine not found</h3>
            <p className="text-gray-600">The medicine you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Random medicine image
  const medicineImage = 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1000&q=80';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 p-6">
              <div className="bg-gray-100 rounded-md overflow-hidden">
                <img 
                  src={medicineImage} 
                  alt={medicine.name} 
                  className="w-full h-64 object-cover"
                />
              </div>
              
              <div className="mt-6 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <PillIcon className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                        <div>
                          <span className="text-sm text-gray-500">Type</span>
                          <p className="font-medium">{medicine.type || 'Not specified'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Tag className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <div>
                          <span className="text-sm text-gray-500">Price</span>
                          <p className="font-medium">${medicine.price ? medicine.price.toFixed(2) : 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
                        <div>
                          <span className="text-sm text-gray-500">Rank</span>
                          <p className="font-medium">{medicine.rank || 'Not ranked'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                        <div>
                          <span className="text-sm text-gray-500">Manufacturer</span>
                          <p className="font-medium">{medicine.company?.name || 'Unknown'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="md:w-2/3 p-6">
              <h1 className="text-3xl font-bold mb-4">{medicine.name}</h1>
              
              {medicine.disease && (
                <div className="mb-6">
                  <span className="text-gray-600">Used for treating:</span>
                  <span className="ml-2 font-medium">{medicine.disease.name}</span>
                </div>
              )}
              
              <Tabs defaultValue="compositions" className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="compositions">Compositions</TabsTrigger>
                  <TabsTrigger value="availability">Availability</TabsTrigger>
                </TabsList>
                
                <TabsContent value="compositions" className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">Components</h3>
                  
                  {compositions && compositions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {compositions.map((comp) => (
                          <TableRow key={comp.composition_id}>
                            <TableCell>{comp.compositions?.name || 'Unknown'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded text-center">
                      <p className="text-gray-600">No composition information available.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="availability" className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">Pharmacy Availability</h3>
                  <p className="text-gray-700 mb-4">
                    Check which pharmacies have this medicine in stock.
                  </p>
                  <a href={`/pharmacies?medicine=${medicineId}`} className="text-blue-600 hover:underline">
                    View Pharmacies with this Medicine
                  </a>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MedicineDetail;
