import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Send, Mic, MicOff, Volume2, VolumeX, X,
  Search, Globe, FileText, Lightbulb, Truck, Warehouse, Plus,
  Bot, User, Zap, MoreHorizontal, Linkedin, Youtube, Paperclip,
  ThumbsUp, ThumbsDown, StickyNote, Copy, BookOpen
} from 'lucide-react';

interface ExpertChatInterfaceProps {
  setIsSidebarCollapsed?: (collapsed: boolean) => void;
}

interface ExpertMessage {
  role: 'expert' | 'user';
  content: string;
  timestamp: string;
  isAudioPlaying?: boolean;
}

interface Note {
  id: string;
  content: string;
  timestamp: string;
  expertName: string;
  lastModified: string;
}

interface Expert {
  id: string;
  name: string;
  title: string;
  field: string;
  experience: string;
  avatar: string;
  color: string;
  icon: React.ComponentType<any>;
  greeting: string;
  tagline: string;
  cardImageUrl: string;
}

const experts: Record<string, Expert> = {
  'warehouse-consultant': {
    id: 'warehouse-consultant',
    name: 'Sarah Chen',
    title: 'Warehouse Consultant',
    field: 'Warehouse Management',
    experience: '10+ years warehouse planning experience',
    avatar: '🏭',
    color: 'from-blue-500 to-cyan-500',
    icon: Warehouse,
    greeting: 'Hey there! I\'m Sarah Chen, here to help you get more done with less drama using warehouse optimization and inventory management strategies. What specific warehouse challenge can I help you tackle right now?',
    tagline: '',
    cardImageUrl: 'https://images.squarespace-cdn.com/content/v1/5ec689480cc22c2d441e152f/250cd7bf-db74-44f3-af0c-284ba54f763a/Gusitsch-Amy-WebSized.jpg?format=2500w'
  },
  'transportation-consultant': {
    id: 'transportation-consultant',
    name: 'Michael Rodriguez',
    title: 'Transportation Consultant',
    field: 'Logistics & Transportation',
    experience: '12+ years transportation strategy experience',
    avatar: '🚛',
    color: 'from-green-500 to-emerald-500',
    icon: Truck,
    greeting: 'Greetings! I\'m Michael Rodriguez, your transportation and logistics consultant. I have extensive experience in transportation network design, route optimization, and multi-modal logistics. What transportation challenges can I help you solve?',
    tagline: '',
    cardImageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
};

const ExpertChatInterface: React.FC<ExpertChatInterfaceProps> = ({ setIsSidebarCollapsed }) => {
  const { expertId } = useParams<{ expertId: string }>();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isDeepResearchLoading, setIsDeepResearchLoading] = useState(false);
  const [isDeepResearchActive, setIsDeepResearchActive] = useState(false);
  const [showAddOptionsDropdown, setShowAddOptionsDropdown] = useState(false);
  const [showMoreOptionsDropdown, setShowMoreOptionsDropdown] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');
  const [messages, setMessages] = useState<ExpertMessage[]>([]);
  const [currentNotesView, setCurrentNotesView] = useState<'list' | 'edit'>('list');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [likedMessages, setLikedMessages] = useState<Set<number>>(new Set());
  const [dislikedMessages, setDislikedMessages] = useState<Set<number>>(new Set());
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);
  const [addedToNotesIndex, setAddedToNotesIndex] = useState<number | null>(null);

  const expert = expertId ? experts[expertId] : null;

  // Collapse sidebar to icon-only when entering expert chat
  useEffect(() => {
    if (setIsSidebarCollapsed) {
      setIsSidebarCollapsed(true);
    }
    return () => {
      if (setIsSidebarCollapsed) {
        setIsSidebarCollapsed(false);
      }
    };
  }, [setIsSidebarCollapsed]);

  useEffect(() => {
    if (expert) {
      setMessages([
        {
          role: 'expert',
          content: expert.greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [expert]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!expert) {
    return (
      <div className="flex-1 bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">Expert Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Experts
          </button>
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const messageContent = isDeepResearchActive ? `[Deep Research] ${inputValue}` : inputValue;
    
    const userMessage: ExpertMessage = {
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // If deep research is active, set loading state and reset active state
    if (isDeepResearchActive) {
      setIsDeepResearchLoading(true);
      setIsDeepResearchActive(false);
    }

    // Simulate expert response
    setTimeout(() => {
      const expertResponse: ExpertMessage = {
        role: 'expert',
        content: isDeepResearchActive ? getDeepResearchResponse(inputValue, expert.id) : getExpertResponse(inputValue, expert.id),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, expertResponse]);
      setIsDeepResearchLoading(false);
    }, isDeepResearchActive ? 3000 : 1500);
  };

  const getDeepResearchResponse = (question: string, expertId: string): string => {
    const warehouseDeepResponse = "I've conducted a comprehensive deep research analysis on your warehouse optimization question. Based on the latest industry data from 2024 and best practices from leading logistics companies:\n\n**Current Industry Trends:**\n- Automation adoption has increased by 35% in warehouse operations\n- AI-driven demand forecasting is reducing inventory costs by 20-30%\n- Sustainable warehouse practices are becoming mandatory\n\n**Strategic Recommendations:**\n1. Implement predictive analytics for demand planning\n2. Consider robotic process automation for repetitive tasks\n3. Develop partnerships with green logistics providers\n\n**ROI Projections:**\nBased on similar implementations, you can expect 15-25% operational cost reduction within 12-18 months.";
    
    const transportationDeepResponse = "I've conducted an extensive deep research analysis on your transportation question. Here's my comprehensive assessment based on current market data:\n\n**Market Intelligence:**\n- Transportation costs have increased by 12% due to fuel price volatility\n- Digital freight platforms are reducing booking time by 60%\n- Sustainable transportation mandates are reshaping carrier selection\n\n**Strategic Insights:**\n1. Multi-modal transportation reduces costs by 18-25%\n2. Real-time visibility platforms improve delivery performance by 30%\n3. Carbon-neutral shipping options are becoming competitive\n\n**Implementation Roadmap:**\nPhased approach over 6-12 months with expected 20-30% cost optimization.";
    
    return expertId === 'warehouse-consultant' ? warehouseDeepResponse : transportationDeepResponse;
  };
  const getExpertResponse = (question: string, expertId: string): string => {
    const warehouseResponses = [
      "Based on my experience in warehouse optimization, I recommend implementing a zone-based picking strategy combined with batch picking for similar orders. This can reduce travel time by up to 40%. Additionally, consider implementing a Warehouse Management System (WMS) with real-time inventory tracking to minimize search time.",
      "For inventory management, I suggest adopting an ABC analysis approach where you categorize items by their turnover rate. High-turnover items (A-category) should be placed in easily accessible locations, while slower-moving items can be stored in higher or more distant areas. This strategic placement can significantly improve picking efficiency.",
      "Warehouse layout optimization should follow the principle of minimizing material handling. I recommend a U-shaped flow pattern with receiving and shipping at opposite ends, and implementing cross-docking areas for fast-moving items. Consider vertical space utilization with mezzanine levels for lighter items."
    ];

    const transportationResponses = [
      "When facing sea freight delays, I recommend activating your contingency transportation plan. Consider switching to air freight for critical items, while negotiating with alternative carriers for less urgent shipments. Implement a multi-modal approach combining rail and truck transport as intermediate solutions.",
      "For cost-effective transportation, analyze your shipment patterns and consolidate loads whenever possible. Consider implementing a hub-and-spoke model for regional distribution, and evaluate partnerships with third-party logistics providers for better rate negotiations and capacity flexibility.",
      "Route optimization requires analyzing delivery density, time windows, and vehicle capacity constraints. I recommend using advanced routing software that considers real-time traffic data and implementing dynamic routing based on daily order patterns. This can reduce transportation costs by 15-25%."
    ];

    const responses = expertId === 'warehouse-consultant' ? warehouseResponses : transportationResponses;
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleLike = (messageIndex: number) => {
    setLikedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageIndex)) {
        newSet.delete(messageIndex);
      } else {
        newSet.add(messageIndex);
        // Remove from disliked if it was disliked
        setDislikedMessages(prevDisliked => {
          const newDislikedSet = new Set(prevDisliked);
          newDislikedSet.delete(messageIndex);
          return newDislikedSet;
        });
      }
      return newSet;
    });
  };

  const handleDislike = (messageIndex: number) => {
    setDislikedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageIndex)) {
        newSet.delete(messageIndex);
      } else {
        newSet.add(messageIndex);
        // Remove from liked if it was liked
        setLikedMessages(prevLiked => {
          const newLikedSet = new Set(prevLiked);
          newLikedSet.delete(messageIndex);
          return newLikedSet;
        });
      }
      return newSet;
    });
  };

  const handleAddToNotes = (messageIndex: number) => {
    const message = messages[messageIndex];
    const newNote: Note = {
      id: `note-${Date.now()}`,
      content: message.content,
      timestamp: message.timestamp,
      expertName: expert?.name || 'Expert',
      lastModified: new Date().toLocaleString()
    };
    
    setNotes(prev => [newNote, ...prev]);
    
    // Show "Added" feedback
    setAddedToNotesIndex(messageIndex);
    setTimeout(() => setAddedToNotesIndex(null), 2000); // Reset after 2 seconds
  };

  const handleCopyMessage = async (messageIndex: number) => {
    try {
      await navigator.clipboard.writeText(messages[messageIndex].content);
      setCopiedMessageIndex(messageIndex);
      setTimeout(() => setCopiedMessageIndex(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleFileUpload = () => {
    setShowAddOptionsDropdown(false);
    fileInputRef.current?.click();
  };

  const handleGoogleDriveClick = () => {
    setShowAddOptionsDropdown(false);
    console.log('Google Drive integration would be implemented here');
    // TODO: Implement Google Drive integration
  };

  const handleDeepResearchToggle = () => {
    setShowAddOptionsDropdown(false);
    setIsDeepResearchActive(!isDeepResearchActive);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files: File[] = Array.from(e.target.files);
      console.log('Files selected:', files.map(f => f.name));
      // TODO: Implement file processing logic
    }
  };

  const handleMoreOptionsClick = () => {
    setShowMoreOptionsDropdown(!showMoreOptionsDropdown);
  };

  const handleNotesClick = () => {
    setShowMoreOptionsDropdown(false);
    setShowNotesModal(true);
    setCurrentNotesView('list');
    setSelectedNoteId(null);
    setEditingNoteContent('');
  };

  const handleNoteSelect = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setSelectedNoteId(noteId);
      setEditingNoteContent(note.content);
      setCurrentNotesView('edit');
    }
  };

  const handleNoteUpdate = () => {
    if (selectedNoteId) {
      setNotes(prev => prev.map(note => 
        note.id === selectedNoteId 
          ? { ...note, content: editingNoteContent, lastModified: new Date().toLocaleString() }
          : note
      ));
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNoteId === noteId) {
      setSelectedNoteId(null);
      setEditingNoteContent('');
    }
  };

  const sampleQuestions = expert.id === 'warehouse-consultant' 
    ? [
        "How can I reduce warehouse picking time?",
        "What's the best inventory management strategy?",
        "How should I design warehouse layout?"
      ]
    : [
        "How to handle sea freight delays?",
        "What's the most cost-effective transportation mode?",
        "How to optimize delivery routes?"
      ];

  return (
    <div className="flex-1 bg-gray-900 flex">
      {/* Left Panel - Expert Portrait */}
      {showNotesModal ? (
        /* Notes Panel */
        <div className="w-2/5 bg-gray-800 flex flex-col">
          {/* Notes Header */}
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {currentNotesView === 'edit' ? (
                <button
                  onClick={() => {
                    handleNoteUpdate();
                    setCurrentNotesView('list');
                    setSelectedNoteId(null);
                    setEditingNoteContent('');
                  }}
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  <span>Back to Notes</span>
                </button>
              ) : (
                <>
                  <BookOpen size={24} className="text-purple-500" />
                  <h2 className="text-2xl font-bold text-white">Notes</h2>
                </>
              )}
            </div>
            <button
              onClick={() => setShowNotesModal(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Notes Content */}
          <div className="flex-1 overflow-hidden">
            {currentNotesView === 'list' ? (
              /* Notes List View */
              <div className="h-full overflow-y-auto p-6">
                {notes.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-gray-400">No notes yet</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Click "Add to Notes" on expert messages to save them here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        onClick={() => handleNoteSelect(note.id)}
                        className="p-4 rounded-xl cursor-pointer transition-all duration-200 bg-gray-700 hover:bg-gray-600 border border-gray-600"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm font-medium text-purple-400">
                            {note.expertName}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNote(note.id);
                            }}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                        <p className="text-gray-200 text-sm line-clamp-3 leading-relaxed">
                          {note.content.substring(0, 100)}
                          {note.content.length > 100 && '...'}
                        </p>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-xs text-gray-400">
                            {note.timestamp}
                          </span>
                          <span className="text-xs text-gray-400">
                            Modified: {note.lastModified.split(',')[0]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Note Edit View */
              <div className="h-full flex flex-col">
                <div className="p-6 border-b border-gray-700">
                  <p className="text-gray-400 text-sm">
                    From {notes.find(n => n.id === selectedNoteId)?.expertName} • {notes.find(n => n.id === selectedNoteId)?.timestamp}
                  </p>
                </div>
                
                <div className="flex-1 p-6">
                  <textarea
                    value={editingNoteContent}
                    onChange={(e) => {
                      setEditingNoteContent(e.target.value);
                      // Auto-save after user stops typing for 500ms
                      clearTimeout((window as any).autoSaveTimeout);
                      (window as any).autoSaveTimeout = setTimeout(() => {
                        handleNoteUpdate();
                      }, 500);
                    }}
                    className="w-full h-full resize-none border-none outline-none text-gray-200 text-base leading-relaxed font-normal bg-transparent placeholder-gray-500"
                    placeholder="Start writing your note..."
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      lineHeight: '1.6'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Expert Portrait Panel */
        <div 
          className="w-2/5 relative overflow-hidden"
          style={{
            backgroundImage: `url(${expert.cardImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60" />
          
          {/* Back button and menu */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-white/90 hover:text-white transition-colors bg-black/20 backdrop-blur-sm rounded-full px-4 py-2"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span>Back</span>
            </button>
            
            <div className="relative">
              <button 
                onClick={handleMoreOptionsClick}
                className="text-white/90 hover:text-white transition-colors bg-black/20 backdrop-blur-sm rounded-full p-2"
              >
                <MoreHorizontal size={20} />
              </button>
              
              {/* More Options Dropdown */}
              {showMoreOptionsDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowMoreOptionsDropdown(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 min-w-[200px]">
                    <button
                      onClick={handleNotesClick}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <BookOpen size={18} className="text-gray-600" />
                      </div>
                      <span className="text-gray-800 font-medium">Notes</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Expert name and tagline */}
          <div className="absolute top-6 left-6 right-6 mt-16">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-2">
              {expert.name}
            </h1>
            <p className="text-white/90 text-sm drop-shadow-md">
              {expert.tagline}
            </p>
          </div>
        </div>
      )}

      {/* Right Panel - Chat Interface */}
      <div className="w-3/5 bg-gray-800 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {messages.map((message, index) => (
              <div key={index} className="space-y-2">
                <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] ${message.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                    {message.role === 'user' ? (
                      /* User Message */
                      <div className="bg-purple-600 rounded-2xl rounded-tr-md p-4 shadow-lg">
                        <p className="text-white whitespace-pre-line leading-relaxed text-sm">
                          {message.content}
                        </p>
                      </div>
                    ) : (
                      /* Expert Message */
                      <div className="bg-gray-700 rounded-2xl rounded-tl-md p-4 shadow-lg">
                        {message.content.includes('[Deep Research]') ? (
                          <div>
                            <div className="flex items-center space-x-2 mb-3">
                              <Zap size={16} className="text-purple-400" />
                              <span className="text-sm font-medium text-purple-400">Deep Research Response</span>
                            </div>
                            <p className="text-white whitespace-pre-line leading-relaxed text-sm">
                              {message.content.replace('[Deep Research] ', '')}
                            </p>
                          </div>
                        ) : (
                          <p className="text-white whitespace-pre-line leading-relaxed text-sm">
                            {message.content}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action buttons below message box - only for expert messages */}
                {message.role === 'expert' && (
                  <div className="flex items-center space-x-3 mt-2">
                    {/* Like Button */}
                    <button
                      onClick={() => handleLike(index)}
                      className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                        likedMessages.has(index)
                          ? 'bg-green-500/20 text-green-400 scale-110'
                          : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
                      }`}
                      title="Like this response"
                    >
                      <ThumbsUp size={16} />
                    </button>

                    {/* Dislike Button */}
                    <button
                      onClick={() => handleDislike(index)}
                      className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                        dislikedMessages.has(index)
                          ? 'bg-red-500/20 text-red-400 scale-110'
                          : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                      }`}
                      title="Dislike this response"
                    >
                      <ThumbsDown size={16} />
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyMessage(index)}
                      className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                        copiedMessageIndex === index
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'text-gray-400 hover:text-purple-400 hover:bg-purple-500/10'
                      }`}
                      title={copiedMessageIndex === index ? "Copied!" : "Copy message"}
                    >
                      <Copy size={16} />
                    </button>

                    {/* Add to Notes Button */}
                    <button
                      onClick={() => handleAddToNotes(index)}
                      className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                        addedToNotesIndex === index
                          ? 'bg-green-500/20 text-green-400'
                          : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10'
                      }`}
                      title={addedToNotesIndex === index ? "Added!" : "Add to Notes"}
                    >
                      {addedToNotesIndex === index ? (
                        <span className="text-sm">✅</span>
                      ) : (
                        <span className="text-sm">📝</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator for deep research */}
            {isDeepResearchLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-700 rounded-2xl rounded-tl-md p-4 max-w-[75%] shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-purple-400 text-sm font-medium">Conducting deep research...</span>
                    <Globe size={16} className="text-purple-400 animate-spin" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Sample Questions (only show initially) */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <div className="flex gap-2">
              {sampleQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputValue(question);
                    // Simulate sending the message immediately
                    setTimeout(() => {
                      const userMessage: ExpertMessage = {
                        role: 'user',
                        content: question,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      };
                      setMessages(prev => [...prev, userMessage]);
                      setInputValue('');
                      
                      // Simulate expert response
                      setTimeout(() => {
                        const expertResponse: ExpertMessage = {
                          role: 'expert',
                          content: getExpertResponse(question, expert.id),
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        };
                        setMessages(prev => [...prev, expertResponse]);
                      }, 1500);
                    }, 100);
                  }}
                  className="text-left px-4 py-3 bg-gray-700/40 hover:bg-gray-600/60 rounded-full border border-gray-500/40 hover:border-gray-400 transition-all duration-200 group backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap flex-1 text-center"
                >
                  <p className="text-gray-200 group-hover:text-white transition-colors">
                    {question}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700/50 p-6">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
          />
          
          <div className="flex items-center space-x-4">
            {/* Text Input Container */}
            <div className="flex-1 relative">
              <div className="bg-gray-700/50 backdrop-blur-sm rounded-full border border-gray-600/30 flex items-center px-6 py-3">
                {/* Plus Button with Options Menu - Inside Input */}
                <div className="relative">
                  <button
                    onClick={() => setShowAddOptionsDropdown(!showAddOptionsDropdown)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-600/50 mr-3 ${
                      isDeepResearchActive ? 'text-purple-400' : 'text-gray-300'
                    }`}
                    title="Add Options"
                  >
                    {isDeepResearchActive ? <Zap size={18} /> : <Plus size={18} />}
                  </button>
                  
                  {/* Add Options Dropdown */}
                  {showAddOptionsDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowAddOptionsDropdown(false)}
                      />
                      <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 min-w-[280px]">
                        {/* Add photos & files */}
                        <button
                          onClick={handleFileUpload}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Paperclip size={18} className="text-gray-600" />
                          </div>
                          <span className="text-gray-800 font-medium">Add photos & files</span>
                        </button>
                        
                        {/* Separator */}
                        <div className="border-t border-gray-200 my-1" />
                        
                        {/* Add from Google Drive */}
                        <button
                          onClick={handleGoogleDriveClick}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                        >
                          <div className="w-8 h-8 flex items-center justify-center">
                            {/* Google Drive icon colors */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M7.71 6.71L12 2.42L16.29 6.71L12 11L7.71 6.71Z" fill="#0066DA"/>
                              <path d="M16.29 6.71L20.58 11L16.29 15.29L12 11L16.29 6.71Z" fill="#00AC47"/>
                              <path d="M7.71 6.71L3.42 11L7.71 15.29L12 11L7.71 6.71Z" fill="#EA4335"/>
                              <path d="M7.71 15.29L12 19.58L16.29 15.29L12 11L7.71 15.29Z" fill="#FFBA00"/>
                            </svg>
                          </div>
                          <span className="text-gray-800 font-medium">Add from Google Drive</span>
                        </button>
                        
                        {/* Separator */}
                        <div className="border-t border-gray-200 my-1" />
                        
                        {/* Deep research */}
                        <button
                          onClick={handleDeepResearchToggle}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Zap size={18} className="text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-gray-800 font-medium">
                              {isDeepResearchActive ? 'Disable Deep Research' : 'Deep research'}
                            </div>
                            {!isDeepResearchActive && (
                              <div className="text-gray-500 text-sm">Enhanced analysis with latest data</div>
                            )}
                          </div>
                          {isDeepResearchActive && (
                            <div className="w-2 h-2 bg-purple-500 rounded-full" />
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isDeepResearchActive ? "Ask for deep research analysis..." : "type your text here"}
                  className={`flex-1 bg-transparent focus:outline-none placeholder-gray-400 resize-none min-h-[24px] max-h-32 ${
                    isDeepResearchActive ? 'text-purple-300' : 'text-white'
                  }`}
                  rows={1}
                  style={{ lineHeight: '24px' }}
                />
                
                {/* Voice and Send Buttons */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={toggleRecording}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isRecording 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'hover:bg-gray-600/50 text-gray-300'
                    }`}
                    title={isRecording ? 'Stop recording' : 'Start voice input'}
                  >
                    {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-black transition-colors ${
                      isDeepResearchActive ? 'bg-purple-600 text-white' : 'bg-black text-white'
                    }`}
                    title="Send message"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const toggleAudioPlayback = (messageIndex: number) => {
  // Audio playback functionality would be implemented here
  console.log('Toggle audio for message:', messageIndex);
};

export default ExpertChatInterface;