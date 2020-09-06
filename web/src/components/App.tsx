import React, { useEffect } from 'react';
import { signIn, signOut } from '../store/auth/actions';
import { useAuthStateListener } from '../hooks/useAuthStateListener';
import { useTypedDispatch } from '../store';
import { User } from '../store/auth/types';
import { detectSignIn } from '../utils/expectSignIn';
import { getSchedules } from '../store/schedules/actions';

const App: React.FC = () => {
  const user = useAuthStateListener();
  const dispatch = useTypedDispatch();

  useEffect(() => {
    detectSignIn();
  }, [user]);

  const renderApp = (user: User) => {
    return (
      <div className="p-6 max-w-screen-xl mx-auto">
        <img src={user.photoUrl} alt={user.displayName} className="h-12 w-12 rounded-full" />
        <span>{user.displayName}</span>
        {!user.isAnonymous ? (
          <button
            className="ml-4 py-2 px-3 bg-red-900 font-medium text-white rounded shadow hover:bg-red-800 focus:outline-none focus:shadow-outline"
            onClick={() => dispatch(signOut())}
          >
            Sign Out
          </button>
        ) : (
          <button
            className="ml-4 py-2 px-3 bg-blue-900 font-medium text-white rounded shadow hover:bg-blue-800 focus:outline-none focus:shadow-outline"
            onClick={() => dispatch(signIn())}
          >
            Sign In
          </button>
        )}
        <button
          className="ml-4 py-2 px-3 bg-blue-900 font-medium text-white rounded shadow hover:bg-blue-800 focus:outline-none focus:shadow-outline"
          onClick={() => dispatch(getSchedules())}
        >
          Get Schedules
        </button>
        <div></div>
      </div>
    );
  };

  const renderLoading = () => {
    return <div>Loading...</div>;
  };

  return user ? renderApp(user) : renderLoading();
};

export default App;
