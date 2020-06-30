import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import DatePicker from './DatePicker';
import { setStartDate, setEndDate } from '../actions';

const StateForm = props => {

  const [formStartDate, setFormStartDate] = useState(props.startDate);
  const [formEndDate, setFormEndDate] = useState(props.endDate);

  useEffect(() => {
    props.setStartDate(formStartDate)
  }, [formStartDate]);

  useEffect(() => {
    props.setEndDate(formEndDate)
  }, [formEndDate]);

  return (
    <div className="flex p-2 bg-gray-200 border border-gray-300 rounded">
      <div className="flex flex-col">
        <label 
          htmlFor="startDate" 
          className="text-xs font-bold text-gray-600 uppercase"
        >
          Start date
        </label>
        <div className="mt-1">
          <DatePicker selectedDate={ formStartDate } setSelectedDate={ setFormStartDate } />
        </div>
      </div>
      <div className="ml-3 flex flex-col">
        <label 
          htmlFor="startDate" 
          className="text-xs font-bold text-gray-600 uppercase"
        >
          End date
        </label>
        <div className="mt-1">
          <DatePicker selectedDate={ formEndDate } setSelectedDate={ setFormEndDate } />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    startDate: state.occurrenceList.startDate,
    endDate: state.occurrenceList.endDate
  };
};

export default connect(
  mapStateToProps,
  { setStartDate, setEndDate }
)(StateForm);