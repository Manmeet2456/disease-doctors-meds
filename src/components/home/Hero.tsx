
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="bg-cover bg-center" style={{ 
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=650&q=80')` 
    }}>
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Your Health Journey Starts Here</h1>
          <p className="text-xl text-gray-200 mb-8">
            Discover comprehensive information about diseases, symptoms, and treatments from trusted medical professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/diseases">
              <Button className="bg-medical-blue hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg">
                Explore Diseases
              </Button>
            </Link>
            <Link to="/medicines">
              <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-medical-blue px-6 py-3 rounded-md text-lg">
                Find Medicines
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
