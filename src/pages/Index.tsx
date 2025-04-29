
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import CategorySection from '@/components/home/CategorySection';
import FeaturedDiseases from '@/components/home/FeaturedDiseases';
import CallToAction from '@/components/home/CallToAction';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <CategorySection />
        <FeaturedDiseases />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
