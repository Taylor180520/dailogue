import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Bot, FileText, User, Send, ArrowLeft, Plus, Search,
  Check, Settings, Maximize2, Minimize2, BookOpen, Tag,
  Headphones, Network, StickyNote, MoreHorizontal, BarChart3, Video, Camera,
  Download, Eye, Trash2, Edit3, X, ChevronDown, Loader
} from 'lucide-react';
import { knowledgeBaseData } from '../data/mockData';
import { KnowledgeType, KnowledgeBaseCard } from '../types';
// import { DocumentViewer } from 'react-documents';
// import PptxGenJS from 'pptxgenjs';

interface ChatInterfaceProps {
  setIsSidebarCollapsed?: (collapsed: boolean) => void;
}

interface Document {
  id: string;
  name: string;
  type: string;
  tags?: string[];
  content: Array<{
    id: string;
    text: string;
  }>;
  isDeleting?: boolean;
}

interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
  citations?: Array<{
    docId: string;
    paragraphId: string;
    text: string;
  }>;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  documentName: string;
}

interface TagSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

interface AudioCustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SlidesCustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GeneratedContentItem {
  id: string;
  type: 'audio' | 'video' | 'mindmap' | 'report' | 'slide';
  title: string;
  subtitle?: string;
  sources: number;
  timeAgo: string;
  icon: string;
  isLoading?: boolean;
  loadingText?: string;
}

interface PPTSlide {
  id: string;
  type: 'title' | 'content' | 'image' | 'chart';
  title?: string;
  subtitle?: string;
  content?: string[];
  bulletPoints?: string[];
  image?: string;
  backgroundColor?: string;
  textColor?: string;
  layout?: 'center' | 'left' | 'right';
}

interface PPTPresentation {
  id: string;
  title: string;
  author: string;
  theme: string;
  slides: PPTSlide[];
}

interface PPTViewerProps {
  slideItem: GeneratedContentItem;
  presentation?: PPTPresentation;
}

// PPTX Generator using PptxGenJS
class PPTXGenerator {
  static async createPresentation(title: string, sources: number): Promise<string> {
    // This would use PptxGenJS to create a real PPTX file
    // For now, we'll simulate the creation and return a blob URL
    
    try {
      // Simulate PPTX creation with PptxGenJS
      const pptxData = await this.generatePPTXBlob(title, sources);
      const blob = new Blob([pptxData], { 
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' 
      });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error creating PPTX:', error);
      // Fallback to a sample PPTX URL or create a minimal one
      return this.createFallbackPPTX(title);
    }
  }

  private static async generatePPTXBlob(title: string, sources: number): Promise<ArrayBuffer> {
    // This is where we would use PptxGenJS to create the actual PPTX
    // Since we can't import the library in this demo, we'll create a mock structure
    
    // In a real implementation, this would be:
    /*
    const pptx = new PptxGenJS();
    
    // Slide 1: Title slide
    const slide1 = pptx.addSlide();
    slide1.addText(title, { 
      x: 1, y: 2, w: 8, h: 1.5, 
      fontSize: 44, bold: true, color: 'FFFFFF',
      align: 'center'
    });
    slide1.addText('Generated from Knowledge Base Sources', { 
      x: 1, y: 4, w: 8, h: 0.75, 
      fontSize: 24, color: 'CCCCCC',
      align: 'center'
    });
    slide1.background = { color: '4472C4' };

    // Slide 2: Key Insights
    const slide2 = pptx.addSlide();
    slide2.addText('Key Insights', { 
      x: 0.5, y: 0.5, w: 9, h: 1, 
      fontSize: 36, bold: true, color: '333333'
    });
    
    const insights = [
      'Machine learning algorithms show promising results in stock selection',
      'Post-2008 financial crisis era requires new quantitative approaches',
      'Feature engineering is crucial for avoiding overfitting',
      'Forecast combinations improve prediction accuracy'
    ];
    
    insights.forEach((insight, index) => {
      slide2.addText(`• ${insight}`, {
        x: 0.5, y: 1.5 + (index * 0.8), w: 9, h: 0.6,
        fontSize: 18, color: '333333'
      });
    });

    // Slide 3: Implementation Strategy
    const slide3 = pptx.addSlide();
    slide3.addText('Implementation Strategy', { 
      x: 0.5, y: 0.5, w: 9, h: 1, 
      fontSize: 36, bold: true, color: '333333'
    });
    
    const strategies = [
      'Data preprocessing and feature selection',
      'Model training with cross-validation',
      'Performance evaluation metrics',
      'Risk management considerations'
    ];
    
    strategies.forEach((strategy, index) => {
      slide3.addText(`• ${strategy}`, {
        x: 0.5, y: 1.5 + (index * 0.8), w: 9, h: 0.6,
        fontSize: 18, color: '333333'
      });
    });

    // Slide 4: Conclusion
    const slide4 = pptx.addSlide();
    slide4.addText('Conclusion', { 
      x: 0.5, y: 0.5, w: 9, h: 1, 
      fontSize: 36, bold: true, color: '333333',
      align: 'center'
    });
    
    slide4.addText('The research demonstrates that machine learning algorithms can effectively enhance traditional quantitative investment strategies.', {
      x: 1, y: 2, w: 8, h: 1.5,
      fontSize: 20, color: '333333',
      align: 'center'
    });
    
    slide4.addText('Key success factors include proper feature engineering, robust validation methods, and careful risk management.', {
      x: 1, y: 4, w: 8, h: 1.5,
      fontSize: 20, color: '333333',
      align: 'center'
    });

    return await pptx.write('arraybuffer');
    */

    // For demo purposes, create a minimal PPTX-like structure
    return this.createMinimalPPTXBuffer(title, sources);
  }

