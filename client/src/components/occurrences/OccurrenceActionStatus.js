import React from 'react';

// TODO: spinner animation

const OccurrenceActionStatus = ({ status }) => (
  <div className="absolute h-full w-full flex items-center justify-center bg-gray-300 bg-opacity-75">
    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"     
      stroke="currentColor" className="h-6 w-6 text-gray-600"
    >
      <circle cx="12" cy="12" r="8" stroke="currentColor" pathLength="8"></circle>
      {/* <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> */}
    </svg>
    <span className="ml-2">{ status }</span>
  </div>
);

export default OccurrenceActionStatus;