import React, { useState } from 'react';
import { connect } from 'react-redux';
import { formatCurrency } from '../../util';
import { createScheduleException } from '../../actions/schedule-exceptions';
import { deleteOccurrence } from '../../actions/occurrences';

const OccurrenceItem = ({ 
  occurrence, 
  balance, 
  currencyCode, 
  createScheduleException,
  deleteOccurrence
}) => {
  const [isActive, setIsActive] = useState(false);

  const onClickDelete = () => {
    const scheduleException = {
      schedule: occurrence.schedule,
      occurrenceDeleted: true,
      date: occurrence.date
    };

    deleteOccurrence(occurrence.schedule, occurrence.date);
    createScheduleException(scheduleException);
  };

  const renderActions = () => {
    if (!isActive) {
      return;
    }

    return (
      <div className="flex items-center justify-between">

        {/* EDIT OCCURRENCE */}
        <span className="flex items-center text-gray-600 hover:text-gray-800">
          <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" 
            stroke="currentColor" className="w-5 h-5"
          >
            <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
            </path>
          </svg>
        </span>

        {/* DELETE OCCURRENCE */}
        <span 
          className="ml-2 text-red-500 hover:text-red-700"
          onClick={ onClickDelete }
        >
          <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"
          >
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
              </path>
          </svg>
        </span>

      </div>
    );
  };

  return (
    <tr 
      className={ `text-sm cursor-pointer ${ isActive ? 'bg-blue-100' : '' }` }
      onMouseOver={ () => setIsActive(true) }
      onMouseLeave={ () => setIsActive(false) }
    >
      <td className="py-2 pl-4 whitespace-no-wrap">{ occurrence.date }</td>
      <td className="py-2 pl-2 whitespace-no-wrap">{ occurrence.description }</td>
      <td className="py-2 pl-2 whitespace-no-wrap text-right">{ formatCurrency(occurrence.amount, currencyCode) }</td>
      <td className="py-2 pl-2 whitespace-no-wrap text-right">{ formatCurrency(balance, currencyCode) }</td>
      <td className="py-2 pl-2 pr-4 my-auto whitespace-no-wrap text-right flex items-center justify-end">
        { renderActions() }
      </td>
    </tr>
  );
};

const mapStateToProps = state => {
  return {
    currencyCode: state.settings.currencyCode
  };
};

export default connect(
  mapStateToProps, 
  { createScheduleException, deleteOccurrence }
)(OccurrenceItem);