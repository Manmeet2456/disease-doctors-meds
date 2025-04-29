
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MedicineCard from '@/components/medicines/MedicineCard';
import MedicineFilters from '@/components/medicines/MedicineFilters';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { fetchMedicines, fetchCompositions, fetchCompanies } from '@/services/supabase';
import { toast } from '@/components/ui/use-toast';

interface Medicine {
  medicine_id: number;
  name: string;
  type: string;
  price: number;
  rank: number;
  disease_id: number;
  disease: { name: string } | null;
  company_id: number;
  companies: { name: string } | null;
}

interface Composition {
  composition_id: number;
  name: string;
}

interface Company {
  company_id: number;
  name: string;
  rank: number | null;
}

const Medicines = () => {
  const [searchParams] = useSearchParams();
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [activeTab, setActiveTab] = useState("medicines");
  
  // Fetch medicines data from Supabase
  const { data: medicines, isLoading: isLoadingMedicines, error: medicinesError } = useQuery({
    queryKey: ['medicines'],
    queryFn: fetchMedicines
  });

  // Fetch compositions data from Supabase
  const { data: compositions, isLoading: isLoadingCompositions, error: compositionsError } = useQuery({
    queryKey: ['compositions'],
    queryFn: fetchCompositions
  });

  // Fetch companies data from Supabase
  const { data: companies, isLoading: isLoadingCompanies, error: companiesError } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies
  });
  
  useEffect(() => {
    if (medicinesError) {
      toast({
        title: "Error",
        description: "Failed to fetch medicines data. Please try again.",
        variant: "destructive"
      });
    }
  }, [medicinesError]);

  useEffect(() => {
    // If data is loaded, set filtered medicines
    if (medicines) {
      // Apply disease filter from URL if present
      const diseaseIdFromUrl = searchParams.get('disease');
      
      if (diseaseIdFromUrl) {
        const diseaseId = parseInt(diseaseIdFromUrl);
        const filtered = medicines.filter(medicine => medicine.disease_id === diseaseId);
        setFilteredMedicines(filtered);
      } else {
        setFilteredMedicines(medicines);
      }
    }
  }, [medicines, searchParams]);

  const handleFilterChange = (filters: any) => {
    if (!medicines) return;
    
    let result = [...medicines];
    
    // Apply search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(medicine => 
        medicine.name.toLowerCase().includes(term) || 
        (medicine.disease?.name && medicine.disease.name.toLowerCase().includes(term)) || 
        (medicine.companies?.name && medicine.companies.name.toLowerCase().includes(term))
      );
    }
    
    // Apply type filter
    if (filters.type && filters.type !== 'all') {
      result = result.filter(medicine => 
        medicine.type && medicine.type.toLowerCase() === filters.type.toLowerCase()
      );
    }
    
    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter(medicine => 
        medicine.price >= min && medicine.price <= max
      );
    }
    
    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'name-asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'price-asc':
          result.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'price-desc':
          result.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case 'rank-asc':
          result.sort((a, b) => (a.rank || 0) - (b.rank || 0));
          break;
        case 'rank-desc':
          result.sort((a, b) => (b.rank || 0) - (a.rank || 0));
          break;
        default:
          break;
      }
    }
    
    setFilteredMedicines(result);
  };

  // Random medical images for medicines
  const getMedicineImage = (index: number) => {
    const images = [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1550572017-edd951b55104?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1583947581924-860bda6a26df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    ];
    return images[index % images.length];
  };

  const handleExport = () => {
    let dataToExport;
    let filename;

    if (activeTab === 'medicines') {
      dataToExport = filteredMedicines;
      filename = 'medicines_data.csv';
    } else if (activeTab === 'compositions') {
      dataToExport = compositions;
      filename = 'compositions_data.csv';
    } else {
      dataToExport = companies;
      filename = 'companies_data.csv';
    }

    if (!dataToExport) return;

    // Convert data to CSV
    const header = Object.keys(dataToExport[0]).join(',');
    const rows = dataToExport.map(item => Object.values(item).join(',')).join('\n');
    const csv = header + '\n' + rows;

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isLoading = isLoadingMedicines || isLoadingCompositions || isLoadingCompanies;
  const hasError = medicinesError || compositionsError || companiesError;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-lg">Loading medicine data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="bg-red-50 p-8 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2 text-red-700">Error Loading Data</h3>
            <p className="text-red-600">There was an error loading the medicine data. Please try again later.</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Medicine Directory</h1>
          <p className="text-gray-600">Browse our comprehensive database of medicines, their compositions, prices, and availability.</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <TabsList>
              <TabsTrigger value="medicines">Medicines</TabsTrigger>
              <TabsTrigger value="compositions">Compositions</TabsTrigger>
              <TabsTrigger value="companies">Companies</TabsTrigger>
            </TabsList>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" /> Export List
            </Button>
          </div>
          
          <TabsContent value="medicines">
            <MedicineFilters onFilterChange={handleFilterChange} />
            
            {filteredMedicines.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-semibold mb-2">No medicines found</h3>
                <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMedicines.map((medicine, index) => (
                  <MedicineCard 
                    key={medicine.medicine_id} 
                    medicine={{
                      id: medicine.medicine_id,
                      name: medicine.name,
                      type: medicine.type || 'Unknown',
                      price: medicine.price || 0,
                      rank: medicine.rank || 0,
                      disease: medicine.disease?.name || 'Not specified',
                      company: medicine.companies?.name || 'Unknown',
                      image: getMedicineImage(index)
                    }} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="compositions">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-lg font-semibold mb-4">Available Compositions</h3>
              {compositions && compositions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {compositions.map((composition: Composition) => (
                    <div key={composition.composition_id} className="p-4 border rounded-md hover:bg-gray-50 transition-colors">
                      <h4 className="font-medium">{composition.name}</h4>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No compositions available.</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="companies">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-lg font-semibold mb-4">Pharmaceutical Companies</h3>
              {companies && companies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {companies.map((company: Company) => (
                    <div key={company.company_id} className="p-4 border rounded-md hover:bg-gray-50 transition-colors">
                      <h4 className="font-medium">{company.name}</h4>
                      <p className="text-sm text-gray-600">Rank: {company.rank || 'Not ranked'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No companies available.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Medicines;
