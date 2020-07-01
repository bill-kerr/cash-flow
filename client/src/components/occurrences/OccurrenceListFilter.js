import React, { useState } from 'react';
import { connect } from 'react-redux';
import DatePicker from '../DatePicker';
import { setStartDate, setEndDate, fetchOccurrences, setStartingBalance } from '../../actions/occurrences';
import moment from 'moment';

const OccurrenceListFilter = props => {
  const [formEndDate, setFormEndDate] = useState(props.endDate);
  const [formStartDate, setFormStartDate] = useState(props.startDate);

  const updateStartDate = date => {
    setFormStartDate(date);
    props.setStartDate(date)
    updateOccurrences(date, formEndDate);
  };

  const updateEndDate = date => {
    setFormEndDate(date);
    props.setEndDate(date)
    updateOccurrences(formStartDate, date);
  };

  const updateOccurrences = (startDate, endDate) => {
    const fmtStartDate = moment(startDate).format('YYYY-MM-DD');
    const fmtEndDate = moment(endDate).format('YYYY-MM-DD');
    props.fetchOccurrences(props.user.token, fmtStartDate, fmtEndDate);
  };

  const onStartingBalanceBlur = e => {
    const balance = parseFloat(e.target.value);
    props.setStartingBalance(balance);
  };

  return (
    <div className="flex p-2 bg-gray-200 border border-gray-300 rounded">
      <div className="flex flex-col">
        <label  
          className="text-xs font-bold text-gray-600 uppercase"
        >
          Start date
        </label>
        <div className="mt-1">
          <DatePicker selectedDate={ formStartDate } setSelectedDate={ updateStartDate } maxDate={ formEndDate } />
        </div>
      </div>
      <div className="ml-4 flex flex-col">
        <label className="text-xs font-bold text-gray-600 uppercase">
          End date
        </label>
        <div className="mt-1">
          <DatePicker selectedDate={ formEndDate } setSelectedDate={ updateEndDate } minDate={ formStartDate } />
        </div>
      </div>
      <div className="ml-4 flex flex-col">
        <label className="text-xs font-bold text-gray-600 uppercase">
          Starting balance
        </label>
        <div className="mt-1 w-40">
          <input 
            type="text"
            className="w-full pl-4 pr-10 py-3 leading-none rounded shadow-sm focus:outline-none focus:shadow-outline text-gray-600 font-medium transition-shadow duration-100"
            onBlur={ e => onStartingBalanceBlur(e) }
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    startDate: state.occurrenceList.startDate,
    endDate: state.occurrenceList.endDate,
    user: state.auth.user
  };
};

export default connect(
  mapStateToProps,
  { setStartDate, setEndDate, fetchOccurrences, setStartingBalance }
)(OccurrenceListFilter);