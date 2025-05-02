import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { User, PillIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DiseaseDetailProps {
  disease: {
    disease_id: string;
    name: string;
    description: string | null;
    symptoms: string | null;
    treatment: string | null;
    category: string;
    image?: string;
  };
}

const DiseaseDetail = ({ disease }: DiseaseDetailProps) => {
  const symptomsList = disease.symptoms ? disease.symptoms.split(', ') : [];
  const treatmentsList = disease.treatment ? disease.treatment.split(',') : [];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {disease.image && (
          <div className="h-64 overflow-hidden">
            <img 
              src={disease.image} 
              alt={disease.name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{disease.name}</h1>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <Link to={`/doctors?disease=${disease.disease_id}`}>
              <Button className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Find Specialists
              </Button>
            </Link>
            <Link to={`/medicines?disease=${disease.disease_id}`}>
              <Button variant="outline" className="flex items-center gap-2">
                <PillIcon className="h-5 w-5" />
                View Treatments
              </Button>
            </Link>
          </div>
          
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
              <TabsTrigger value="treatments">Treatments</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{disease.description || 'No description available.'}</p>
              </div>
            </TabsContent>
            <TabsContent value="symptoms" className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Common Symptoms</h3>
              {symptomsList.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {symptomsList.map((symptom, index) => (
                    <li key={index} className="text-gray-700">{symptom.trim()}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">No symptoms information available.</p>
              )}
            </TabsContent>
            <TabsContent value="treatments" className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Available Treatments</h3>
              <p className="text-gray-700 mb-4">
                Various treatments are available for {disease.name}. Please consult with healthcare professionals for personalized advice.
              </p>
              {treatmentsList.length > 0 ? (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                  <h4 className="font-semibold text-blue-800 mb-2">Common Treatment Approaches:</h4>
                  <ul className="list-disc list-inside text-blue-700 space-y-1">
                    {treatmentsList.map((treatment, index) => (
                      <li key={index}>{treatment.trim()}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                  <h4 className="font-semibold text-blue-800 mb-2">Common Treatment Approaches:</h4>
                  <ul className="list-disc list-inside text-blue-700 space-y-1">
                    <li>Medication therapy</li>
                    <li>Lifestyle modifications</li>
                    <li>Medical procedures (if applicable)</li>
                    <li>Regular monitoring and follow-ups</li>
                  </ul>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetail;
