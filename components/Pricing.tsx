import React from 'react';
import { Check } from 'lucide-react';
import { PricingPlan } from '../types';

const plans: PricingPlan[] = [
  {
    id: 'pilot',
    name: '7-Day Pilot',
    price: '$35',
    duration: 'One-Time Pass',
    description: 'Perfect for executing a single high-stakes mission or trial run.',
    features: [
      'Full System Access (9 Agents)',
      'Unlimited Report Generation',
      'Full Math Core (IVAS™, SCF™, SPI™)',
      'Global Knowledge Graph (195 Regions)',
      'Real-Time Ethics & Governance',
      'PDF & Audio Brief Exports'
    ]
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    price: '$245',
    duration: 'For 3 Months',
    description: 'Designed for strategic planning cycles and market analysis.',
    features: [
      'Full System Access (9 Agents)',
      'Unlimited Report Generation',
      'Full Math Core (IVAS™, SCF™, SPI™)',
      'Global Knowledge Graph (195 Regions)',
      'Real-Time Ethics & Governance',
      'PDF & Audio Brief Exports'
    ]
  },
  {
    id: 'semiannual',
    name: 'Semi-Annual',
    price: '$496',
    duration: 'For 6 Months',
    description: 'Sustained intelligence for regional expansion execution.',
    features: [
      'Full System Access (9 Agents)',
      'Unlimited Report Generation',
      'Full Math Core (IVAS™, SCF™, SPI™)',
      'Global Knowledge Graph (195 Regions)',
      'Real-Time Ethics & Governance',
      'PDF & Audio Brief Exports'
    ],
    recommended: true
  },
  {
    id: 'annual',
    name: 'Annual',
    price: '$785',
    duration: 'For 12 Months',
    description: 'Maximum value. Continuous global monitoring & strategy.',
    features: [
      'Full System Access (9 Agents)',
      'Unlimited Report Generation',
      'Full Math Core (IVAS™, SCF™, SPI™)',
      'Global Knowledge Graph (195 Regions)',
      'Real-Time Ethics & Governance',
      'PDF & Audio Brief Exports'
    ]
  }
];

export const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-bw-gold font-bold uppercase tracking-widest text-sm mb-2">Access Grid</h2>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-bw-navy">System Access Plans</h3>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We believe powerful intelligence shouldn't be locked behind prohibitive costs. Our goal is to provide a cost-effective system that gives every user—from individual analysts to global enterprises—full access to the entire Nexus Intelligence OS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`flex flex-col p-6 rounded-sm border ${plan.recommended ? 'border-bw-gold bg-white shadow-xl scale-105 z-10' : 'border-gray-200 bg-bw-light'} transition-all duration-300 hover:shadow-lg`}
            >
              {plan.recommended && (
                <div className="self-center bg-bw-gold text-bw-navy text-xs font-bold uppercase py-1 px-3 rounded-full mb-4">
                  Recommended
                </div>
              )}
              <h4 className="text-lg font-bold text-bw-navy">{plan.name}</h4>
              <div className="mt-4 mb-2">
                <span className="text-4xl font-serif font-bold text-bw-navy">{plan.price}</span>
              </div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-6">{plan.duration}</p>
              
              <p className="text-sm text-gray-600 mb-6 min-h-[40px]">{plan.description}</p>
              
              <div className="flex-grow space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <Check className="h-4 w-4 text-bw-gold mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-3 px-4 rounded-sm font-bold text-sm uppercase tracking-wide transition-colors ${plan.recommended ? 'bg-bw-navy text-white hover:bg-bw-gold' : 'bg-white border-2 border-bw-navy text-bw-navy hover:bg-bw-navy hover:text-white'}`}>
                Activate
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};