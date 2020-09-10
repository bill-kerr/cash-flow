import React, { useState } from 'react';
import { UserMenu } from './UserMenu';
import { useTypedSelector } from '../store';
import { CashOutline } from '@graywolfai/react-heroicons';
import { Dropdown } from './Dropdown';
import { Modal } from './Modal';
import { LoginDialog } from './auth/LoginDialog';

export const MainNavbar: React.FC = () => {
  const user = useTypedSelector(({ auth }) => auth.user);
  const [showModal, setShowModal] = useState(false);
  // const dispatch = useTypedDispatch();

  const handleClickLogIn = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="container pt-6 flex items-center justify-between">
      <div className="flex items-center text-xl">
        <CashOutline className="h-8 w-8" />
        <span className="ml-2">Cash Flow</span>
      </div>
      {!user || user.isAnonymous ? (
        <div className="flex justify-end">
          <button className="btn shadow-none" onClick={handleClickLogIn}>
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

      {showModal && (
        <Modal element="modal" onDismissed={() => setShowModal(false)}>
          {({ dismiss }) => <LoginDialog dismiss={dismiss} />}
        </Modal>
      )}
    </div>
  );
};
