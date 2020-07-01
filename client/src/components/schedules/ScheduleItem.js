import React from 'react';
import { getFrequencyDescription } from '../../util';
import TransactionBadge from '../TransactionBadge';

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

const ScheduleItem = ({ schedule }) => {

  const currentStyle = schedule.amount >= 0 ? 'positive' : 'negative';

  return (
    <div 
      className={ `w-full flex flex-col shadow ${ styles[currentStyle].wrapperDiv } mx-2` } 
      style={{ maxWidth: '16rem' }}
    >
      <div className={ `p-2 rounded-t ${ styles[currentStyle].upperDiv }` }>
        <div className="flex justify-between items-center">
          <TransactionBadge amount={ schedule.amount } />
          <span className={ `cursor-pointer rounded-full p-1 ${ styles[currentStyle].menu }` }>
            <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"
              stroke="currentColor" className="h-4 w-4"
            >
              <path d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
            </svg>
          </span>
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

export default ScheduleItem;