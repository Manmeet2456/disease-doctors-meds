
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Clock, Package } from 'lucide-react';
import { fetchStockByPharmacy, fetchPharmacyById } from '@/services/supabase';
import { toast } from '@/components/ui/use-toast';

interface StockItem {
  stock_id: number;
  medicine_id: number;
  quantity: number | null;
  price_store: number | null;
  medicines: {
    medicine_id: number;
    name: string;
    type: string | null;
  } | null;
}

const PharmacyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const pharmacyId = parseInt(id || '0');
  
  // Fetch pharmacy details
  const { data: pharmacy, isLoading: isLoadingPharmacy } = useQuery({
    queryKey: ['pharmacy', pharmacyId],
    queryFn: () => fetchPharmacyById(pharmacyId)
  });
  
  // Fetch pharmacy stock data
  const { data: stockItems, isLoading: isLoadingStock } = useQuery<StockItem[]>({
    queryKey: ['pharmacyStock', pharmacyId],
    queryFn: () => fetchStockByPharmacy(pharmacyId),
    meta: {
      onError: (error: Error) => {
        console.error('Failed to load pharmacy inventory data:', error);
        toast({
          title: "Error",
          description: "Failed to load pharmacy inventory data",
          variant: "destructive"
        });
      }
    }
  });
  
  const isLoading = isLoadingPharmacy || isLoadingStock;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-lg">Loading pharmacy details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
    
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {pharmacy ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{pharmacy.name}</h1>
              <p className="text-gray-600">View available medicine inventory</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Pharmacy Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{pharmacy.location || 'Address not available'}</span>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{pharmacy.contact_info || 'Contact information not available'}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Inventory Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-4">
                    <Package className="h-5 w-5 text-primary" />
                    <span className="font-medium">{stockItems?.length || 0} medicines in stock</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">Available Medicines</h2>
            
            {stockItems && stockItems.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stockItems.map((item) => (
                        <tr key={item.stock_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.medicines?.name || 'Unknown Medicine'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.quantity || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ${item.price_store || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.medicines?.type || 'Unknown'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-semibold mb-2">No inventory found</h3>
                <p className="text-gray-600">This pharmacy currently has no medicines in stock.</p>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2 text-red-700">Pharmacy Not Found</h3>
            <p className="text-gray-600">The pharmacy you are looking for does not exist or has no inventory data.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PharmacyDetail;
