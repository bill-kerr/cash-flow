import React from 'react';
import { User } from '../store/auth/types';

interface UserDisplayProps {
  user: User;
}

export const UserDisplay: React.FC<UserDisplayProps> = ({ user }) => {
  return (
    <div>
      <img src={user.photoUrl} alt={user.displayName} className="h-12 w-12 rounded-full" />
    </div>
  );
};
