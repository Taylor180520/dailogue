import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import UploadDocumentForm from '../components/UploadDocumentForm';

interface UploadDocumentPageProps {
  setIsSidebarVisible: (visible: boolean) => void;
}

const UploadDocumentPage: React.FC<UploadDocumentPageProps> = ({ setIsSidebarVisible }) => {
  const navigate = useNavigate();

  useEffect(() => {
    setIsSidebarVisible(false);
    return () => setIsSidebarVisible(true);
  }, [setIsSidebarVisible]);

  return (
    <div className="flex-1 bg-black p-6">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="text-lg">Back to Enterprise Knowledge</span>
        </button>
        <h1 className="text-2xl font-semibold"></h1>
        <div className="w-24"></div>
      </div>
      <UploadDocumentForm />
    </div>
  );
};

export default UploadDocumentPage;