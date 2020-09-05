import firebase from 'firebase/app';
import 'firebase/auth';
import { User } from '../store/auth/types';
import { fallbackUser } from '../types/fallbackUser';
import defaultUserImage from '../assets/images/default-user.svg';

export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyD5KDsUaecKcanBTxaqU0tb2fLTVURMSaM',
  authDomain: 'cash-flow-calculator.firebaseapp.com',
  databaseURL: 'https://cash-flow-calculator.firebaseio.com',
  projectId: 'cash-flow-calculator',
  storageBucket: 'cash-flow-calculator.appspot.com',
  messagingSenderId: '236580790004',
  appId: '1:236580790004:web:38e2dde703ecf012be88a1',
};

export const mapFirebaseUser = (firebaseUser: firebase.User | null, token: string | null = null): User => {
  // Firebase sign-in anonymously failed. Return fallback user.
  if (!firebaseUser) {
    return fallbackUser;
  }

  return {
    displayName: firebaseUser.displayName || '',
    email: firebaseUser.email || '',
    id: firebaseUser.uid,
    photoUrl: firebaseUser.photoURL || defaultUserImage,
    token,
  };
};

export const initializeAuth = () => {
  firebase.initializeApp(FIREBASE_CONFIG);
};

export const getIdToken = async () => {
  const currentUser = firebase.auth().currentUser;
  return currentUser ? currentUser.getIdToken() : null;
};

export const signInWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  const userCredentials = await signInWithPopup(provider);
  const token = await getIdToken();
  return mapFirebaseUser(userCredentials.user, token);
};

const signInWithPopup = (provider: firebase.auth.AuthProvider) => {
  return firebase.auth().signInWithPopup(provider);
};

export const authSignOut = () => {
  return firebase.auth().signOut();
};

export type AuthUnsubscribe = () => void;
export const onAuthStateChanged = (callback: (user: User | null) => void): AuthUnsubscribe => {
  return firebase.auth().onAuthStateChanged((user) => callback(mapFirebaseUser(user)));
};

export const currentUser = () => mapFirebaseUser(firebase.auth().currentUser);
