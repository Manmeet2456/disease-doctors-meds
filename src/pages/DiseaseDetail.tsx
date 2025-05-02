
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DiseaseDetail from '@/components/diseases/DiseaseDetail';
import { fetchDiseaseById } from '@/services/supabase';

const DiseaseDetailPage = () => {
  const { id } = useParams();
  const diseaseId = id || '0';
  
  const { data: disease, isLoading } = useQuery({
    queryKey: ['disease', diseaseId],
    queryFn: () => fetchDiseaseById(diseaseId),
    enabled: !!diseaseId
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-lg">Loading disease details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!disease) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-lg">
            <h1 className="text-3xl font-bold mb-4">Disease Not Found</h1>
            <p className="text-gray-600 mb-6">
              Sorry, we couldn't find the disease you're looking for. It might have been removed or doesn't exist.
            </p>
            <a href="/diseases" className="text-blue-600 hover:underline">
              Return to Disease Directory
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Function to get random image for disease
  const getDiseaseImage = (id: string) => {
    const images = [
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1576671103204-2c1e88a7df26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1628771065518-0d82f1938462?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1566813916511-32034bd88c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1599046512177-6195e9837993?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1609207825181-51aaf4dd2094?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    ];
    // Use hash of the string ID to get a consistent index
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return images[hash % images.length];
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <DiseaseDetail disease={{
        ...disease,
        image: getDiseaseImage(disease.disease_id)
      }} />
      <Footer />
    </div>
  );
};

export default DiseaseDetailPage;
