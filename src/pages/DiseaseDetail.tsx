
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DiseaseDetail from '@/components/diseases/DiseaseDetail';

// Mock data - this would come from your Supabase database
const diseasesData = [
  {
    id: 1,
    name: 'Type 2 Diabetes',
    description: 'Type 2 diabetes is a chronic condition that affects the way your body metabolizes sugar (glucose). With type 2 diabetes, your body either resists the effects of insulin — a hormone that regulates the movement of sugar into your cells — or doesn\'t produce enough insulin to maintain normal glucose levels.\n\nType 2 diabetes used to be known as adult-onset diabetes, but both type 1 and type 2 diabetes can begin during childhood and adulthood. Type 2 is more common in older adults, but the increase in the number of children with obesity has led to more cases of type 2 diabetes in younger people.\n\nThere\'s no cure for type 2 diabetes, but losing weight, eating well and exercising can help manage the disease. If diet and exercise aren\'t enough to manage your blood sugar well, you may also need diabetes medications or insulin therapy.',
    symptoms: 'Increased thirst, Frequent urination, Increased hunger, Unintended weight loss, Fatigue, Blurred vision, Slow-healing sores, Frequent infections, Areas of darkened skin',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    category: 'chronic'
  },
  {
    id: 2,
    name: 'Hypertension',
    description: 'Hypertension, also known as high blood pressure, is a common condition in which the long-term force of the blood against your artery walls is high enough that it may eventually cause health problems, such as heart disease.\n\nBlood pressure is determined both by the amount of blood your heart pumps and the amount of resistance to blood flow in your arteries. The more blood your heart pumps and the narrower your arteries, the higher your blood pressure. You can have high blood pressure for years without any symptoms. Even without symptoms, damage to blood vessels and your heart continues and can be detected.\n\nUncontrolled high blood pressure increases your risk of serious health problems, including heart attack and stroke. Fortunately, high blood pressure can be easily detected. And once you know you have high blood pressure, you can work with your doctor to control it.',
    symptoms: 'Headaches, Shortness of breath, Nosebleeds, Flushing, Dizziness, Chest pain, Visual changes, Blood in urine',
    image: 'https://images.unsplash.com/photo-1576671103204-2c1e88a7df26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    category: 'cardiovascular'
  },
  {
    id: 3,
    name: 'Asthma',
    description: 'Asthma is a condition in which your airways narrow and swell and may produce extra mucus. This can make breathing difficult and trigger coughing, a whistling sound (wheezing) when you breathe out and shortness of breath.\n\nFor some people, asthma is a minor nuisance. For others, it can be a major problem that interferes with daily activities and may lead to a life-threatening asthma attack.\n\nAsthma can\'t be cured, but its symptoms can be controlled. Because asthma often changes over time, it\'s important that you work with your doctor to track your signs and symptoms and adjust your treatment as needed.',
    symptoms: 'Wheezing, Shortness of breath, Chest tightness, Coughing, Trouble sleeping due to coughing or wheezing',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    category: 'respiratory'
  }
];

const DiseaseDetailPage = () => {
  const { id } = useParams();
  const diseaseId = parseInt(id || '0');
  
  // Find the disease with the matching ID
  const disease = diseasesData.find(d => d.id === diseaseId);
  
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <DiseaseDetail disease={disease} />
      <Footer />
    </div>
  );
};

export default DiseaseDetailPage;
