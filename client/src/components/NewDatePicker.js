import React, { useState } from 'react';

const DatePicker = ({
  inputWidth = 224,
  placeholder = '',
  initialDate = new Date(),
}) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(initialDate);
  const monthStrings = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
  };

  return (
    <div
      style={{ width: `${ inputWidth }px` }}
    >
      <div className="relative">
        <input 
          type="text"
          readOnly
          placeholder={ placeholder }
          className={ `w-full text-sm form-input pr-10 cursor-pointer ${ open ? 'pointer-events-none': '' }` }
          onClick={ () => setOpen(!open) }
          value={ date.toDateString() }
        />
      </div>
    </div>
  );
};

export default DatePicker;