  private static async createMinimalPPTXBuffer(title: string, sources: number): Promise<ArrayBuffer> {
    // Create a more realistic PPTX-like structure
    // This simulates what PptxGenJS would generate
    
    // PPTX files are ZIP archives containing XML files
    // For demo purposes, we'll create a structured representation
    
    const pptxStructure = {
      // Metadata
      docProps: {
        app: 'Knowledge Base Generator',
        title: title,
        creator: 'AI Assistant',
        created: new Date().toISOString(),
        slides: 4
      },
      
      // Presentation structure
      presentation: {
        slideSize: { cx: 9144000, cy: 6858000 }, // Standard 16:9 ratio
        slides: [
          {
            id: 'slide1',
            layout: 'title',
            elements: [
              {
                type: 'title',
                text: title,
                style: {
                  fontSize: 44,
                  bold: true,
                  color: 'FFFFFF',
                  align: 'center'
                },
                position: { x: 914400, y: 1828800, w: 7315200, h: 1371600 }
              },
              {
                type: 'subtitle',
                text: `Generated from ${sources} Knowledge Base Sources`,
                style: {
                  fontSize: 24,
                  color: 'CCCCCC',
                  align: 'center'
                },
                position: { x: 914400, y: 3657600, w: 7315200, h: 685800 }
              }
            ],
            background: {
              type: 'gradient',
              colors: ['4472C4', '264478']
            }
          },
          {
            id: 'slide2',
            layout: 'content',
            elements: [
              {
                type: 'title',
                text: 'Key Insights',
                style: {
                  fontSize: 36,
                  bold: true,
                  color: '333333'
                },
                position: { x: 457200, y: 457200, w: 8229600, h: 914400 }
              },
              {
                type: 'bulletList',
                items: [
                  'Machine learning algorithms show promising results in stock selection',
                  'Post-2008 financial crisis era requires new quantitative approaches',
                  'Feature engineering is crucial for avoiding overfitting',
                  'Forecast combinations improve prediction accuracy'
                ],
                style: {
                  fontSize: 18,
                  color: '333333',
                  bulletColor: '4472C4'
                },
                position: { x: 457200, y: 1371600, w: 8229600, h: 4572000 }
              }
            ],
            background: { type: 'solid', color: 'FFFFFF' }
          },
          {
            id: 'slide3',
            layout: 'content',
            elements: [
              {
                type: 'title',
                text: 'Implementation Strategy',
                style: {
                  fontSize: 36,
                  bold: true,
                  color: '333333'
                },
                position: { x: 457200, y: 457200, w: 8229600, h: 914400 }
              },
              {
                type: 'bulletList',
                items: [
                  'Data preprocessing and feature selection',
                  'Model training with cross-validation',
                  'Performance evaluation metrics',
                  'Risk management considerations'
                ],
                style: {
                  fontSize: 18,
                  color: '333333',
                  bulletColor: '4472C4'
                },
                position: { x: 457200, y: 1371600, w: 8229600, h: 4572000 }
              }
            ],
            background: { type: 'solid', color: 'F8F9FA' }
          },
          {
            id: 'slide4',
            layout: 'conclusion',
            elements: [
              {
                type: 'title',
                text: 'Conclusion',
                style: {
                  fontSize: 36,
                  bold: true,
                  color: '333333',
                  align: 'center'
                },
                position: { x: 457200, y: 457200, w: 8229600, h: 914400 }
              },
              {
                type: 'paragraph',
                text: 'The research demonstrates that machine learning algorithms can effectively enhance traditional quantitative investment strategies.',
                style: {
                  fontSize: 20,
                  color: '333333',
                  align: 'center'
                },
                position: { x: 914400, y: 1828800, w: 7315200, h: 1371600 }
              },
              {
                type: 'paragraph',
                text: 'Key success factors include proper feature engineering, robust validation methods, and careful risk management.',
                style: {
                  fontSize: 20,
                  color: '333333',
                  align: 'center'
                },
                position: { x: 914400, y: 3657600, w: 7315200, h: 1371600 }
              }
            ],
            background: { type: 'solid', color: 'FFFFFF' }
          }
        ]
      }
    };

    // Convert to a more realistic binary format
    const jsonString = JSON.stringify(pptxStructure, null, 2);
    const encoder = new TextEncoder();
    const jsonBuffer = encoder.encode(jsonString);
    
    // Add some binary headers to make it look more like a real file
    const header = new Uint8Array([0x50, 0x4B, 0x03, 0x04]); // ZIP file signature
    const combined = new Uint8Array(header.length + jsonBuffer.length);
    combined.set(header);
    combined.set(jsonBuffer, header.length);
    
    return combined.buffer;
  }

  private static createFallbackPPTX(title: string): string {
    // Create a data URL as fallback
    const fallbackContent = `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${btoa(title)}`;
    return fallbackContent;
  }
}

// Sample PPT data - this would normally come from a file or API
const createSamplePresentation = (title: string): PPTPresentation => ({
  id: 'sample-ppt-1',
  title: title,
  author: 'AI Assistant',
  theme: 'modern',
  slides: [
    {
      id: 'slide-1',
      type: 'title',
      title: title,
      subtitle: 'Generated from Knowledge Base Sources',
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textColor: 'white',
      layout: 'center'
    },
    {
      id: 'slide-2',
      type: 'content',
      title: 'Key Insights',
      bulletPoints: [
        'Machine learning algorithms show promising results in stock selection',
        'Post-2008 financial crisis era requires new quantitative approaches',
        'Feature engineering is crucial for avoiding overfitting',
        'Forecast combinations improve prediction accuracy'
      ],
      backgroundColor: '#ffffff',
      textColor: '#333333',
      layout: 'left'
    },
    {
      id: 'slide-3',
      type: 'content',
      title: 'Implementation Strategy',
      bulletPoints: [
        'Data preprocessing and feature selection',
        'Model training with cross-validation',
        'Performance evaluation metrics',
        'Risk management considerations'
      ],
      backgroundColor: '#f8f9fa',
      textColor: '#2c3e50',
      layout: 'left'
    },
    {
      id: 'slide-4',
      type: 'content',
      title: 'Conclusion',
      content: [
        'The research demonstrates that machine learning algorithms can effectively enhance traditional quantitative investment strategies.',
        'Key success factors include proper feature engineering, robust validation methods, and careful risk management.'
      ],
      backgroundColor: '#ffffff',
      textColor: '#333333',
      layout: 'center'
    }
  ]
});

