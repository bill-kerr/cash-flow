import React from 'react';
import Toolbar from '../components/Toolbar';
import ScheduleList from '../components/schedules/ScheduleList';
import OccurrenceList from '../components/occurrences/OccurrenceList';

const HomePage = () => {
  return (
    <>
      <div className="mt-4">
        <Toolbar />
      </div>
      <div className="mt-4">
        <ScheduleList />
      </div>
      <div className="mt-4">
        <OccurrenceList />
      </div>
    </>
  );
};

export default HomePage;