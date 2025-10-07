import React from 'react';
import { useParams } from 'react-router-dom';
import LearnAndPerform from './Learn and perform/LearnAndPerform.jsx';
import ExternalSiteEmbed from './ExternalSiteEmbed.jsx'; 

const ServiceRouter = () => {
  const { serviceSlug } = useParams();

  // Map service slugs to their respective components
  const serviceComponents = {
    'learn-and-perform': LearnAndPerform,
    'dfdf': ExternalSiteEmbed,
  };

  // Get the component for the current service slug
  const ServiceComponent = serviceComponents[serviceSlug];

  // If no matching service found, show error
  if (!ServiceComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Service Not Found</h1>
          <p className="text-gray-600">The service "{serviceSlug}" does not exist.</p>
        </div>
      </div>
    );
  }

  return <ServiceComponent />;
};

export default ServiceRouter;