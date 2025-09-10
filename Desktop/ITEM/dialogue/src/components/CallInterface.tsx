import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, ArrowLeft } from 'lucide-react';

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
  },
  'supply-chain-analyst': {
    id: 'supply-chain-analyst',
    name: 'Emily Johnson',
    title: 'Supply Chain Analyst',
    cardImageUrl: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
};

export default function CallInterface() {
  const { expertId } = useParams<{ expertId: string }>();
  const navigate = useNavigate();
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  const expert = expertId ? experts[expertId] : null;

  useEffect(() => {
    // Simulate call connection after 2 seconds
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
    }, 2000);

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

  const handleEndCall = () => {
    navigate('/experts');
  };

  const handleGoBack = () => {
    navigate('/experts');
  };

  if (!expert) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Expert not found</h2>
          <button
            onClick={handleGoBack}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 text-white">
        <button
          onClick={handleGoBack}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <p className="text-sm opacity-75">
            {isConnected ? 'Connected' : 'Connecting...'}
          </p>
          {isConnected && (
            <p className="text-lg font-semibold">{formatDuration(callDuration)}</p>
          )}
        </div>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Expert Info */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className={`w-48 h-48 rounded-full overflow-hidden mx-auto border-4 ${
              isConnected ? 'border-green-400' : 'border-gray-400'
            } transition-colors duration-500`}>
              <img
                src={expert.cardImageUrl}
                alt={expert.name}
                className="w-full h-full object-cover"
              />
            </div>
            {!isConnected && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border-4 border-blue-400 border-t-transparent animate-spin"></div>
              </div>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">{expert.name}</h1>
          <p className="text-xl text-gray-300 mb-4">{expert.title}</p>
          
          <div className="text-gray-400">
            {isConnected ? (
              <p className="text-lg">Call in progress...</p>
            ) : (
              <p className="text-lg animate-pulse">Connecting...</p>
            )}
          </div>
        </div>
      </div>

      {/* Call Controls */}
      <div className="p-8">
        <div className="flex items-center justify-center gap-8 mb-8">
          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
              isMuted 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isMuted ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </button>

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105"
          >
            <PhoneOff className="w-10 h-10 text-white" />
          </button>

          {/* Speaker Button */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
              isSpeakerOn 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isSpeakerOn ? (
              <Volume2 className="w-8 h-8 text-white" />
            ) : (
              <VolumeX className="w-8 h-8 text-white" />
            )}
          </button>
        </div>

        {/* Status Indicators */}
        <div className="flex justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isMuted ? 'bg-red-400' : 'bg-gray-600'}`}></div>
            <span>{isMuted ? 'Muted' : 'Mic On'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSpeakerOn ? 'bg-blue-400' : 'bg-gray-600'}`}></div>
            <span>{isSpeakerOn ? 'Speaker On' : 'Speaker Off'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}