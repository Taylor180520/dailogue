import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Truck, Warehouse, ArrowRight, Phone } from 'lucide-react';
import ExpertProfileModal from './ExpertProfileModal';
import RotatingTagline from './RotatingTagline';

interface Expert {
  id: string;
  name: string;
  title: string;
  field: string;
  experience: string;
  description: string;
  avatar: string;
  color: string;
  icon: React.ComponentType<any>;
  cardImageUrl: string;
  tagline: string;
  rotatingTaglines: string[];
  detailedDescription: string;
  specialties: string[];
  achievements: string[];
}

const experts: Expert[] = [
  {
    id: 'warehouse-consultant',
    name: 'Sarah Chen',
    title: 'Warehouse Consultant',
    field: 'Warehouse Management',
    experience: '10+ years warehouse planning experience',
    description: 'Specializing in warehouse optimization, inventory management, and automated storage systems. Expert in lean warehouse operations and supply chain efficiency.',
    avatar: '🏭',
    color: 'from-blue-500 to-cyan-500',
    icon: Warehouse,
    cardImageUrl: 'https://images.squarespace-cdn.com/content/v1/5ec689480cc22c2d441e152f/250cd7bf-db74-44f3-af0c-284ba54f763a/Gusitsch-Amy-WebSized.jpg?format=2500w',
    tagline: 'Optimize your warehouse operations with data-driven strategies',
    rotatingTaglines: [
      'Optimize your warehouse operations with data-driven strategies',
      'Streamline your inventory for maximum efficiency',
      'Transform your warehouse into a productivity powerhouse',
      'Unlock the full potential of your logistics network'
    ],
    detailedDescription: 'Sarah Chen is a renowned warehouse management expert with over a decade of experience in optimizing complex distribution centers. She specializes in implementing cutting-edge automation technologies, developing efficient inventory management systems, and designing warehouse layouts that maximize throughput while minimizing operational costs. Her expertise spans across various industries including e-commerce, retail, manufacturing, and third-party logistics.',
    specialties: [
      'Warehouse Layout Design & Optimization',
      'Automated Storage & Retrieval Systems (AS/RS)',
      'Inventory Management & Control Systems',
      'Lean Warehouse Operations',
      'Cross-docking & Distribution Strategies',
      'Warehouse Management Systems (WMS) Implementation',
      'Labor Management & Productivity Optimization',
      'Supply Chain Integration & Visibility'
    ],
    achievements: [
      'Reduced operational costs by 35% for a major e-commerce fulfillment center through strategic layout redesign',
      'Implemented automated picking systems that increased productivity by 60% while reducing error rates to less than 0.1%',
      'Led digital transformation initiatives for 50+ warehouse facilities across North America and Asia',
      'Developed industry-standard best practices adopted by leading logistics companies worldwide'
    ]
  },
  {
    id: 'transportation-consultant',
    name: 'Michael Rodriguez',
    title: 'Transportation Consultant', 
    field: 'Logistics & Transportation',
    experience: '12+ years transportation strategy experience',
    description: 'Expert in transportation network design, route optimization, and multi-modal logistics. Specialized in cost reduction and delivery performance improvement.',
    avatar: '🚛',
    color: 'from-green-500 to-emerald-500',
    icon: Truck,
    cardImageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800',
    tagline: 'Transform your logistics with innovative transportation solutions',
    rotatingTaglines: [
      'Transform your logistics with innovative transportation solutions',
      'Reduce costs while improving delivery performance',
      'Design resilient transportation networks that scale',
      'Master the art of multi-modal logistics optimization'
    ],
    detailedDescription: 'Michael Rodriguez brings over 12 years of strategic transportation expertise to help organizations build resilient and cost-effective logistics networks. His deep understanding of multi-modal transportation, route optimization algorithms, and carrier relationship management has helped companies achieve significant cost savings while improving delivery performance. He specializes in both domestic and international transportation strategies.',
    specialties: [
      'Transportation Network Design & Optimization',
      'Multi-modal Logistics Strategy',
      'Route Planning & Optimization Algorithms',
      'Carrier Relationship Management',
      'Freight Cost Analysis & Negotiation',
      'Last-mile Delivery Solutions',
      'International Shipping & Customs',
      'Transportation Risk Management'
    ],
    achievements: [
      'Designed transportation networks that reduced shipping costs by 28% for Fortune 500 companies',
      'Optimized delivery routes resulting in 40% reduction in fuel consumption and carbon emissions',
      'Negotiated carrier contracts saving clients over $50M annually in transportation costs',
      'Implemented real-time tracking systems improving on-time delivery rates to 99.2%'
    ]
  }
];

const ExpertDialogues: React.FC = () => {
  const navigate = useNavigate();
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleExpertCardClick = (expertId: string) => {
    navigate(`/expert/${expertId}`);
  };

  const handleViewProfile = (e: React.MouseEvent, expert: Expert) => {
    e.stopPropagation(); // Prevent card click
    setSelectedExpert(expert);
    setIsProfileModalOpen(true);
  };

  return (
    <div className="flex-1 bg-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Dialogues with Experts
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Meet our AI-powered industry consultants who bring decades of real-world experience to your fingertips. Get personalized strategic guidance and actionable insights through natural conversation.
          </p>
        </div>

        {/* Expert Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {experts.map((expert) => (
            <div
              key={expert.id}
              onClick={() => handleExpertCardClick(expert.id)}
              className="group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.03] border-2 border-gray-700/50 hover:border-purple-500/60 min-h-[580px]"
              style={{
                backgroundImage: `url(${expert.cardImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 group-hover:via-black/60 transition-all duration-500" />
              
              {/* Content Overlay */}
              <div className="relative h-full flex flex-col justify-between p-8">
                {/* Top Section - Profile Tag and Expertise Badge */}
                <div className="flex justify-between items-start">
                  <div></div>
                  <button
                    onClick={(e) => handleViewProfile(e, expert)}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-2 rounded-full shadow-lg hover:bg-white/20 transition-all duration-200"
                  >
                    <span className="text-white text-sm font-medium">View Profile</span>
                  </button>
                </div>
                
                {/* Bottom Section - Expert Info */}
                <div className="space-y-4">
                  {/* Expert Name & Title */}
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-white group-hover:text-purple-200 transition-colors duration-300 drop-shadow-lg">
                      {expert.name}
                    </h3>
                    <p className="text-xl text-purple-300 font-semibold drop-shadow-md">
                      <span className="bg-purple-500/20 border border-purple-500/40 text-purple-300 px-4 py-2 rounded-full text-base font-medium backdrop-blur-sm">
                        {expert.title}
                      </span>
                    </p>
                  </div>
                  
                  {/* Tagline */}
                  <RotatingTagline taglines={expert.rotatingTaglines} />
                  
                  {/* Call to Action */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/expert/${expert.id}`);
                        }}
                        className="flex items-center space-x-2 bg-purple-600/80 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
                      >
                        <MessageCircle size={16} />
                        <span className="text-sm font-medium">Chat</span>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/expert/${expert.id}/call`);
                        }}
                        className="flex items-center space-x-2 bg-green-600/80 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
                      >
                        <Phone size={16} />
                        <span className="text-sm font-medium">Call</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ExpertProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        expert={selectedExpert}
      />
    </div>
  );
};

export default ExpertDialogues;