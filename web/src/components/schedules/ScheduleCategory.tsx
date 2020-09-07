import React from 'react';

interface ScheduleCategoryProps {
  header: string;
}

export const ScheduleCategory: React.FC<ScheduleCategoryProps> = ({ header }) => {
  return (
    <div className="">
      <span className="small-header">{header}</span>
      <div className="mt-2">
        <div className="inline bg-green-300 text-green-900 rounded-full px-2 py-1 font-bold text-sm">+ $300</div>
        <span className="ml-2">this is the description</span>
      </div>
      <div className="mt-3">
        <div className="inline bg-green-300 text-green-900 rounded-full px-2 py-1 font-bold text-sm">+ $300</div>
        <span className="ml-2">this is the description</span>
      </div>
      <div className="mt-3">
        <div className="inline bg-red-300 text-red-900 rounded-full px-2 py-1 font-bold text-sm">- $1500</div>
        <span className="ml-2">this is the description</span>
      </div>
    </div>
  );
};
