import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { ChevronDownOutline, LogoutOutline, CogOutline } from '@graywolfai/react-heroicons';
import { useTypedDispatch } from '../store';
import { ClickOutside } from './ClickOutside';
import { signOut } from '../store/auth/actions';
import { User } from '../store/auth/types';

interface UserMenuProps {
  user: User;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const dispatch = useTypedDispatch();
  const [open, setOpen] = useState(false);
  const animationProps = useSpring({
    opacity: open ? 1 : 0,
    transform: open ? 'scale(1)' : 'scale(0)',
    config: { tension: 250, clamp: true },
  });

  if (!user) {
    return <div></div>;
  }

  return (
    <div className="relative flex items-center justify-end">
      <div className="flex items-center cursor-pointer" onClick={() => setOpen(!open)}>
        <img src={user.photoUrl} alt={user.displayName} className="h-10 w-10 rounded-full" />
        <ChevronDownOutline className="ml-2 h-6 w-6" />
      </div>
      <ClickOutside onClose={() => setOpen(false)} isOpen={open}>
        <animated.div
          aria-hidden={!open}
          aria-expanded={open}
          className={`absolute block rounded-sm bg-white shadow text-gray-900 text-center whitespace-no-wrap`}
          style={{
            ...animationProps,
            top: 'calc(100% + 1rem)',
            right: 0,
            transformOrigin: 'right top',
          }}
        >
          <div>
            <div className="py-4 px-6 shadow font-bold">Welcome, {user.displayName}!</div>
            <div className="py-4 px-6 bg-gray-200 rounded-b-sm">
              <div>This is where maybe notifications</div>
              <div className="mt-4">
                <button className="btn btn-white w-full">
                  <CogOutline className="h-6 w-6 text-gray-700" />
                  <span className="ml-2 font-medium">Settings</span>
                </button>
                <button className="mt-2 btn btn-blue w-full" onClick={() => dispatch(signOut())}>
                  <LogoutOutline className="h-6 w-6 text-gray-300" />
                  <span className="ml-2 font-medium">Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </animated.div>
      </ClickOutside>
    </div>
  );
};
