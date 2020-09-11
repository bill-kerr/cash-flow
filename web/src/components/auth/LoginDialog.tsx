import React, { useEffect, useState } from 'react';
import { animated, useTransition } from 'react-spring';
import { useTypedSelector } from '../../store';
import { LoginButtonList } from './LoginButtonList';

interface LoginDialogProps {
  dismiss: () => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = ({ dismiss }) => {
  const user = useTypedSelector((state) => state.auth.user);
  const [show, setShow] = useState(0);

  useEffect(() => {
    if (!user?.isAnonymous) {
      dismiss();
    }
  }, [user, dismiss]);

  const buttonLogin = (
    <div className="flex flex-col items-center justify-center">
      <p className="mt-2">
        Login to save your progress. Use one of your existing accounts or{' '}
        <span className="link">login with an email and password</span>.
      </p>
      <LoginButtonList />
    </div>
  );

  const formLogin = <div>This will be the sign in form.</div>;

  const items = [buttonLogin, formLogin];
  const transitions = useTransition(show, (key) => key, {
    from: { transform: 'translate3d(100%,0,0)' },
    enter: { transform: 'translate3d(0%,0,0)' },
    leave: { transform: 'translate3d(-100%,0,0)' },
    initial: null,
    unique: true,
  });

  return (
    <div className="mx-6 p-6 max-w-screen-xs flex flex-col items-center justify-center rounded shadow text-gray-900 bg-gray-100 border-t-8 border-green-600 text-center overflow-hidden">
      <h2 className="text-2xl font-bold" onClick={() => setShow(show === 1 ? 0 : 1)}>
        Login
      </h2>
      <div className="flex items-center">
        {transitions.map(({ item, props, key }) => (
          <animated.div key={key} style={props} className="w-full h-full flex flex-1 items-center">
            {items[item]}
          </animated.div>
        ))}
      </div>
    </div>
  );
};
