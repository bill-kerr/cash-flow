import React, { useEffect } from 'react';
import { useAuthStateListener } from '../hooks/useAuthStateListener';
import { detectSignIn } from '../utils/expectSignIn';
import { MainNavbar } from './MainNavbar';
import { SectionTitleBar } from './SectionTitleBar';
import { ScheduleCategory } from './schedules/ScheduleCategory';
import { CurrentCash } from './cash/CurrentCash';
import { OccurrenceSection } from './occurrences/OccurrenceSection';

const App: React.FC = () => {
  const user = useAuthStateListener();
  useEffect(() => {
    detectSignIn();
  }, [user]);

  const renderApp = () => {
    return (
      <>
        <div>
          <MainNavbar />
        </div>
        <div className="mt-6 container flex flex-col md:flex-row">
          <div className="flex-1">
            <SectionTitleBar iconType="cash" titleText="Your cash" />
            <div className="bg-gray-800 p-4 rounded-b shadow">
              <CurrentCash />
            </div>
          </div>
          <div className="mt-6 md:ml-6 md:mt-0 flex-1">
            <SectionTitleBar iconType="investments" titleText="Your investments" />
            <div className="bg-gray-800 p-4 rounded-b shadow">this is a test</div>
          </div>
        </div>
        <div className="mt-6 container flex flex-col md:flex-row">
          <div className="flex-1">
            <SectionTitleBar iconType="transaction_schedules" titleText="Your transaction schedules" />
            <div className="bg-gray-800 p-4 rounded-b shadow">
              <ScheduleCategory header="daily" />
            </div>
          </div>
        </div>
        <div className="mt-6 container flex flex-col md:flex-row">
          <OccurrenceSection />
        </div>
      </>
    );
  };

  const renderLoading = () => {
    return <div>Loading...</div>;
  };

  return user ? renderApp() : renderLoading();
};

export default App;
