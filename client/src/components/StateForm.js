import React, { useState } from 'react';
import { connect } from 'react-redux';
import DatePicker from './DatePicker';

const StateForm = () => {

  const [startDate, setStartDate] = useState('');

  return (
    <div className="flex p-2 bg-gray-200 border border-gray-300 rounded">
      <form action="">
        <div className="flex flex-col">
          <label 
            htmlFor="startDate" 
            className="text-xs font-bold text-gray-600 uppercase tracking-wider"
          >
            Show my transactions starting on
          </label>
          <DatePicker selectedDate={ startDate } setSelectedDate={ setStartDate } />
        </div>
      </form>
    </div>
  );
};

export default connect(
  null,
  {}
)(StateForm);