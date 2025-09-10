import React from 'react';
import { useNavigate } from 'react-router-dom';
import UploadDocumentModal from './UploadDocumentModal';

const UploadDocumentForm: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <UploadDocumentModal 
      isOpen={true}
      onClose={() => navigate('/')}
      isFullPage={true}
    />
  );
};

export default UploadDocumentForm;