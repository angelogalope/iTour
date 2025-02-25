import React from 'react';
import { useNavigate } from 'react-router';

const ARView = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div style={{ width: '100%', height: '845' }}>
      <iframe
        src="https://app.cloudpano.com/tours/bnf-q9khW"
        title="CloudPano 360 VR Tour"
        width="100%"
        height="845"
        frameBorder="0"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
    </div>
  );
};

export default ARView;
