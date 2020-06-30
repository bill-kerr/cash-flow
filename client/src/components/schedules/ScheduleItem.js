import React from 'react';

export default ({ schedule }) => {
  return (
    <div className="w-full py-2 pl-4">
      { schedule.description }
    </div>
  );
};