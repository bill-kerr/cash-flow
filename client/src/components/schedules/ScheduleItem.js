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
    freqDesc: 'text-green-700',
    lowerDiv: 'bg-green-100',
    menu: 'hover:bg-green-300'
  },
  negative: {
    wrapperDiv: 'text-red-900',
    upperDiv: 'bg-red-200',
    freqDesc: 'text-red-700',
    lowerDiv: 'bg-red-100',
    menu: 'hover:bg-red-300'
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
        className="text-gray-900 absolute text-sm top-0 right-0 mt-6 bg-white shadow rounded"
      >
        <ul>
          <li className="mt-1 p-2 cursor-pointer hover:bg-blue-100">
            Update transaction
          </li>
          <li 
            className="mb-1 p-2 cursor-pointer hover:bg-blue-100"
            onClick={ onDeleteSchedule }
          >
            Delete transaction
          </li>
        </ul>
      </div>
    );
  };

  return (
    <div 
      className={ `w-full flex flex-col shadow ${ styles[currentStyle].wrapperDiv } mx-2` } 
      style={{ maxWidth: '16rem' }}
    >
      <div className={ `p-2 rounded-t ${ styles[currentStyle].upperDiv }` }>
        <div className="relative flex justify-between items-center">
          <TransactionBadge 
            amount={ schedule.amount }
            currencyCode={ currencyCode }
          />
          <span 
            className={ `cursor-pointer rounded-full p-1 ${ styles[currentStyle].menu }` }
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
        <p className={ `text-xs ${ styles[currentStyle].freqDesc }` }>
          { getFrequencyDescription(schedule) }
        </p>
      </div>
      <div className={ `p-2 rounded-b flex-1 ${ styles[currentStyle].lowerDiv }` }>
        <h4 className="font-medium text-sm">
          { schedule.description }
        </h4>
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