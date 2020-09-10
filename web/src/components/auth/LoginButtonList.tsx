import React from 'react';
import { useTypedDispatch } from '../../store';
import { googleSignIn } from '../../store/auth/actions';

export const LoginButtonList: React.FC<React.HTMLProps<HTMLDivElement>> = (props) => {
  const dispatch = useTypedDispatch();
  return (
    <div {...props}>
      <button
        className="w-64 mt-6 px-6 py-2 flex items-center rounded shadow text-white focus:outline-none focus:shadow-outline"
        style={{ backgroundColor: '#4285F4' }}
        onClick={() => dispatch(googleSignIn())}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid"
          viewBox="0 0 256 262"
          className="h-8 w-8 rounded-full p-1 bg-white flex-shrink-0"
        >
          <path
            fill="#4285F4"
            d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
          />
          <path
            fill="#34A853"
            d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
          />
          <path
            fill="#FBBC05"
            d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
          />
          <path
            fill="#EB4335"
            d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
          />
        </svg>
        <span className="ml-6 w-full">Google</span>
      </button>
      <button
        className="w-64 mt-4 px-6 py-2 flex items-center rounded shadow text-white focus:outline-none focus:shadow-outline"
        style={{ backgroundColor: '#1877f2' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="50 67 400 368" className="h-8 w-8">
          <path
            d="M432.5 250c0-100.8-81.7-182.5-182.5-182.5S67.5 149.2 67.5 250c0 91.1 66.7 166.6 154 180.3V302.8h-46.3V250h46.3v-40.2c0-45.7 27.2-71 68.9-71 20 0 40.9 3.6 40.9 3.6v44.9h-23c-22.7 0-29.7 14.1-29.7 28.5V250h50.6l-8.1 52.8h-42.5v127.5c87.2-13.7 153.9-89.2 153.9-180.3z"
            fill="#fff"
          ></path>
          <path
            d="M321 302.8l8.1-52.8h-50.6v-34.2c0-14.4 7.1-28.5 29.7-28.5h23v-44.9s-20.9-3.6-40.9-3.6c-41.7 0-68.9 25.3-68.9 71V250h-46.3v52.8h46.3v127.5c9.3 1.5 18.8 2.2 28.5 2.2s19.2-.8 28.5-2.2V302.8H321z"
            fill="#1877f2"
          ></path>
        </svg>
        <span className="ml-6 w-full">Facebook</span>
      </button>
    </div>
  );
};
