
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

// Sample data - this would come from your Supabase database
const diseases = [
  {
    id: 1,
    name: 'Type 2 Diabetes',
    description: 'A chronic condition that affects how your body metabolizes sugar (glucose).',
    symptoms: 'Increased thirst, Frequent urination, Increased hunger, Unintended weight loss',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80'
  },
  {
    id: 2,
    name: 'Hypertension',
    description: 'A common condition in which the long-term force of the blood against your artery walls is high enough that it may eventually cause health problems.',
    symptoms: 'Headaches, Shortness of breath, Nosebleeds',
    image: 'https://images.unsplash.com/photo-1576671103204-2c1e88a7df26?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80'
  },
  {
    id: 3,
    name: 'Asthma',
    description: 'A condition in which your airways narrow and swell and may produce extra mucus.',
    symptoms: 'Wheezing, Shortness of breath, Chest tightness, Coughing',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80'
  }
];

const FeaturedDiseases = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Disease Directory</h2>
          <Link to="/diseases">
            <Button variant="outline" className="flex items-center gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {diseases.map((disease) => (
            <Card key={disease.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={disease.image} 
                alt={disease.name} 
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle>{disease.name}</CardTitle>
                <CardDescription>{disease.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <h4 className="font-semibold mb-2">Common Symptoms:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {disease.symptoms.split(', ').map((symptom, index) => (
                      <li key={index}>{symptom}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/diseases/${disease.id}`} className="w-full">
                  <Button className="w-full" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDiseases;
