import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, X, ArrowLeft } from 'lucide-react';

interface Expert {
  id: string;
  name: string;
  title: string;
  cardImageUrl: string;
}

const experts: Record<string, Expert> = {
  'warehouse-consultant': {
    id: 'warehouse-consultant',
    name: 'Sarah Chen',
    title: 'Warehouse Consultant',
    cardImageUrl: 'https://images.squarespace-cdn.com/content/v1/5ec689480cc22c2d441e152f/250cd7bf-db74-44f3-af0c-284ba54f763a/Gusitsch-Amy-WebSized.jpg?format=2500w'
  },
  'transportation-consultant': {
    id: 'transportation-consultant',
    name: 'Michael Rodriguez',
    title: 'Transportation Consultant',
    cardImageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
};

const VoiceCallInterface: React.FC = () => {
  const { expertId } = useParams<{ expertId: string }>();
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isExpertSpeaking, setIsExpertSpeaking] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const expert = expertId ? experts[expertId] : null;

  useEffect(() => {
    // Simulate connection after 3 seconds
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
    }, 3000);

    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMicToggle = () => {
    setIsRecording(!isRecording);
    
    // Simulate expert response after user stops recording
    if (isRecording) {
      setTimeout(() => {
        setIsExpertSpeaking(true);
        setTimeout(() => {
          setIsExpertSpeaking(false);
        }, 3000);
      }, 500);
    }
  };

  const handleEndCall = () => {
    navigate('/');
  };

  if (!expert) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Expert not found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center relative">
      {/* Back Button - Fixed in top left */}
      <button
        onClick={() => navigate('/', { state: { activeTab: 'dialogues' } })}
        className="absolute top-6 left-6 flex items-center text-white/90 hover:text-white transition-colors bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 z-10"
      >
        <ArrowLeft size={20} className="mr-2" />
        <span>Back</span>
      </button>

      <div className="relative flex flex-col items-center">
        {/* Main sphere */}
        <div className={`w-80 h-80 rounded-full relative transition-all duration-300 ${
          isRecording 
            ? 'scale-110' 
            : isExpertSpeaking 
              ? 'scale-105' 
              : 'scale-100'
        }`}>
          {/* Base gradient sphere */}
          {/* Expert Avatar as Main Sphere */}
          <div className={`w-full h-full rounded-full overflow-hidden shadow-2xl ${
            isConnected ? 'border-4 border-purple-400/60' : ''
          }`}>
            <img
              src={expert.cardImageUrl}
              alt={expert.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Connecting animation */}
          {!isConnected && (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-purple-300/40 animate-ping" />
              <div className="absolute inset-4 rounded-full border-2 border-purple-400/50 animate-pulse" />
              <div className="absolute inset-8 rounded-full border border-purple-500/60 animate-ping" style={{ animationDelay: '0.5s' }} />
            </>
          )}
        </div>
        
        {/* Status text */}

        {/* Control buttons */}
        <div className="flex items-center justify-center space-x-12 mt-60">
          {/* Microphone button */}
          <button
            onClick={handleMicToggle}
            disabled={!isConnected}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
              isRecording
                ? 'bg-purple-600/80 hover:bg-purple-700/80 scale-110'
                : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
            } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRecording ? (
              <Mic className="w-8 h-8 text-white" />
            ) : (
              <MicOff className="w-8 h-8 text-white" />
            )}
          </button>

          {/* End call button */}
          <button
            onClick={handleEndCall}
            className="w-16 h-16 bg-red-600/80 hover:bg-red-700/80 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-105"
          >
            <X className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceCallInterface;