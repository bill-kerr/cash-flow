import React, { useState } from 'react';
import { connect } from 'react-redux';
import DatePicker from '../DatePicker';
import { setStartDate, setEndDate, fetchOccurrences, setStartingBalance } from '../../actions/occurrences';
import { getCurrencySymbol, formatDate } from '../../util';

const OccurrenceListFilter = props => {
  const [formEndDate, setFormEndDate] = useState(props.endDate);
  const [formStartDate, setFormStartDate] = useState(props.startDate);
  const [inputStartingBalance, setInputStartingBalance] = useState(Number(0).toLocaleString());

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
    const fmtStartDate = formatDate(startDate);
    const fmtEndDate = formatDate(endDate);
    props.fetchOccurrences(fmtStartDate, fmtEndDate);
  };

  const onStartingBalanceBlur = e => {
    const balance = parseFloat(e.target.value);
    props.setStartingBalance(balance);
  };

  const onStartingBalanceChange = e => {
    const value = e.target.value;
    const floatRegExp = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$');
    if ((value === '' || floatRegExp.test(value)) && value.length < 15) {
      setInputStartingBalance(value);
    }
  };

  return (
    <div className="flex p-4 bg-gray-700 shadow rounded">
      <div className="flex flex-col">
        <label  
          className="text-xs font-bold text-gray-300 uppercase"
        >
          Start date
        </label>
        <div className="mt-1">
          <DatePicker selectedDate={ formStartDate } setSelectedDate={ updateStartDate } maxDate={ formEndDate } />
        </div>
      </div>
      <div className="ml-4 flex flex-col">
        <label className="text-xs font-bold text-gray-300 uppercase">
          End date
        </label>
        <div className="mt-1">
          <DatePicker selectedDate={ formEndDate } setSelectedDate={ updateEndDate } minDate={ formStartDate } />
        </div>
      </div>
      <div className="ml-4 flex flex-col">
        <label className="text-xs font-bold text-gray-300 uppercase">
          Starting balance
        </label>
        <div className="relative mt-1 w-40 text-sm">
          <input 
            type="text"
            className="w-full form-input pl-6 text-right"
            onBlur={ e => onStartingBalanceBlur(e) }
            value={ inputStartingBalance }
            onChange={ e => onStartingBalanceChange(e) }
          />
          <div 
            className="absolute px-2 left-0 top-0 bottom-0 flex h-full items-center pointer-events-none text-gray-600"
          >
            { getCurrencySymbol(props.currencyCode) }
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    startDate: state.occurrenceList.startDate,
    endDate: state.occurrenceList.endDate,
    user: state.auth.user,
    startingBalance: state.occurrenceList.startingBalance,
    currencyCode: state.settings.currencyCode
  };
};

export default connect(
  mapStateToProps,
  { setStartDate, setEndDate, fetchOccurrences, setStartingBalance }
)(OccurrenceListFilter);