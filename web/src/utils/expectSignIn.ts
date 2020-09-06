import { signInAnonymously, onAuthStateChanged } from '../apis/auth';
import { User } from '../store/auth/types';

const EXPECT_SIGN_IN_KEY = 'cash_flow_calculator:expect_sign_in';
const EXPECT_SIGN_IN_TIMEOUT = 3000;

export const setExpectSignIn = (expectSignIn: boolean) => {
  expectSignIn ? localStorage.setItem(EXPECT_SIGN_IN_KEY, '1') : localStorage.removeItem(EXPECT_SIGN_IN_KEY);
};

export const getExpectSignIn = () => {
  return !!localStorage.getItem(EXPECT_SIGN_IN_KEY);
};

export const detectSignIn = async (): Promise<User | null> => {
  if (getExpectSignIn()) {
    try {
      return waitForSignIn();
    } catch (error) {
      return signInAnonymously();
    }
  }
  return signInAnonymously();
};

const waitForSignIn = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged((user) => resolve(user));
    setTimeout(async () => {
      reject();
    }, EXPECT_SIGN_IN_TIMEOUT);
  });
};
