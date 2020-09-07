import React, { useEffect } from 'react';
import { useAuthStateListener } from '../hooks/useAuthStateListener';
import { detectSignIn } from '../utils/expectSignIn';
import { MainNavbar } from './MainNavbar';

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
            <div className="bg-gray-700 p-4 rounded-t shadow">Your Bank Account</div>
            <div className="bg-gray-800 p-4 rounded-b shadow">this is a test</div>
          </div>
          <div className="mt-6 md:ml-6 md:mt-0 flex-1">
            <div className="bg-gray-700 p-4 rounded-t shadow">Your Investments</div>
            <div className="bg-gray-800 p-4 rounded-b shadow">this is a test</div>
          </div>
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
