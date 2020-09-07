import React from 'react';
import { UserMenu } from './UserMenu';
import { useTypedSelector, useTypedDispatch } from '../store';
import { signIn } from '../store/auth/actions';
import { CashOutline } from '@graywolfai/react-heroicons';

export const MainNavbar: React.FC = () => {
  const user = useTypedSelector(({ auth }) => auth.user);
  const dispatch = useTypedDispatch();

  return (
    <div className="container pt-6 flex items-center justify-between">
      <div className="flex items-center text-xl">
        <CashOutline className="h-8 w-8" />
        <span className="ml-2">Cash Flow</span>
      </div>
      {!user || user.isAnonymous ? (
        <div className="flex justify-end flex-1 flex-shrink-0">
          <button className="btn shadow-none" onClick={() => dispatch(signIn())}>
            Log In
          </button>
        </div>
      ) : (
        <div className="flex-1 flex-shrink-0">
          <UserMenu user={user} />
        </div>
      )}
    </div>
  );
};
