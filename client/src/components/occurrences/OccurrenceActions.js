import React from 'react';
import Tooltip from '../Tooltip';
import { calcNextDay } from '../../util';

const OccurrenceActions = ({ date, onDelete, onMoveDate, onEdit }) => {
  const nextDay = calcNextDay(date, 1);
  const prevDay = calcNextDay(date, -1);

  return (
    <div className="relative flex items-center justify-between">

      {/* MOVE TO PREV DAY */}
      <span 
        className="tooltip text-gray-600 hover:text-gray-800 cursor-pointer"
        onClick={ () => onMoveDate(prevDay) }
      >
        <Tooltip content={`Move to ${ prevDay }`} />
        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" 
          stroke="currentColor" className="w-5 h-5"
        >
          <path d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
      </span>

      {/* MOVE TO NEXT DAY */}
      <span 
        className="tooltip ml-2 text-gray-600 hover:text-gray-800 cursor-pointer"
        onClick={ () => onMoveDate(nextDay) }
      >
        <Tooltip content={`Move to ${ nextDay }`} />
        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" 
          stroke="currentColor" className="w-5 h-5"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </span>

      {/* EDIT OCCURRENCE */}
      <span 
        className="tooltip ml-5 text-gray-600 hover:text-gray-800 cursor-pointer"
        onClick={ onEdit }
      >
        <Tooltip content="Edit occurrence" />
        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" 
          stroke="currentColor" className="w-5 h-5"
        >
          <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
          </path>
        </svg>
      </span>

      {/* DELETE OCCURRENCE */}
      <span 
        className="tooltip ml-2 text-red-500 hover:text-red-700 cursor-pointer"
        onClick={ onDelete }
      >
        <Tooltip content="Delete occurrence" />
        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"
        >
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
          </path>
        </svg>
      </span>

    </div>
  );
}

export default OccurrenceActions;