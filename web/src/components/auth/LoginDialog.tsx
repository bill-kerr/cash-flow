import React, { useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { useTypedSelector } from '../../store';
import { LoginButtonList } from './LoginButtonList';

interface LoginDialogProps {
  dismiss: () => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = ({ dismiss }) => {
  const user = useTypedSelector((state) => state.auth.user);
  const buttonProps = useSpring({ to: { color: 'red' }, from: { color: 'green' } });

  useEffect(() => {
    if (!user?.isAnonymous) {
      dismiss();
    }
  }, [user, dismiss]);

  return (
    <div className="relative mx-6 p-6 max-w-screen-xs flex flex-col items-center justify-center rounded shadow text-gray-900 bg-gray-100 border-t-8 border-green-600 text-center overflow-hidden">
      <h2 className="text-2xl font-bold">Login</h2>
      <animated.div style={buttonProps} className="flex flex-col items-center justify-center">
        <p className="mt-2">
          Login to save your progress. Use one of your existing accounts or{' '}
          <span className="link">login with an email and password</span>.
        </p>
        <LoginButtonList />
      </animated.div>
    </div>
  );
};
