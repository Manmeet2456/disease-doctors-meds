
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MedicinesTabContent from '@/components/medicines/MedicinesTabContent';
import CompositionsTabContent from '@/components/medicines/CompositionsTabContent';
import CompaniesTabContent from '@/components/medicines/CompaniesTabContent';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchMedicines, fetchCompositions, fetchCompanies } from '@/services/supabase';
import { toast } from '@/components/ui/use-toast';
import { Medicine, Composition, Company } from '@/types/medicine';

const Medicines = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || "medicines");
  
  useEffect(() => {
    // Update the active tab when URL search params change
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);
  
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
  
  // Show error toast if any errors occur
  React.useEffect(() => {
    if (medicinesError) {
      toast({
        title: "Error",
        description: "Failed to fetch medicines data. Please try again.",
        variant: "destructive"
      });
    }
  }, [medicinesError]);

  const handleExport = () => {
    let dataToExport;
    let filename;

    if (activeTab === 'medicines') {
      dataToExport = medicines;
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
          </div>
          
          <TabsContent value="medicines">
            <MedicinesTabContent 
              medicines={medicines as Medicine[]}
              isLoading={isLoadingMedicines}
              onExport={handleExport}
            />
          </TabsContent>
          
          <TabsContent value="compositions">
            <CompositionsTabContent 
              compositions={compositions as Composition[]}
              onExport={handleExport}
            />
          </TabsContent>
          
          <TabsContent value="companies">
            <CompaniesTabContent 
              companies={companies as Company[]}
              onExport={handleExport}
            />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Medicines;
