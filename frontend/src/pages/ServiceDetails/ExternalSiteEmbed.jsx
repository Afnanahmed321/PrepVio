// ExternalSiteEmbed.jsx
import React, { useEffect, useState } from "react";

const ExternalSiteEmbed = () => {
  // Replace with your Job Portal URL (dev or prod)
  const deployedUrl =
    import.meta.env.VITE_JOB_PORTAL_URL || "http://localhost:5174";

  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    // Small delay for UX
    const timer = setTimeout(() => {
      window.location.href = deployedUrl;
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, [deployedUrl]);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Redirecting to Job Portal...</h2>
      <p>Please wait a moment. If you are not redirected automatically,</p>
      <a
        href={deployedUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#007bff",
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >
        click here to open the Job Portal
      </a>
    </div>
  );
};

export default ExternalSiteEmbed;
