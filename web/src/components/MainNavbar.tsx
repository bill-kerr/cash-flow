import React from 'react';
import { UserMenu } from './UserMenu';
import { useTypedSelector, useTypedDispatch } from '../store';
import { signIn } from '../store/auth/actions';
import { CashOutline } from '@graywolfai/react-heroicons';
import { Dropdown } from './Dropdown';

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
        <div className="flex justify-end">
          <button className="btn shadow-none" onClick={() => dispatch(signIn())}>
            Log In
          </button>
        </div>
      ) : (
        <div className="flex items-center">
          <div className="mr-4">Target div</div>
          <Dropdown className="mr-4">
            <div>Test menu</div>
          </Dropdown>
          <UserMenu user={user} />
        </div>
      )}
    </div>
  );
};
