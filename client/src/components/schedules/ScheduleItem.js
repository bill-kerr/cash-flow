import React from 'react';
import { getFrequencyDescription } from '../../util';

const ScheduleItem = ({ schedule }) => {
  return (
    <div className="w-full shadow text-green-900 mx-2">
      <div className="p-2 bg-green-200 rounded-t">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">
            ${ schedule.amount }
          </span>
          <span className="cursor-pointer rounded-full p-1 hover:bg-green-300">
            <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"
              stroke="currentColor" className="h-4 w-4"
            >
              <path d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
            </svg>
          </span>
        </div>
        <p className="text-xs text-green-700">
          { getFrequencyDescription(schedule) }
        </p>
      </div>
      <div className="p-2 bg-green-100 rounded-b">
        <h4 className="font-medium text-sm">
          { schedule.description }
        </h4>
      </div>
    </div>
  );
};

export default ScheduleItem;