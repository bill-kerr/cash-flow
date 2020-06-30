import React, { useState, useEffect, useRef } from 'react';

const DatePicker = ({ selectedDate, setSelectedDate }) => {
  const node = useRef();
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [daysInMonth, setDaysInMonth] = useState(0);
  const [blankDates, setBlankDates] = useState(0);

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

  const handleClickOutside = e => {
    if (node.current.contains(e.target)) {
      return;
    }
    setOpen(false);
  };

  useEffect(() => onDateChange(new Date()), []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    const startDay = new Date(year, month).getDay();
    setBlankDates(startDay);

    setDaysInMonth(new Date(year, month + 1, 0).getDate());
  }, [month, year]);

  const onDateChange = date => {
    setMonth(date.getMonth());
    setYear(date.getFullYear());
    setSelectedDate(date);
  };

  const onClickDate = date => {
    const newDate = new Date(year, month, date);
    setSelectedDate(newDate);
    setOpen(false);
  };

  const onClickNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const onClickPreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const renderCalendar = () => {
    return (
      <div 
        className="absolute top-0 left-0 p-4 mt-12 bg-white rounded shadow" 
        style={{ width: '17rem' }}
        ref={ node }
      >

        {/* Month and Year Header w/ Arrows */}
        <div className="mb-2 flex justify-between items-center">
          <div>
            <span className="text-lg font-bold text-gray-800">{ monthStrings[month] }</span>
            <span className="ml-1 text-lg text-gray-600 font-normal">{ year }</span>
          </div>
          <div>
            <button
              type="button"
              className="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full focus:outline-none"
              onClick={ onClickPreviousMonth }
            >
              <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"
                stroke="currentColor" className="h-6 w-6 text-gray-500 inline-flex"
              >
                <path d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button
              type="button"
              className="ml-1 transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full focus:outline-none"
              onClick={ onClickNextMonth }
            >
              <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"
                stroke="currentColor" className="h-6 w-6 text-gray-500 inline-flex"
              >
                <path d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Day of Week Headers */}
        <div className="flex flex-wrap mb-3 -mx-1">
          { renderDayOfWeekHeaders() }
        </div>

        {/* Month Dates */}
        <div className="flex flex-wrap -mx-1">
          { renderBlankDates() }
          { renderDates() }
        </div>

      </div>
    );
  };

  const renderDayOfWeekHeaders = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(day => {
      return (
        <div key={ day } style={{ width: '14.26%' }} className="px-1">
          <div className="text-gray-800 font-medium text-center text-xs">
            { day }
          </div>
        </div>
      );
    });
  };

  const renderDates = () => {
    const renderedDates = [];
    for (let i = 0; i < daysInMonth; i++) {
      renderedDates.push(
        <div style={{ width: '14.26%' }} className="px-1 mb-1" key={ i }>
          <div
            className={ getDateStyles(i + 1) }
            onClick={ () => onClickDate(i + 1) }
          >
            { i + 1 }
          </div>
        </div>
      );
    }
    
    return renderedDates;
  };

  const renderBlankDates = () => {
    const renderedBlanks = [];
    for (let i = 0; i < blankDates; i++) {
      renderedBlanks.push(
        <div
          style={{ width: '14.28%' }}
          className="text-center border p-1 border-transparent text-sm"
          key={ i }
        ></div>
      );
    }
    return renderedBlanks;
  };

  const isToday = (year, month, day) => {
    const today = new Date();
    const isYear = today.getFullYear() === year;
    const isMonth = today.getMonth() === month;
    const isDay = today.getDate() === day;

    return isYear && isMonth && isDay;
  };

  const getDateStyles = date => {
    let baseStyles = 'cursor-pointer text-center text-sm rounded-full leading-loose transition ease-in-out duration-100';

    if (isToday(year, month, date)) {
      return baseStyles += ' bg-blue-500 text-white';
    }

    return baseStyles += ' text-gray-700 hover:bg-blue-200';
  };

  return (
    <div className="w-64">
      <div className="relative">
        <input type="hidden" name="date" />
        <input 
          type="text"
          readOnly
          placeholder="Select date"
          className="w-full pl-4 pr-10 py-3 leading-none rounded shadow-sm focus:outline-none focus:shadow-outline text-gray-600 font-medium transition-shadow duration-100"
          onClick={ () => setOpen(!open) }
          value={ selectedDate.toDateString() }
        />
        <div className="absolute top-0 right-0 px-3 py-2 pointer-events-none">
          <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"
            stroke="currentColor" className="h-6 w-6 text-gray-400"
          >
            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
        { open && renderCalendar() }
      </div>
    </div>
  );
};

export default DatePicker;
