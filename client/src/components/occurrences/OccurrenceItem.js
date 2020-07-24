import React, { useState } from 'react';
import { connect } from 'react-redux';
import { formatCurrency } from '../../util';
import { createScheduleException } from '../../actions/schedule-exceptions';
import { fetchOccurrences } from '../../actions/occurrences';
import TransactionBadge from '../TransactionBadge';
import OccurrenceActions from './OccurrenceActions';
import OccurrenceActionStatus from './OccurrenceActionStatus';

const OccurrenceItem = ({ 
  occurrence, 
  balance, 
  currencyCode, 
  createScheduleException,
  fetchOccurrences,
  rowSpacing = 'normal'
}) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('default');

  const onDelete = async () => {
    setStatus('Deleting occurrence...');

    const scheduleException = {
      schedule: occurrence.schedule,
      occurrenceDeleted: true,
      date: occurrence.originalDate
    };

    createScheduleException(scheduleException).then(async res => {
      await fetchOccurrences();
      setStatus('default');
    }).catch(error => {
      // TODO: handle error
      setStatus('default');
    });
  };

  const onMoveDate = async newDate => {
    setStatus(`Moving occurrence to ${ newDate }...`)

    const scheduleException = {
      schedule: occurrence.schedule,
      occurrenceDeleted: false,
      date: occurrence.originalDate,
      currentDate: newDate
    };

    createScheduleException(scheduleException).then(async res => {
      await fetchOccurrences();
      setStatus('default');
    }).catch(error => {
      // TODO: handle error.
      setStatus('default');
    });
  };

  const renderActions = () => {
    return isActive ? 
      <OccurrenceActions 
        onDelete={ onDelete }
        onMoveDate={ onMoveDate }
        date={ occurrence.date }
      /> 
      : null;
  };

  const spacing = {
    'tight': 'py-2',
    'normal': 'py-3',
    'loose': 'py-4'
  }[rowSpacing];

  return (
    <div 
      className={ 
        `relative text-sm flex
        ${ isActive ? 'bg-gray-300' : 'even:bg-gray-200' }
        ${ balance < 0 ? 'text-red-800 font-bold' : '' }
        ` 
      }
      onMouseOver={ () => setIsActive(true) }
      onMouseLeave={ () => setIsActive(false) }
    >
      <div className={ `w-1/6 ${ spacing } pl-4 whitespace-no-wrap` }>
        { occurrence.date }
      </div>
      <div className={ `flex-grow ${ spacing } pl-2 whitespace-no-wrap` }>
        { occurrence.description }
      </div>
      <div className={ `w-1/12 ${ spacing } pl-2 whitespace-no-wrap flex justify-end` }>
        <TransactionBadge 
          amount={ occurrence.amount } 
          currencyCode={ currencyCode }
          bold={ false }
          positiveTextStyle="text-green-800"
          negativeTextStyle="text-red-800"
        />
      </div>
      <div className={ `w-1/12 ${ spacing } pl-2 whitespace-no-wrap text-right` }>
        { formatCurrency(balance, currencyCode) }
      </div>
      <div 
        className={ `w-1/5 ${ spacing } pl-2 pr-4 my-auto whitespace-no-wrap text-right flex items-center justify-end` }
      >
        { renderActions() }
      </div>
      { status !== 'default' ? <OccurrenceActionStatus status={ status } /> : null }
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
  { createScheduleException, fetchOccurrences }
)(OccurrenceItem);