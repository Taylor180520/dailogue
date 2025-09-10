import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minimize2, Share2, Download } from 'lucide-react';

interface PptPreviewPageProps {
  setIsSidebarCollapsed: (collapsed: boolean) => void;
}

const PptPreviewPage: React.FC<PptPreviewPageProps> = ({ setIsSidebarCollapsed }) => {
  const { slideId } = useParams<{ slideId: string }>(); // Assuming slideId will be passed via route params
  const navigate = useNavigate();

  // Effect to collapse/uncollapse sidebar
  useEffect(() => {
    setIsSidebarCollapsed(true); // Collapse sidebar on mount
    return () => {
      setIsSidebarCollapsed(false); // Uncollapse sidebar on unmount
    };
  }, [setIsSidebarCollapsed]);

  const handleGoBackToStudio = () => {
    navigate('/'); // Navigate back to the main Studio list
  };

  const handleCollapse = () => {
    navigate('/'); // Navigate back to the main Studio list
  };

  // Placeholder data for the slide
  // In a real application, you would fetch slide details using slideId
  const slideTitle = "Unpacking SKAdNetwork";
  const slideSource = "Based on 2 sources";

  return (
    <div className="flex-1 flex flex-col bg-black text-white">
      {/* Header / Breadcrumb */}
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <div className="flex items-center space-x-2 text-gray-400">
          <button onClick={handleGoBackToStudio} className="hover:text-white transition-colors">
            Studio
          </button>
          <span>&gt;</span>
          <span className="text-white">Slides</span>
        </div>
        <button
          onClick={handleCollapse}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          title="Collapse"
        >
          <Minimize2 size={20} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Slide Title and Actions */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">{slideTitle}</h1>
              <p className="text-gray-400 text-sm">{slideSource}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white" title="Share">
                <Share2 size={20} />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white" title="Download">
                <Download size={20} />
              </button>
            </div>
          </div>

          {/* PPT Preview Area */}
          <div className="bg-gray-800 rounded-lg flex items-center justify-center h-[600px] text-gray-400 text-xl">
            Implement a ppt online viewer here
          </div>

          {/* Placeholder for pagination/thumbnails if needed */}
          {/* <div className="mt-8 grid grid-cols-5 gap-4">
            <div className="bg-gray-700 h-24 rounded-md flex items-center justify-center text-sm">Slide 1</div>
            <div className="bg-gray-700 h-24 rounded-md flex items-center justify-center text-sm">Slide 2</div>
            <div className="bg-gray-700 h-24 rounded-md flex items-center justify-center text-sm">Slide 3</div>
            <div className="bg-gray-700 h-24 rounded-md flex items-center justify-center text-sm">Slide 4</div>
            <div className="bg-gray-700 h-24 rounded-md flex items-center justify-center text-sm">Slide 5</div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PptPreviewPage;