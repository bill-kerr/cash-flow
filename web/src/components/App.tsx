import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useThunkDispatch, fetchPosts } from '../store';

const App: React.FC = () => {
  const user = useAuth();
  //const dispatch = useTypedDispatch();
  const asyncDispatch = useThunkDispatch();

  return (
    <div className="h-64">
      <img src={user.photoUrl} alt="" />
      <span>{user.displayName}</span>
      <button onClick={() => asyncDispatch(fetchPosts(1000))}>Sign Out</button>
    </div>
  );
};

export default App;
