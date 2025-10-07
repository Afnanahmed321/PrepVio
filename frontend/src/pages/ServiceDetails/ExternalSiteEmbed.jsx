// ExternalSiteEmbed.jsx
import React from 'react'

const ExternalSiteEmbed = () => {
  // IMPORTANT: Replace this with the actual deployed URL of your JobPortal project
  const deployedUrl = "http://localhost:5173"; 

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      {/* The iframe allows you to embed another webpage.
        You must ensure the external site allows embedding (via CORS/CSP headers).
      */}
      <iframe
        src={deployedUrl}
        title="Job Portal External Site"
        style={{ 
          border: 'none', 
          width: '100%', 
          height: '100%' 
        }}
      />
    </div>
  );
};

export default ExternalSiteEmbed;