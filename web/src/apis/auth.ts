import firebase from 'firebase/app';
import 'firebase/auth';
import { User } from '../store/auth/types';
import defaultUserImage from '../assets/images/default-user.png';

export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyD5KDsUaecKcanBTxaqU0tb2fLTVURMSaM',
  authDomain: 'cash-flow-calculator.firebaseapp.com',
  databaseURL: 'https://cash-flow-calculator.firebaseio.com',
  projectId: 'cash-flow-calculator',
  storageBucket: 'cash-flow-calculator.appspot.com',
  messagingSenderId: '236580790004',
  appId: '1:236580790004:web:38e2dde703ecf012be88a1',
};

export const mapFirebaseUser = (firebaseUser: firebase.User | null, token: string | null = null): User | null => {
  if (!firebaseUser) {
    return null;
  }

  return {
    displayName: firebaseUser.displayName || 'Anonymous',
    email: firebaseUser.email,
    id: firebaseUser.uid,
    photoUrl: firebaseUser.photoURL || defaultUserImage,
    token,
    isAnonymous: firebaseUser.isAnonymous,
  };
};

export const initializeAuth = () => {
  firebase.initializeApp(FIREBASE_CONFIG);
};

export const signInAnonymously = async () => {
  const userCredentials = await firebase.auth().signInAnonymously();
  const token = await getIdToken();
  return mapFirebaseUser(userCredentials.user, token);
};

export const getIdToken = async () => {
  const currentUser = firebase.auth().currentUser;
  return currentUser ? currentUser.getIdToken() : null;
};

export const signInWithGoogle = async () => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const userCredentials = await signInWithPopup(provider);
    const token = await getIdToken();
    return mapFirebaseUser(userCredentials.user, token);
  } catch (error) {
    return null;
  }
};

const signInWithPopup = (provider: firebase.auth.AuthProvider) => {
  return firebase.auth().signInWithPopup(provider);
};

export const authSignOut = async () => {
  firebase.auth().signOut();
  await signInAnonymously();
};

export type AuthUnsubscribe = () => void;
export const onAuthStateChanged = (callback: (user: User | null) => void): AuthUnsubscribe => {
  return firebase.auth().onAuthStateChanged((user) => callback(mapFirebaseUser(user)));
};

export const getCurrentUser = () => mapFirebaseUser(firebase.auth().currentUser);

export const userIsAnonymous = () => {
  const user = firebase.auth().currentUser;
  return user ? user.isAnonymous : true;
};
