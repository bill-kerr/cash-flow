import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { getFrequencyDescription } from '../../util';
import TransactionBadge from '../TransactionBadge';
import { deleteSchedule } from '../../actions/schedules';
import { fetchOccurrences } from '../../actions/occurrences';

const styles = {
  positive: {
    wrapperDiv: 'text-green-900',
    upperDiv: 'bg-green-200',
    freqDesc: 'text-green-800',
    lowerDiv: 'bg-green-200'
  },
  negative: {
    wrapperDiv: 'text-red-900',
    upperDiv: 'bg-red-200',
    freqDesc: 'text-red-800',
    lowerDiv: 'bg-red-200'
  }
};

const ScheduleItem = ({ schedule, deleteSchedule, fetchOccurrences, currencyCode }) => {

  const [menuOpen, setMenuOpen] = useState(false);
  const node = useRef();
  const currentStyle = schedule.amount >= 0 ? 'positive' : 'negative';

  const onClickOutside = e => {
    if (node.current.contains(e.target)) {
      return;
    }
    setMenuOpen(false);
  };
  
  useEffect(() => {
    if (menuOpen) {
      document.addEventListener('mousedown', onClickOutside);
    } else {
      document.removeEventListener('mousedown', onClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [menuOpen]);

  const onDeleteSchedule = () => {
    deleteSchedule(schedule.id).then(() => fetchOccurrences());
    setMenuOpen(false);
  };

  const renderMenu = () => {
    return (
      <div 
        ref={ node }
        className="text-gray-900 absolute text-sm top-0 right-0 mt-6 bg-gray-100 shadow rounded"
      >
        <ul>
          <li className="mt-1 p-2 pr-3 flex items-center cursor-pointer hover:bg-gray-200">
            <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" 
              stroke="currentColor" className="w-4 h-4 text-gray-700"
              >
              <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
              </path>
            </svg>
            <span className="ml-3">
              Edit
            </span>
          </li>
          <li 
            className="mb-1 p-2 pr-3 flex items-center cursor-pointer hover:bg-gray-200"
            onClick={ onDeleteSchedule }
          >
            <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-red-600"
            >
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
              </path>
            </svg>
            <span className="ml-3 text-red-600">
              Delete
            </span>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <div 
      className="w-full flex flex-col shadow mx-2" 
      style={{ maxWidth: '16rem' }}
    >
      <div className="p-4 relative flex justify-between items-center rounded-t">
        <h4 className="text-sm">
          { schedule.description }
        </h4>
        <span 
          className="cursor-pointer rounded-full p-1 hover:bg-gray-600"
          onClick={ () => setMenuOpen(true) }
        >
          <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"
            stroke="currentColor" className="h-4 w-4"
          >
            <path d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
          </svg>
        </span>
        { menuOpen && renderMenu() }
      </div>
      <div className={ `p-4 rounded-b ${ styles[currentStyle].upperDiv }` }>
        <div className="mt-1">
          <TransactionBadge
            amount={ schedule.amount }
            currencyCode={ currencyCode }
          />
        </div>
        <p className={ `mt-1 text-xs ${ styles[currentStyle].freqDesc }` }>
          { getFrequencyDescription(schedule) }
        </p>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    currencyCode: state.settings.currencyCode
  };
};

export default connect(
  mapStateToProps,
  { deleteSchedule, fetchOccurrences }
)(ScheduleItem);