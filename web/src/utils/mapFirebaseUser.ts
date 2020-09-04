import { User as FirebaseUser } from 'firebase';
import { User } from '../store/auth/types';
import { fallbackUser } from '../types/fallbackUser';
import defaultUserImage from '../assets/images/default-user.svg';

export const mapFirebaseUser = (firebaseUser: FirebaseUser | null): User => {
  // Firebase sign-in anonymously failed. Return fallback user.
  if (!firebaseUser) {
    return fallbackUser;
  }

  return {
    displayName: firebaseUser.displayName || '',
    email: firebaseUser.email || '',
    id: firebaseUser.uid,
    photoUrl: firebaseUser.photoURL || defaultUserImage,
  };
};
