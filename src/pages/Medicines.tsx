
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MedicineCard from '@/components/medicines/MedicineCard';
import MedicineFilters from '@/components/medicines/MedicineFilters';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

// Mock data - this would come from your Supabase database
const medicinesData = [
  {
    id: 1,
    name: 'Metformin',
    type: 'Tablet',
    price: 15.99,
    rank: 1,
    disease_id: 1,
    disease: 'Type 2 Diabetes',
    company_id: 1,
    company: 'PharmaCorp',
    compositions: ['Metformin Hydrochloride']
  },
  {
    id: 2,
    name: 'Gliclazide',
    type: 'Tablet',
    price: 22.99,
    rank: 3,
    disease_id: 1,
    disease: 'Type 2 Diabetes',
    company_id: 2,
    company: 'MediPharm',
    compositions: ['Gliclazide']
  },
  {
    id: 3,
    name: 'Losartan',
    type: 'Tablet',
    price: 18.50,
    rank: 2,
    disease_id: 2,
    disease: 'Hypertension',
    company_id: 1,
    company: 'PharmaCorp',
    compositions: ['Losartan Potassium']
  },
  {
    id: 4,
    name: 'Amlodipine',
    type: 'Tablet',
    price: 12.75,
    rank: 1,
    disease_id: 2,
    disease: 'Hypertension',
    company_id: 3,
    company: 'GlobalMed',
    compositions: ['Amlodipine Besylate']
  },
  {
    id: 5,
    name: 'Ventolin',
    type: 'Inhaler',
    price: 35.99,
    rank: 1,
    disease_id: 3,
    disease: 'Asthma',
    company_id: 4,
    company: 'RespiCare',
    compositions: ['Albuterol Sulfate']
  },
  {
    id: 6,
    name: 'Symbicort',
    type: 'Inhaler',
    price: 65.25,
    rank: 2,
    disease_id: 3,
    disease: 'Asthma',
    company_id: 5,
    company: 'AstraHealth',
    compositions: ['Budesonide', 'Formoterol Fumarate']
  },
  {
    id: 7,
    name: 'Sumatriptan',
    type: 'Tablet',
    price: 45.99,
    rank: 1,
    disease_id: 4,
    disease: 'Migraine',
    company_id: 1,
    company: 'PharmaCorp',
    compositions: ['Sumatriptan Succinate']
  },
  {
    id: 8,
    name: 'Rizatriptan',
    type: 'Tablet',
    price: 52.50,
    rank: 3,
    disease_id: 4,
    disease: 'Migraine',
    company_id: 2,
    company: 'MediPharm',
    compositions: ['Rizatriptan Benzoate']
  }
];

// Mock compositions data
const compositionsData = [
  { id: 1, name: 'Metformin Hydrochloride' },
  { id: 2, name: 'Gliclazide' },
  { id: 3, name: 'Losartan Potassium' },
  { id: 4, name: 'Amlodipine Besylate' },
  { id: 5, name: 'Albuterol Sulfate' },
  { id: 6, name: 'Budesonide' },
  { id: 7, name: 'Formoterol Fumarate' },
  { id: 8, name: 'Sumatriptan Succinate' },
  { id: 9, name: 'Rizatriptan Benzoate' }
];

// Mock companies data
const companiesData = [
  { id: 1, name: 'PharmaCorp', rank: 1 },
  { id: 2, name: 'MediPharm', rank: 3 },
  { id: 3, name: 'GlobalMed', rank: 2 },
  { id: 4, name: 'RespiCare', rank: 4 },
  { id: 5, name: 'AstraHealth', rank: 1 }
];

const Medicines = () => {
  const [searchParams] = useSearchParams();
  const [medicines, setMedicines] = useState(medicinesData);
  const [filteredMedicines, setFilteredMedicines] = useState(medicinesData);
  const [activeTab, setActiveTab] = useState("medicines");
  
  useEffect(() => {
    // Apply disease filter from URL if present
    const diseaseIdFromUrl = searchParams.get('disease');
    
    if (diseaseIdFromUrl) {
      const diseaseId = parseInt(diseaseIdFromUrl);
      const filtered = medicinesData.filter(medicine => medicine.disease_id === diseaseId);
      setFilteredMedicines(filtered);
    } else {
      setFilteredMedicines(medicinesData);
    }
  }, [searchParams]);

  const handleFilterChange = (filters: any) => {
    let result = [...medicines];
    
    // Apply search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(medicine => 
        medicine.name.toLowerCase().includes(term) || 
        medicine.disease.toLowerCase().includes(term) || 
        medicine.company.toLowerCase().includes(term) ||
        medicine.compositions.some(comp => comp.toLowerCase().includes(term))
      );
    }
    
    // Apply type filter
    if (filters.type && filters.type !== 'all') {
      result = result.filter(medicine => 
        medicine.type.toLowerCase() === filters.type.toLowerCase()
      );
    }
    
    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter(medicine => 
        medicine.price >= min && medicine.price <= max
      );
    }
    
    // Apply composition filter
    if (filters.composition && filters.composition !== 'all') {
      result = result.filter(medicine => 
        medicine.compositions.some(comp => 
          comp.toLowerCase().includes(filters.composition.toLowerCase())
        )
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
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rank-asc':
          result.sort((a, b) => a.rank - b.rank);
          break;
        case 'rank-desc':
          result.sort((a, b) => b.rank - a.rank);
          break;
        default:
          break;
      }
    }
    
    setFilteredMedicines(result);
  };

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
            <Button variant="outline" className="flex items-center gap-2">
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
                {filteredMedicines.map(medicine => (
                  <MedicineCard key={medicine.id} medicine={medicine} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="compositions">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-lg font-semibold mb-4">Available Compositions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {compositionsData.map(composition => (
                  <div key={composition.id} className="p-4 border rounded-md hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium">{composition.name}</h4>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="companies">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-lg font-semibold mb-4">Pharmaceutical Companies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companiesData.map(company => (
                  <div key={company.id} className="p-4 border rounded-md hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium">{company.name}</h4>
                    <p className="text-sm text-gray-600">Rank: {company.rank}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Medicines;
