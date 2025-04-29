
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="bg-medical-blue py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Need Professional Medical Advice?</h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          While we provide comprehensive information, always consult with healthcare professionals for personalized medical advice.
        </p>
        <Link to="/doctors">
          <Button className="bg-white text-medical-blue hover:bg-gray-100 font-medium px-8 py-3 rounded-md text-lg">
            Find Specialists
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