// Real PPTX Viewer using react-documents
const RealPPTXViewer: React.FC<PPTViewerProps> = ({ slideItem }) => {
  const [pptxUrl, setPptxUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generatePPTX = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Generate real PPTX file
        const url = await PPTXGenerator.createPresentation(slideItem.title, slideItem.sources);
        setPptxUrl(url);
      } catch (err) {
        console.error('Error generating PPTX:', err);
        setError('Failed to generate PPTX presentation');
      } finally {
        setIsLoading(false);
      }
    };

    generatePPTX();

    // Cleanup blob URL on unmount
    return () => {
      if (pptxUrl) {
        URL.revokeObjectURL(pptxUrl);
      }
    };
  }, [slideItem.title, slideItem.sources]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-gray-900 items-center justify-center">
        <Loader size={48} className="text-purple-400 animate-spin mb-4" />
        <p className="text-white text-lg">Generating PPTX presentation...</p>
        <p className="text-gray-400 text-sm mt-2">Creating slides from knowledge base sources</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full bg-gray-900 items-center justify-center">
        <div className="text-red-400 text-center">
          <X size={48} className="mx-auto mb-4" />
          <p className="text-lg mb-2">Error Loading Presentation</p>
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!pptxUrl) {
    return (
      <div className="flex flex-col h-full bg-gray-900 items-center justify-center">
        <div className="text-gray-400 text-center">
          <FileText size={48} className="mx-auto mb-4" />
          <p className="text-lg">No presentation available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{slideItem.title}</h3>
            <p className="text-sm text-gray-400">
              Generated from {slideItem.sources} source{slideItem.sources !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = pptxUrl;
                link.download = `${slideItem.title}.pptx`;
                link.click();
              }}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Download"
            >
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* PPTX Viewer */}
      <div className="flex-1 bg-white">
        {/* Using react-documents DocumentViewer */}
        {/* 
        <DocumentViewer
          url={pptxUrl}
          viewer="office"
          style={{ width: '100%', height: '100%' }}
          onError={(error) => {
            console.error('DocumentViewer error:', error);
            setError('Failed to load PPTX in viewer');
          }}
        />
        */}
        
        {/* Fallback: iframe with Office Online viewer */}
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(pptxUrl)}`}
          width="100%"
          height="100%"
          frameBorder="0"
          title="PPTX Viewer"
          onError={() => {
            setError('Failed to load PPTX in Office viewer');
          }}
          style={{ border: 'none' }}
        />
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Real PPTX Document</span>
          <span>Powered by Office Online</span>
        </div>
      </div>
    </div>
  );
};

const PPTViewer: React.FC<PPTViewerProps> = ({ slideItem, presentation }) => {
  // Create sample presentation if none provided
  const pptData = presentation || createSamplePresentation(slideItem.title);
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = pptData.slides.length;

  const nextSlide = () => {
    if (currentSlide < totalSlides) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (slideNumber: number) => {
    setCurrentSlide(slideNumber);
  };

  const currentSlideData = pptData.slides[currentSlide - 1];

  const renderSlideContent = (slide: PPTSlide) => {
    const baseStyle = {
      background: slide.backgroundColor || '#ffffff',
      color: slide.textColor || '#333333',
    };

    switch (slide.type) {
      case 'title':
        return (
          <div 
            className="w-full h-full flex flex-col justify-center items-center text-center p-12 rounded-lg"
            style={baseStyle}
          >
            <h1 className="text-5xl font-bold mb-6" style={{ color: slide.textColor }}>
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="text-2xl opacity-80" style={{ color: slide.textColor }}>
                {slide.subtitle}
              </p>
            )}
          </div>
        );

      case 'content':
        return (
          <div 
            className="w-full h-full p-12 rounded-lg"
            style={baseStyle}
          >
            <div className={`h-full ${slide.layout === 'center' ? 'flex flex-col justify-center items-center text-center' : ''}`}>
              <h2 className="text-4xl font-bold mb-8" style={{ color: slide.textColor }}>
                {slide.title}
              </h2>
              
              {slide.bulletPoints && (
                <ul className="space-y-4 text-xl">
                  {slide.bulletPoints.map((point, index) => (
                    <li key={index} className="flex items-start" style={{ color: slide.textColor }}>
                      <span className="text-blue-500 mr-4 text-2xl">•</span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              {slide.content && (
                <div className="space-y-6">
                  {slide.content.map((paragraph, index) => (
                    <p key={index} className="text-xl leading-relaxed" style={{ color: slide.textColor }}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full flex items-center justify-center rounded-lg" style={baseStyle}>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4" style={{ color: slide.textColor }}>
                {slide.title || `Slide ${currentSlide}`}
              </h2>
              <p className="text-xl" style={{ color: slide.textColor }}>
                Content for slide {currentSlide}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* PPT Content Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl aspect-video overflow-hidden">
          {currentSlideData && renderSlideContent(currentSlideData)}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-t border-gray-700">
        {/* Slide Info */}
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-300">
            <span className="font-medium">{pptData.title}</span>
            <span className="text-gray-500 ml-2">by {pptData.author}</span>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => goToSlide(1)}
            disabled={currentSlide === 1}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="First slide"
          >
            ⏮️
          </button>
          
          <button
            onClick={prevSlide}
            disabled={currentSlide === 1}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Previous slide"
          >
            ⏪
          </button>
          
          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Next slide"
          >
            ⏩
          </button>
          
          <button
            onClick={() => goToSlide(totalSlides)}
            disabled={currentSlide === totalSlides}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Last slide"
          >
            ⏭️
          </button>
          
          <div className="mx-4 flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max={totalSlides}
              value={currentSlide}
              onChange={(e) => {
                const slideNum = parseInt(e.target.value);
                if (slideNum >= 1 && slideNum <= totalSlides) {
                  goToSlide(slideNum);
                }
              }}
              className="w-12 px-2 py-1 text-center bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-purple-500"
            />
            <span className="text-gray-400">/ {totalSlides}</span>
          </div>
        </div>

        {/* Slide Title */}
        <div className="text-sm text-gray-300 max-w-48 truncate">
          {currentSlideData?.title || `Slide ${currentSlide}`}
        </div>
      </div>
    </div>
  );
};

const SlidesCustomizeModal: React.FC<SlidesCustomizeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedTheme, setSelectedTheme] = useState('ITEM');
  const [selectedContentStyle, setSelectedContentStyle] = useState('Bullet Points');
  const [selectedSlideRange, setSelectedSlideRange] = useState('1 - 10 Slides');
  const [customSlideRange, setCustomSlideRange] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [customThemes, setCustomThemes] = useState<string[]>([]);
  const [renamedThemes, setRenamedThemes] = useState<Record<string, string>>({});
  const [hiddenSystemThemes, setHiddenSystemThemes] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingTheme, setEditingTheme] = useState<string | null>(null);
  const [editingThemeName, setEditingThemeName] = useState('');
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);
  const [activeThemeMenu, setActiveThemeMenu] = useState<string | null>(null);

  const systemThemes = ['Business', 'Professional', 'Galaxy', 'ITEM'];
  const visibleSystemThemes = systemThemes.filter(theme => !hiddenSystemThemes.has(theme));
  const allThemes = ['+ Custom Theme', ...customThemes, ...visibleSystemThemes];
  
  // Get the display name for a theme (renamed name if exists, otherwise original)
  const getThemeDisplayName = (theme: string) => {
    return renamedThemes[theme] || theme;
  };
  
  // Get the original theme name from display name
  const getOriginalThemeName = useCallback((displayName: string) => {
    const entry = Object.entries(renamedThemes).find(([_, renamed]) => renamed === displayName);
    return entry ? entry[0] : displayName;
  }, [renamedThemes]);
  
  const getThemeCategory = (theme: string) => {
    if (theme === '+ Custom Theme') return '';
    if (customThemes.includes(theme)) return 'Customized';
    if (renamedThemes[theme] || theme === 'ITEM') return 'Customized';
    return 'System';
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      const fileName = file.name.replace('.pptx', '').replace('.PPTX', '');
      if (!customThemes.includes(fileName)) {
        setCustomThemes(prev => [...prev, fileName]);
        setSelectedTheme(fileName);
      }
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleThemeClick = (theme: string) => {
    if (theme === '+ Custom Theme') {
      fileInputRef.current?.click();
    } else {
      setSelectedTheme(theme);
    }
  };

  const handleEditTheme = (theme: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTheme(theme);
    setEditingThemeName(getThemeDisplayName(theme));
  };

  const handleSaveThemeName = useCallback(() => {
    if (editingTheme && editingThemeName.trim()) {
      const trimmedName = editingThemeName.trim();
      const originalTheme = getOriginalThemeName(editingTheme);
      
      // If editing a custom theme, update the custom themes list
      if (customThemes.includes(editingTheme)) {
        setCustomThemes(prev => 
          prev.map(theme => theme === editingTheme ? trimmedName : theme)
        );
      }
      // For system themes or already renamed themes, update the renamed themes mapping
      else {
        setRenamedThemes(prev => ({
          ...prev,
          [originalTheme]: trimmedName
        }));
      }
      
      // Update selected theme if it was the one being edited
      if (selectedTheme === editingTheme) {
        setSelectedTheme(trimmedName);
      }
    }
    
    setEditingTheme(null);
    setEditingThemeName('');
  }, [editingTheme, editingThemeName, customThemes, renamedThemes, selectedTheme, getOriginalThemeName]);

  const handleCancelEdit = () => {
    setEditingTheme(null);
    setEditingThemeName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveThemeName();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const canEditTheme = (theme: string) => {
    return customThemes.includes(theme) || theme === 'ITEM';
  };

  const isCustomizedTheme = (theme: string) => {
    return customThemes.includes(theme) || renamedThemes[theme] || theme === 'ITEM';
  };

  const handleDeleteTheme = (theme: string) => {
    console.log('Deleting theme:', theme);
    console.log('Custom themes:', customThemes);
    console.log('Renamed themes:', renamedThemes);
    console.log('Selected theme:', selectedTheme);
    
    // If it's a custom theme, remove from customThemes
    if (customThemes.includes(theme)) {
      console.log('Removing from custom themes');
      setCustomThemes(prev => prev.filter(t => t !== theme));
    }
    
    // If it's a renamed system theme, remove from renamedThemes
    // We need to find the original theme name that maps to this display name
    const originalTheme = getOriginalThemeName(theme);
    if (originalTheme !== theme && renamedThemes[originalTheme]) {
      console.log('Removing renamed theme:', originalTheme, '->', theme);
      setRenamedThemes(prev => {
        const newRenamed = { ...prev };
        delete newRenamed[originalTheme];
        return newRenamed;
      });
    }
    
    // If it's a system theme (including ITEM), hide it temporarily
    if (systemThemes.includes(theme)) {
      console.log('Hiding system theme:', theme);
      setHiddenSystemThemes(prev => new Set([...prev, theme]));
    }
    
    // If the deleted theme was selected, find a suitable replacement
    const currentDisplayName = getThemeDisplayName(theme);
    if (selectedTheme === currentDisplayName || selectedTheme === theme) {
      console.log('Finding replacement for selected theme');
      // Find the first available theme that's not hidden
      const updatedHiddenThemes = systemThemes.includes(theme) ? new Set([...hiddenSystemThemes, theme]) : hiddenSystemThemes;
      const availableSystemThemes = systemThemes.filter(t => !updatedHiddenThemes.has(t));
      const availableThemes = [...customThemes, ...availableSystemThemes];
      const replacement = availableThemes.length > 0 ? availableThemes[0] : 'Business';
      console.log('Setting replacement theme to:', replacement);
      setSelectedTheme(replacement);
    }
    
    setActiveThemeMenu(null);
  };
  
  const contentStyles = [
    {
      name: 'Bullet Points',
      description: 'Ideal for quick overviews and clear communication, helping you convey key information concisely.'
    },
    {
      name: 'Full Sentences',
      description: 'Best for elaborating on each point in detail, perfect for speeches or reports that require in-depth explanation.'
    }
  ];

  const slideRanges = [
    '1 - 10 Slides',
    '10 - 15 Slides', 
    '15 - 20 Slides',
    'Custom Range'
  ];

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
    'Russian', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Japanese', 
    'Korean', 'Arabic', 'Hindi', 'Dutch', 'Swedish', 'Norwegian'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editingTheme) {
        const target = event.target as HTMLElement;
        // 检查点击的元素是否是输入框或其子元素
        const isInputClick = target.tagName === 'INPUT' && target.getAttribute('data-editing') === editingTheme;
        
        // 如果不是点击输入框，则保存
        if (!isInputClick) {
          handleSaveThemeName();
        }
      }
    };

    if (editingTheme) {
      // 使用 setTimeout 确保事件监听器在输入框渲染后添加
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [editingTheme, handleSaveThemeName]);

  // Handle clicking outside to close theme menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeThemeMenu) {
        const target = event.target as HTMLElement;
        // Check if click is inside the theme menu dropdown
        const menuElement = document.querySelector(`[data-theme-menu="${activeThemeMenu}"]`);
        const menuButton = document.querySelector(`[data-theme-menu-button="${activeThemeMenu}"]`);
        
        // If click is not inside menu or menu button, close the menu
        if (menuElement && !menuElement.contains(target) && 
            menuButton && !menuButton.contains(target)) {
          setActiveThemeMenu(null);
        }
      }
    };

    if (activeThemeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [activeThemeMenu]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
      <div className="bg-gray-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Customize Slides</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Theme Section */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Theme</h3>
            <div className="grid grid-cols-4 gap-4">
              {allThemes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => handleThemeClick(theme)}
                  onMouseEnter={() => setHoveredTheme(theme)}
                  onMouseLeave={() => setHoveredTheme(null)}
                  className={`group p-4 rounded-xl text-center transition-all duration-200 relative ${
                    selectedTheme === theme && theme !== '+ Custom Theme'
                      ? 'bg-gray-800 border-2 border-purple-500'
                      : theme === '+ Custom Theme'
                      ? 'bg-gray-800 hover:bg-gray-700 border-2 border-dashed border-gray-600 hover:border-gray-500'
                      : 'bg-gray-800 hover:bg-gray-700 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    {theme === '+ Custom Theme' ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex items-center justify-center">
                          <Plus className="w-3 h-3 text-gray-400" />
                        </div>
                        <h4 className="font-medium text-gray-400">Custom Theme</h4>
                      </div>
                    ) : editingTheme === theme ? (
                      <input
                        type="text"
                        value={editingThemeName}
                        onChange={(e) => setEditingThemeName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onMouseDown={(e) => e.stopPropagation()}
                        onBlur={handleSaveThemeName}
                        data-editing={editingTheme}
                        className="bg-gray-700 text-white px-2 py-1 rounded text-sm font-medium w-full focus:outline-none"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <h4 className="font-medium text-white">{getThemeDisplayName(theme)}</h4>
                        {hoveredTheme === theme && isCustomizedTheme(theme) && (
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveThemeMenu(activeThemeMenu === theme ? null : theme);
                              }}
                              data-theme-menu-button={theme}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-600 rounded"
                            >
                              <MoreHorizontal size={12} className="text-gray-400 hover:text-white" />
                            </button>
                            
                            {/* Theme Menu Dropdown */}
                            {activeThemeMenu === theme && (
                              <div 
                                data-theme-menu={theme}
                                className="absolute right-0 top-full mt-1 w-32 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50"
                              >
                                <div className="py-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveThemeMenu(null);
                                      handleEditTheme(theme, e);
                                    }}
                                    className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                  >
                                    <Edit3 size={14} className="mr-2" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteTheme(theme);
                                    }}
                                    className="w-full flex items-center px-3 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
                                  >
                                    <Trash2 size={14} className="mr-2" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {theme === '+ Custom Theme' ? (
                    <div className="text-[10px] text-gray-400 mt-1 text-center">
                      Only support PPTX format
                    </div>
                  ) : getThemeCategory(theme) && (
                    <div className="text-[10px] text-gray-400 mt-1 text-left">
                      {getThemeCategory(theme)}
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pptx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Content Style Section */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Content Style</h3>
            <div className="grid grid-cols-1 gap-4">
              {contentStyles.map((style) => (
                <button
                  key={style.name}
                  onClick={() => setSelectedContentStyle(style.name)}
                  className={`p-4 rounded-xl text-left transition-all duration-200 ${
                    selectedContentStyle === style.name
                      ? 'bg-gray-800 border-2 border-purple-500'
                      : 'bg-gray-800 hover:bg-gray-700 border-2 border-transparent'
                  }`}
                >
                  <div className="mb-3">
                    <h4 className="font-medium text-white">{style.name}</h4>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {style.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Number of Slides and Language Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Number of Slides */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">No. of Slides</h3>
              <div className="relative">
                <select
                  value={selectedSlideRange}
                  onChange={(e) => {
                    setSelectedSlideRange(e.target.value);
                    setShowCustomRange(e.target.value === 'Custom Range');
                  }}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                >
                  {slideRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
              
              {showCustomRange && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={customSlideRange}
                    onChange={(e) => setCustomSlideRange(e.target.value)}
                    placeholder="e.g., 5 - 8 Slides"
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
                  />
                </div>
              )}
            </div>

            {/* Language */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Language</h3>
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                >
                  {languages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

const AudioCustomizeModal: React.FC<AudioCustomizeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFormat, setSelectedFormat] = useState('Deep Dive');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedLength, setSelectedLength] = useState('Default');
  const [focusText, setFocusText] = useState('');

  const formats = [
    {
      name: 'Deep Dive',
      description: 'A lively conversation between two hosts, unpacking and connecting topics in your sources'
    },
    {
      name: 'Brief',
      description: 'A bite-sized overview to help you grasp the core ideas from your sources quickly'
    },
    {
      name: 'Critique',
      description: 'An expert review of your sources, offering constructive feedback to help you improve your material'
    },
    {
      name: 'Debate',
      description: 'A thoughtful debate between two hosts, illuminating different perspectives on your sources'
    }
  ];

  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
  const lengths = ['Shorter', 'Default', 'Longer'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
      <div className="bg-gray-900 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Headphones className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Customize Audio Overview</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Format Section */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Format</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {formats.map((format) => (
                <button
                  key={format.name}
                  onClick={() => setSelectedFormat(format.name)}
                  className={`p-4 rounded-xl text-left transition-all duration-200 ${
                    selectedFormat === format.name
                      ? 'bg-purple-600/20'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-white">{format.name}</h4>
                    {selectedFormat === format.name && (
                      <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {format.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Language and Length Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Choose Language */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Choose language</h3>
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                >
                  {languages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            {/* Length */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Length</h3>
              <div className="flex rounded-lg border border-gray-600 overflow-hidden">
                {lengths.map((length) => (
                  <button
                    key={length}
                    onClick={() => setSelectedLength(length)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      selectedLength === length
                        ? 'bg-gray-800 text-white border-2 border-purple-500'
                        : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 border-2 border-transparent'
                    }`}
                  >
                    {length}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Focus Section */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">
              What should the AI hosts focus on in this episode?
            </h3>
            <div className="relative">
              <textarea
                value={focusText}
                onChange={(e) => setFocusText(e.target.value)}
                placeholder="Things to try"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px] resize-none placeholder-gray-500"
                rows={6}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

const TagSelectorModal: React.FC<TagSelectorModalProps> = ({
  isOpen,
  onClose,
  availableTags,
  selectedTags,
  onTagsChange,
}) => {
  const [tempSelectedTags, setTempSelectedTags] = useState<string[]>(selectedTags);

  useEffect(() => {
    if (isOpen) {
      setTempSelectedTags(selectedTags);
    }
  }, [isOpen, selectedTags]);

  const toggleTag = (tag: string) => {
    setTempSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleApply = () => {
    onTagsChange(tempSelectedTags);
    onClose();
  };

  const handleClear = () => {
    setTempSelectedTags([]);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Select Tags</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
            {availableTags.map((tag) => (
              <div
                key={tag}
                onClick={() => toggleTag(tag)}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <span className="text-gray-300">{tag}</span>
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                  tempSelectedTags.includes(tag)
                    ? 'bg-purple-500 border-purple-500'
                    : 'border-gray-600'
                }`}>
                  {tempSelectedTags.includes(tag) && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between space-x-3">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
            >
              Clear All
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Apply ({tempSelectedTags.length})
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  documentName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">
          Are you sure you want to delete this document?
        </h2>
        <p className="text-gray-300 mb-6">
          This action will remove "{documentName}" from the knowledge base folder. You will no longer be able to ask questions about it. This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-300 hover:text-white transition-colors rounded-md bg-gray-700 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
const ChatInterface: React.FC<ChatInterfaceProps> = ({ setIsSidebarCollapsed }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find the knowledge base title from the data
  const findKnowledgeBase = (id: string): { kb: KnowledgeBaseCard; type: KnowledgeType } | null => {
    for (const type of Object.values(KnowledgeType)) {
      const found = knowledgeBaseData[type].find(kb => kb.id === id);
      if (found) return { kb: found, type };
    }
    return null;
  };

  const knowledgeBaseInfo = id ? findKnowledgeBase(id) : null;
  const currentKnowledgeBase = knowledgeBaseInfo?.kb;
  const knowledgeBaseType = knowledgeBaseInfo?.type;
  const title = currentKnowledgeBase?.title || 'Knowledge Base';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'This paper, published in the Financial Analysts Journal in 2019, explores the application of machine learning algorithms (MLAs) for stock selection. The authors, Keywan Christian Rasekhschaffe and Robert C. Jones, argue that MLAs offer a better approach than traditional linear models, particularly since the 2008 financial crisis rendered many established quantitative factors less effective. They emphasize techniques like feature engineering and forecast combinations to mitigate the significant risk of overfitting when using MLAs with noisy financial data. The study demonstrates through a case study that these approaches can lead to results superior to basic linear techniques and that the MLAs can capture dynamic relationships between factors and returns.',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSourcePanelCollapsed, setIsSourcePanelCollapsed] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagSelectorOpen, setIsTagSelectorOpen] = useState(false);
  const [hoveredDocumentId, setHoveredDocumentId] = useState<string | null>(null);
  const [isStudioPanelCollapsed, setIsStudioPanelCollapsed] = useState(false);
  const [showAudioCustomizeModal, setShowAudioCustomizeModal] = useState(false);
  const [showVideoCustomizeModal, setShowVideoCustomizeModal] = useState(false);
  const [showSlidesCustomizeModal, setShowSlidesCustomizeModal] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContentItem[]>([]);
  const [isInSlidesPreview, setIsInSlidesPreview] = useState(false);
  const [selectedSlideItem, setSelectedSlideItem] = useState<GeneratedContentItem | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Collapse sidebar to icon-only when entering chat interface
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

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'doc1',
      name: 'HR Policy Manual.pdf',
      type: 'pdf',
      tags: ['HR', 'Policy', 'Management'],
      content: [
        {
          id: 'p1',
          text: 'This research paper explores the application of machine learning algorithms in stock selection and portfolio optimization.',
        },
        {
          id: 'p2',
          text: 'The study demonstrates that neural networks can effectively predict stock price movements based on historical data.',
        },
      ],
    },
    {
      id: 'doc2',
      name: 'Employee Benefits Guide.docx',
      type: 'docx',
      tags: ['HR', 'Benefits', 'Employee'],
      content: [
        {
          id: 'p1',
          text: 'Comprehensive guide to employee benefits and compensation packages.',
        },
      ],
    },
    {
      id: 'doc3',
      name: 'Recruitment Process.xlsx',
      type: 'xlsx',
      tags: ['HR', 'Recruitment', 'Process'],
      content: [
        {
          id: 'p1',
          text: 'Detailed recruitment workflow and hiring procedures.',
        },
      ],
    },
    {
      id: 'doc4',
      name: 'Performance Review Templates.pdf',
      type: 'pdf',
      tags: ['HR', 'Performance', 'Templates'],
      content: [
        {
          id: 'p1',
          text: 'Templates and guidelines for conducting performance reviews.',
        },
      ],
    },
    {
      id: 'doc5',
      name: 'Onboarding Presentation.pptx',
      type: 'pptx',
      tags: ['HR', 'Onboarding', 'Training'],
      content: [
        {
          id: 'p1',
          text: 'New employee onboarding presentation and materials.',
        },
      ],
    },
  ]);

  // Get all available tags from documents
  const availableTags = Array.from(
    new Set(
      documents
        .filter(doc => !doc.isDeleting)
        .flatMap(doc => doc.tags || [])
    )
  ).sort();

  // Group documents by selected tags
  const groupedDocuments = React.useMemo(() => {
    const availableDocuments = documents.filter(doc => !doc.isDeleting);
    
    if (selectedTags.length === 0) {
      return {
        ungrouped: availableDocuments,
        groups: []
      };
    }

    const groups: Array<{ tag: string; documents: Document[] }> = [];
    const documentsInGroups = new Set<string>();

    // Create groups for each selected tag - each document only appears in the first matching group
    selectedTags.forEach(tag => {
      const tagDocuments = availableDocuments.filter(doc => 
        doc.tags?.includes(tag) && !documentsInGroups.has(doc.id)
      );
      
      if (tagDocuments.length > 0) {
        groups.push({ tag, documents: tagDocuments });
        tagDocuments.forEach(doc => documentsInGroups.add(doc.id));
      }
    });

    // Documents not in any selected tag go to "Other"
    const otherDocuments = availableDocuments.filter(doc => 
      !documentsInGroups.has(doc.id)
    );

    return {
      ungrouped: [],
      groups,
      otherDocuments: otherDocuments.length > 0 ? otherDocuments : undefined
    };
  }, [documents, selectedTags]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeDropdown]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessages = [
      ...messages,
      { role: 'user' as const, content: inputValue },
    ];
    setMessages(newMessages);
    setInputValue('');

    setTimeout(() => {
      const response: ChatMessage = {
        role: 'assistant',
        content: 'Based on the research paper, machine learning algorithms (MLAs) have shown promising results in stock selection, particularly in the post-2008 financial crisis era. The authors emphasize the importance of feature engineering and forecast combinations to address overfitting issues when working with noisy financial data.',
        citations: [
          {
            docId: 'doc1',
            paragraphId: 'p1',
            text: 'Machine Learning for Stock Selection - Research Findings',
          },
        ],
      };
      setMessages([...newMessages, response]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    // Determine where to navigate back based on knowledge base type
    if (knowledgeBaseType === KnowledgeType.PERSONAL) {
      navigate('/', { state: { activeTab: 'personal' } });
    } else if (knowledgeBaseType === KnowledgeType.ENTERPRISE) {
      navigate('/', { state: { activeTab: 'enterprise' } });
    } else {
      // Default fallback to dialogues
      navigate('/', { state: { activeTab: 'dialogues' } });
    }
  };

  const toggleSourceSelection = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (doc?.isDeleting) return; // Don't allow selection of deleting documents
    
    setSelectedSources(prev =>
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const toggleAllSources = () => {
    const availableDocuments = documents.filter(doc => !doc.isDeleting);
    if (selectedSources.length === availableDocuments.length) {
      setSelectedSources([]);
    } else {
      setSelectedSources(availableDocuments.map(doc => doc.id));
    }
  };

  const getFileIcon = (type: string, fileName: string) => {
    // Extract file extension from filename
    const extension = fileName.split('.').pop()?.toLowerCase() || type.toLowerCase();
    
    // Create a styled document type badge
    const getTypeDisplay = (ext: string) => {
      switch (ext) {
        case 'pdf':
          return { text: 'PDF', bgColor: 'bg-red-500', textColor: 'text-white' };
        case 'docx':
        case 'doc':
          return { text: 'WORD', bgColor: 'bg-blue-500', textColor: 'text-white' };
        case 'xlsx':
        case 'xls':
          return { text: 'EXCEL', bgColor: 'bg-green-500', textColor: 'text-white' };
        case 'pptx':
        case 'ppt':
          return { text: 'PPT', bgColor: 'bg-orange-500', textColor: 'text-white' };
        case 'txt':
          return { text: 'TXT', bgColor: 'bg-gray-500', textColor: 'text-white' };
        case 'csv':
          return { text: 'CSV', bgColor: 'bg-green-600', textColor: 'text-white' };
        case 'json':
          return { text: 'JSON', bgColor: 'bg-yellow-500', textColor: 'text-black' };
        case 'xml':
          return { text: 'XML', bgColor: 'bg-purple-500', textColor: 'text-white' };
        case 'md':
          return { text: 'MD', bgColor: 'bg-indigo-500', textColor: 'text-white' };
        default:
          return { text: 'FILE', bgColor: 'bg-gray-500', textColor: 'text-white' };
      }
    };

    const typeInfo = getTypeDisplay(extension);
    
    return (
      <div className={`w-8 h-6 ${typeInfo.bgColor} ${typeInfo.textColor} rounded text-xs font-bold flex items-center justify-center`}>
        {typeInfo.text}
      </div>
    );
  };

  const handleDropdownClick = (e: React.MouseEvent, docId: string) => {
    e.stopPropagation();
    const doc = documents.find(d => d.id === docId);
    if (doc?.isDeleting) return; // Don't show dropdown for deleting documents
    
    setActiveDropdown(activeDropdown === docId ? null : docId);
  };

  const handleDocumentAction = (action: string, docId: string, docName: string) => {
    setActiveDropdown(null);
    
    switch (action) {
      case 'download':
        console.log('Downloading:', docName);
        // Implement download logic
        break;
      case 'preview':
        console.log('Previewing:', docName);
        // Implement preview logic
        break;
      case 'delete':
        const doc = documents.find(d => d.id === docId);
        if (doc) {
          setDocumentToDelete(doc);
          setShowDeleteConfirmation(true);
        }
        break;
    }
  };

  const handleDeleteConfirm = () => {
    if (documentToDelete) {
      // Set the document to deleting state
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === documentToDelete.id 
            ? { ...doc, isDeleting: true }
            : doc
        )
      );
      
      // Remove from selected sources if it was selected
      setSelectedSources(prev => prev.filter(id => id !== documentToDelete.id));
      
      // Simulate deletion process (remove after 3 seconds)
      setTimeout(() => {
        setDocuments(prev => prev.filter(doc => doc.id !== documentToDelete.id));
      }, 3000);
      
      setShowDeleteConfirmation(false);
      setDocumentToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
    setDocumentToDelete(null);
  };

  const availableDocuments = documents.filter(doc => !doc.isDeleting);
  const availableSelectedCount = selectedSources.filter(id => 
    documents.find(doc => doc.id === id && !doc.isDeleting)
  ).length;

  const generateSlides = () => {
    const slideId = `slide-${Date.now()}`;
    
    // 创建加载状态的Slide
    const loadingSlide: GeneratedContentItem = {
      id: slideId,
      type: 'slide',
      title: 'Generating Slides...',
      subtitle: undefined,
      sources: availableSelectedCount,
      timeAgo: 'just now',
      icon: 'FileText',
      isLoading: true,
      loadingText: 'Come back in a few minutes'
    };
    
    setGeneratedContent(prev => [loadingSlide, ...prev]);
    
    // 3秒后完成加载
    setTimeout(() => {
      setGeneratedContent(prev => 
        prev.map(item => 
          item.id === slideId 
            ? {
                ...item,
                title: `${title} Presentation`,
                isLoading: false,
                loadingText: undefined
              }
            : item
        )
      );
    }, 3000);
  };

  const handleSelectAllInTag = (tagDocuments: Document[]) => {
    const tagDocumentIds = tagDocuments.map(doc => doc.id);
    const allTagDocsSelected = tagDocumentIds.every(id => selectedSources.includes(id));
    
    if (allTagDocsSelected) {
      // Deselect all documents in this tag
      setSelectedSources(prev => prev.filter(id => !tagDocumentIds.includes(id)));
    } else {
      // Select all documents in this tag
      const newSelections = [...new Set([...selectedSources, ...tagDocumentIds])];
      setSelectedSources(newSelections);
    }
  };

  const isAllTagDocsSelected = (tagDocuments: Document[]) => {
    const tagDocumentIds = tagDocuments.map(doc => doc.id);
    return tagDocumentIds.length > 0 && tagDocumentIds.every(id => selectedSources.includes(id));
  };

  const renderDocumentItem = (doc: Document, keyPrefix: string = '') => (
    <div
      key={`${keyPrefix}${doc.id}`}
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors relative ${
        doc.isDeleting 
          ? 'bg-gray-700/50 opacity-60 cursor-not-allowed' 
          : 'hover:bg-gray-700'
      }`}
      onClick={() => !doc.isDeleting && toggleSourceSelection(doc.id)}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className={`w-5 h-5 rounded border flex items-center justify-center ${
          selectedSources.includes(doc.id) && !doc.isDeleting
            ? 'bg-purple-500 border-purple-500'
            : 'border-gray-600'
        }`}>
          {selectedSources.includes(doc.id) && !doc.isDeleting && (
            <Check className="w-4 h-4 text-white" />
          )}
        </div>
        {getFileIcon(doc.type, doc.name)}
        <div className="flex flex-col flex-1 min-w-0">
          <span className={`text-sm truncate ${
            doc.isDeleting ? 'text-gray-500' : 'text-white'
          }`}>
            {doc.name}
          </span>
          {doc.isDeleting && (
            <span className="text-xs text-red-400 font-medium">
              Deleting...
            </span>
          )}
        </div>
        
        {/* Tag Icon with Hover Tooltip - Only show when no tags are selected for grouping */}
        {doc.tags && doc.tags.length > 0 && !doc.isDeleting && selectedTags.length === 0 && (
          <div className="relative">
            <button
              onMouseEnter={() => setHoveredDocumentId(doc.id)}
              onMouseLeave={() => setHoveredDocumentId(null)}
              className="p-1 text-gray-400 hover:text-purple-400 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Tag size={16} />
            </button>
            
            {/* Tooltip */}
            {hoveredDocumentId === doc.id && (
              <div 
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-3 min-w-max pointer-events-none"
                onMouseEnter={() => setHoveredDocumentId(doc.id)}
                onMouseLeave={() => setHoveredDocumentId(null)}
              >
                <div className="flex flex-col gap-1">
                  {doc.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap text-center"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Tooltip arrow pointing up */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-600"></div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {!doc.isDeleting && (
        <button
          onClick={(e) => handleDropdownClick(e, doc.id)}
          className="p-1 hover:bg-gray-600 rounded transition-colors"
        >
          <MoreHorizontal size={16} className="text-gray-400" />
        </button>
      )}

      {activeDropdown === doc.id && !doc.isDeleting && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
          <div className="py-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDocumentAction('download', doc.id, doc.name);
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <Download size={16} className="mr-3" />
              Download
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDocumentAction('preview', doc.id, doc.name);
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <Eye size={16} className="mr-3" />
              Preview
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDocumentAction('delete', doc.id, doc.name);
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
            >
              <Trash2 size={16} className="mr-3" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 bg-black p-6">
      {/* Back Button */}
      <div className="mb-6 flex items-center">
        <button
          onClick={handleClose}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="text-lg">Back</span>
        </button>
      </div>

      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        {/* Left Sources Panel */}
        <div className={`${
          isSourcePanelCollapsed ? 'w-16' : 'w-96'
        } bg-primary-color rounded-xl shadow-lg flex flex-col transition-all duration-300`}>
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!isSourcePanelCollapsed && <h2 className="text-xl font-semibold">Sources</h2>}
            </div>
            <button
              onClick={() => setIsSourcePanelCollapsed(!isSourcePanelCollapsed)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isSourcePanelCollapsed ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
            </button>
          </div>

          {!isSourcePanelCollapsed && (
            <>
              <div className="p-6 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 rounded-lg py-2.5 transition-colors text-white">
                    <Plus size={18} />
                    <span>Add</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 rounded-lg py-2.5 transition-colors text-white">
                    <Search size={18} />
                    <span>Discover</span>
                  </button>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setIsTagSelectorOpen(!isTagSelectorOpen)}
                    className="w-full flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                  >
                    <div className="flex items-center space-x-3">
                      <Tag size={18} />
                      <span>Tag</span>
                      {selectedTags.length > 0 && (
                        <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                          {selectedTags.length}
                        </span>
                      )}
                    </div>
                    <ChevronDown 
                      size={16} 
                      className={`transition-transform ${isTagSelectorOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>

                  <TagSelectorModal
                    isOpen={isTagSelectorOpen}
                    onClose={() => setIsTagSelectorOpen(false)}
                    availableTags={availableTags}
                    selectedTags={selectedTags}
                    onTagsChange={setSelectedTags}
                  />
                </div>

                <button
                  onClick={toggleAllSources}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors text-white"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                      availableSelectedCount === availableDocuments.length && availableDocuments.length > 0
                        ? 'bg-purple-500 border-purple-500'
                        : 'border-gray-600'
                    }`}>
                      {availableSelectedCount === availableDocuments.length && availableDocuments.length > 0 && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span>Select all sources</span>
                  </div>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-2">
                {selectedTags.length === 0 ? (
                  // Show ungrouped documents when no tags are selected
                  groupedDocuments.ungrouped.map(doc => renderDocumentItem(doc))
                ) : (
                  // Show grouped documents when tags are selected
                  <div className="space-y-4">
                    {groupedDocuments.groups.map(group => (
                      <div key={group.tag} className="space-y-2">
                        {/* Tag Group Header */}
                        <div className="flex items-center justify-between px-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-purple-400">{group.tag}</span>
                            <span className="text-xs text-gray-500">({group.documents.length})</span>
                          </div>
                          <button
                            onClick={() => handleSelectAllInTag(group.documents)}
                            className="text-xs text-gray-400 hover:text-purple-400 transition-colors"
                          >
                            {isAllTagDocsSelected(group.documents) ? 'Deselect Group' : 'Select Group'}
                          </button>
                        </div>
                        
                        {/* Documents in this tag */}
                        <div className="space-y-1 pl-4 border-l-2 border-purple-500/30">
                          {group.documents.map(doc => renderDocumentItem(doc, `${group.tag}-`))}
                        </div>
                      </div>
                    ))}
                    
                    {/* Other Group */}
                    {groupedDocuments.otherDocuments && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between px-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-400">Other</span>
                            <span className="text-xs text-gray-500">({groupedDocuments.otherDocuments.length})</span>
                          </div>
                          <button
                            onClick={() => handleSelectAllInTag(groupedDocuments.otherDocuments!)}
                            className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
                          >
                            {isAllTagDocsSelected(groupedDocuments.otherDocuments!) ? 'Deselect Group' : 'Select Group'}
                          </button>
                        </div>
                        
                        <div className="space-y-1 pl-4 border-l-2 border-gray-500/30">
                          {groupedDocuments.otherDocuments.map(doc => renderDocumentItem(doc, 'other-'))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Middle Chat Area */}
        <div className="flex-1 bg-primary-color rounded-xl shadow-lg flex flex-col min-w-0">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BookOpen size={24} className="text-gray-400" />
                <h1 className="text-2xl font-semibold text-white">{title}</h1>
              </div>
              <span className="text-sm text-gray-400">
                {availableSelectedCount} source{availableSelectedCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  {message.role === 'assistant' ? (
                    <Bot size={20} className="text-purple-500" />
                  ) : (
                    <User size={20} className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-750 rounded-xl p-6">
                    <p className="text-gray-200 leading-relaxed">{message.content}</p>
                  </div>
                  
                  {index === 0 && (
                    <div className="flex items-center space-x-3 mt-4">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-600 transition-colors">
                        <StickyNote size={16} />
                        <span>Save to note</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-600 transition-colors">
                        <Plus size={16} />
                        <span>Add note</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-600 transition-colors">
                        <Headphones size={16} />
                        <span>Audio Overview</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-600 transition-colors">
                        <Network size={16} />
                        <span>Mind Map</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 border-t border-gray-700">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Start typing..."
                className="w-full bg-gray-750 text-white px-4 py-3 rounded-lg pr-24 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-3">
                <span className="text-sm text-gray-400">
                  {availableSelectedCount} source{availableSelectedCount !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Studio Panel */}
        <div className={`${
          isStudioPanelCollapsed ? 'w-16' : isInSlidesPreview ? 'w-[600px]' : 'w-96'
        } bg-primary-color rounded-xl shadow-lg flex flex-col transition-all duration-300`}>
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!isStudioPanelCollapsed && (
                <>
                  {isInSlidesPreview ? (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <button
                        onClick={() => {
                          setIsInSlidesPreview(false);
                          setSelectedSlideItem(null);
                        }}
                        className="hover:text-white transition-colors"
                      >
                        Studio
                      </button>
                      <span>→</span>
                      <span className="text-white">Slides</span>
                    </div>
                  ) : (
                    <h2 className="text-xl font-semibold">Studio</h2>
                  )}
                </>
              )}
            </div>
            <button
              onClick={() => {
                if (isInSlidesPreview) {
                  setIsInSlidesPreview(false);
                  setSelectedSlideItem(null);
                } else {
                  setIsStudioPanelCollapsed(!isStudioPanelCollapsed);
                }
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isStudioPanelCollapsed ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
            </button>
          </div>

          {isStudioPanelCollapsed ? (
            /* Collapsed Studio Panel - Show Icons Vertically */
            <div className="flex-1 flex flex-col items-center justify-start space-y-6 pt-6">
              <button className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center hover:bg-blue-500/30 transition-colors group" title="Audio Overview">
                <Headphones size={20} className="text-blue-400" />
              </button>
              
              <button className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center hover:bg-purple-500/30 transition-colors group" title="Video Overview">
                <Video size={20} className="text-purple-400" />
              </button>
              
              <button className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center hover:bg-green-500/30 transition-colors group" title="Mind Map">
                <Network size={20} className="text-green-400" />
              </button>
              
              <button className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center hover:bg-orange-500/30 transition-colors group" title="Reports">
                <BarChart3 size={20} className="text-orange-400" />
              </button>
              
              <button className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center hover:bg-yellow-500/30 transition-colors group" title="Slides">
                <span className="text-lg">📑</span>
              </button>
            </div>
          ) : isInSlidesPreview && selectedSlideItem ? (
            /* Slides Preview Mode */
            <div className="flex-1 flex flex-col">
              <RealPPTXViewer slideItem={selectedSlideItem} />
            </div>
          ) : (
            /* Expanded Studio Panel */
            <div className="flex-1 p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Audio Overview Card */}
                <button 
                  className="bg-gray-800 hover:bg-gray-700 rounded-xl p-4 flex flex-col items-center justify-center space-y-3 transition-colors group min-h-[120px] relative"
                >
                  {/* Edit Icon - Top Right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAudioCustomizeModal(true);
                    }}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-600 rounded"
                  >
                    <Edit3 size={16} className="text-gray-400 hover:text-white" />
                  </button>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <Headphones size={24} className="text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-200 text-center">Audio Overview</span>
                </button>

                {/* Video Overview Card */}
                <button 
                  onClick={() => setShowVideoCustomizeModal(true)}
                  className="bg-gray-800 hover:bg-gray-700 rounded-xl p-4 flex flex-col items-center justify-center space-y-3 transition-colors group min-h-[120px] relative"
                >
                  {/* Edit Icon - Top Right */}
                  <div className="absolute top-3 right-3 transition-opacity">
                    <Edit3 size={16} className="text-gray-400 hover:text-white" />
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <Video size={24} className="text-purple-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-200 text-center">Video Overview</span>
                </button>

                {/* Mind Map Card */}
                <button className="bg-gray-800 hover:bg-gray-700 rounded-xl p-4 flex flex-col items-center justify-center space-y-3 transition-colors group min-h-[120px]">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <Network size={24} className="text-green-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-200 text-center">Mind Map</span>
                </button>

                {/* Reports Card */}
                <button className="bg-gray-800 hover:bg-gray-700 rounded-xl p-4 flex flex-col items-center justify-center space-y-3 transition-colors group min-h-[120px]">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                    <BarChart3 size={24} className="text-orange-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-200 text-center">Reports</span>
                </button>
              </div>
              
              {/* Second Row - Slides Card */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={generateSlides}
                  className="bg-gray-800 hover:bg-gray-700 rounded-xl p-4 flex flex-col items-center justify-center space-y-3 transition-colors group min-h-[120px] relative"
                >
                  {/* Edit Icon - Top Right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSlidesCustomizeModal(true);
                    }}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-600 rounded"
                  >
                    <Edit3 size={16} />
                  </button>
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                    <span className="text-2xl">📑</span>
                  </div>
                  <span className="text-sm font-medium text-gray-200 text-center">Slides</span>
                </button>
                
                {/* Empty slot for future cards */}
                <div></div>
              </div>

              {/* Divider */}
              <div className="mt-6 mb-6">
                <div className="border-t border-gray-700"></div>
              </div>

              {/* Generated Content List */}
              {generatedContent.length > 0 && (
                <div className="space-y-3">
                  {generatedContent.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer"
                      onClick={() => {
                        if (item.type === 'slide' && !item.isLoading) {
                          setSelectedSlideItem(item);
                          setIsInSlidesPreview(true);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            {item.isLoading ? (
                              <Loader size={16} className="text-yellow-400 animate-spin" />
                            ) : (
                              <span className="text-lg">📑</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-white truncate mb-1">
                              {item.title}
                            </h3>
                            {item.isLoading && item.loadingText ? (
                              <p className="text-xs text-gray-400">
                                {item.loadingText}
                              </p>
                            ) : (
                              <p className="text-xs text-gray-400">
                                {item.sources} source{item.sources !== 1 ? 's' : ''} • {item.timeAgo}
                              </p>
                            )}
                          </div>
                        </div>
                        <button 
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Studio Output Info */}
              {generatedContent.length === 0 && (
                <div className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-400">Studio output will be saved here</span>
                    <Edit3 size={16} className="text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    After adding sources, click to add Audio Overview, Study Guide, Mind Map, and more!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        documentName={documentToDelete?.name || ''}
      />

      {/* Audio Customize Modal */}
      <AudioCustomizeModal
        isOpen={showAudioCustomizeModal}
        onClose={() => setShowAudioCustomizeModal(false)}
      />

      {/* Slides Customize Modal */}
      <SlidesCustomizeModal
        isOpen={showSlidesCustomizeModal}
        onClose={() => setShowSlidesCustomizeModal(false)}
      />
    </div>
  );
};

export default ChatInterface;