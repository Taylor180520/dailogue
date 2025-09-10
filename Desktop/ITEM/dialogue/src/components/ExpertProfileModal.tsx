import React from 'react';
import { X, MessageCircle, Phone, Award, Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Expert {
  id: string;
  name: string;
  title: string;
  field: string;
  experience: string;
  avatar: string;
  color: string;
  cardImageUrl: string;
  tagline: string;
  detailedDescription: string;
  specialties: string[];
  achievements: string[];
}

interface ExpertProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: Expert | null;
}

const ExpertProfileModal: React.FC<ExpertProfileModalProps> = ({
  isOpen,
  onClose,
  expert,
}) => {
  const navigate = useNavigate();

  if (!isOpen || !expert) return null;

  const handleChatClick = () => {
    navigate(`/expert/${expert.id}`);
    onClose();
  };

  const handleCallClick = () => {
    navigate(`/expert/${expert.id}/call`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-primary-color rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-700">
        {/* Content */}
        <div className="p-8 space-y-6 relative">
          {/* Close button moved to top right of content */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all z-10"
          >
            <X size={20} />
          </button>

          {/* Detailed Description */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Award className="w-6 h-6 mr-3 text-purple-500" />
              Professional Expertise
            </h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              {expert.detailedDescription}
            </p>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Star className="w-6 h-6 mr-3 text-purple-500" />
              Core Specialties
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {expert.specialties.map((specialty, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex items-center"
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                  <span className="text-gray-200 font-medium">{specialty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-800/50 border-t border-gray-700 p-6">
          <div className="flex justify-center space-x-6">
            <button
              onClick={handleChatClick}
              className="flex items-center space-x-3 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <MessageCircle size={20} />
              <span>Chat</span>
            </button>
            
            <button
              onClick={handleCallClick}
              className="flex items-center space-x-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Phone size={20} />
              <span>Call</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfileModal;