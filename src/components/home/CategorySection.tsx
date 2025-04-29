
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Brain, Lungs, Activity } from 'lucide-react';

const categories = [
  {
    id: 1,
    name: 'Cardiovascular',
    description: 'Heart and blood vessel conditions',
    icon: Heart,
    color: 'text-red-500',
    bgColor: 'bg-red-100',
    link: '/diseases?category=cardiovascular'
  },
  {
    id: 2,
    name: 'Neurological',
    description: 'Brain and nervous system disorders',
    icon: Brain,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    link: '/diseases?category=neurological'
  },
  {
    id: 3,
    name: 'Respiratory',
    description: 'Lung and breathing conditions',
    icon: Lungs,
    color: 'text-teal-500',
    bgColor: 'bg-teal-100',
    link: '/diseases?category=respiratory'
  },
  {
    id: 4,
    name: 'Chronic Diseases',
    description: 'Long-term health conditions',
    icon: Activity,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
    link: '/diseases?category=chronic'
  }
];

const CategorySection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link 
              to={category.link} 
              key={category.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 text-center group"
            >
              <div className={`${category.bgColor} p-4 rounded-full inline-flex justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <category.icon className={`h-10 w-10 ${category.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-gray-600">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
