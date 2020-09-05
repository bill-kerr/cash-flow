import React from 'react';
import { PropsFromRedux, connector } from '../store';

interface AppProps extends PropsFromRedux {
  backgroundColor: string;
}

const App: React.FC<AppProps> = ({ backgroundColor, auth }) => {
  return (
    <div style={{ backgroundColor }}>
      <img src={auth.user.photoUrl} alt="" className="h-6 w-6 object-contain" />
    </div>
  );
};

export default connector(App);
