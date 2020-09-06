import React, { useEffect } from 'react';
import { signIn, signOut, authStateChange } from '../store/auth/actions';
import { useTypedDispatch, useTypedSelector } from '../store';
import { onAuthStateChanged } from '../apis/auth';

const App: React.FC = () => {
  const dispatch = useTypedDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  useEffect(() => {
    return onAuthStateChanged((newUser) => {
      if (newUser && user.id !== newUser.id) {
        dispatch(authStateChange(newUser));
      }
    });
  }, [user, dispatch]);

  return (
    <div className="h-64">
      <img src={user.photoUrl} alt="" />
      <span>{user.displayName}</span>
      <button className="ml-4" onClick={() => dispatch(signOut())}>
        Sign Out
      </button>
      <button className="ml-4" onClick={() => dispatch(signIn())}>
        Sign In
      </button>
    </div>
  );
};

export default App;
