import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const VRView = () => {
  const navigate = useNavigate();
  const location = useLocation();
//   const { tourId } = location.state || {}; // Get tourId from state

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <button
        className="absolute top-4 left-4 px-4 py-2 bg-white text-black rounded-lg shadow"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      {/* {tourId ? (
        <div className="w-full max-w-4xl">
          <div id={tourId}>
            <script
              type="text/javascript"
              async
              data-short={tourId}
              data-path="tours"
              data-is-self-hosted="undefined"
              width="100%"
              height="500px"
              src="https://app.cloudpano.com/public/shareScript.js"
            ></script>
          </div>
        </div>
      ) : (
        <p className="text-white">No VR tour available.</p>
      )} */}
       <div style={{ width: '100vw', height: '100vh' }}>
      <iframe
        src="/cloudpano-tour/index.html"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="360 Virtual Tour"
      />
    </div>
    </div>
  );
};

export default VRView;
