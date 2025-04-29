
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-medical-blue py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About Disease2Dose</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Your comprehensive resource for medical information, healthcare professionals, and medication guidance.
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                At Disease2Dose, we're dedicated to providing accessible, accurate, and comprehensive medical information to help you make informed healthcare decisions.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                We believe that understanding your health conditions, treatment options, and available medications is essential for better health outcomes.
              </p>
              <Link to="/contact">
                <Button className="mt-4">Contact Us</Button>
              </Link>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80" 
                alt="Healthcare professionals" 
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <div className="my-16 border-t border-gray-200 pt-16">
            <h2 className="text-3xl font-bold mb-12 text-center">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="bg-blue-100 rounded-full p-4 inline-block mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-medical-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Disease Information</h3>
                <p className="text-gray-600">
                  Comprehensive details about various medical conditions, symptoms, causes, and treatment approaches.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="bg-blue-100 rounded-full p-4 inline-block mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-medical-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Doctor Locator</h3>
                <p className="text-gray-600">
                  Find specialized healthcare professionals near you who can provide expert care for specific conditions.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="bg-blue-100 rounded-full p-4 inline-block mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-medical-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Medication Guide</h3>
                <p className="text-gray-600">
                  Information about prescription medications, their uses, compositions, and availability at local pharmacies.
                </p>
              </div>
            </div>
          </div>
          
          <div className="my-16 border-t border-gray-200 pt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80" 
                  alt="Medical research" 
                  className="w-full h-auto"
                />
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold mb-6">Our Commitment</h2>
                <p className="text-lg text-gray-700 mb-6">
                  We are committed to providing accurate and up-to-date medical information. Our content is regularly reviewed and updated to reflect the latest research and medical guidelines.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  While we strive for accuracy, Disease2Dose is an informational resource and not a substitute for professional medical advice. Always consult with healthcare professionals for personalized guidance.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-6">
                  <h4 className="font-semibold text-blue-800 mb-2">Disclaimer:</h4>
                  <p className="text-blue-700">
                    The information on this website is provided for educational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
