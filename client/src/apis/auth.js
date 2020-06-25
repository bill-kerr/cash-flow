import * as firebase from 'firebase/app';
import 'firebase/auth';

export const onAuthStateChanged = callback => {
  firebase.auth().onAuthStateChanged(user => callback(user));
};

class Auth {
  firebaseConfig = {
    apiKey: 'AIzaSyD5KDsUaecKcanBTxaqU0tb2fLTVURMSaM',
    authDomain: 'cash-flow-calculator.firebaseapp.com',
    databaseURL: 'https://cash-flow-calculator.firebaseio.com',
    projectId: 'cash-flow-calculator',
    storageBucket: 'cash-flow-calculator.appspot.com',
    messagingSenderId: '236580790004',
    appId: '1:236580790004:web:38e2dde703ecf012be88a1'
  };

  initialize = () => {
    firebase.initializeApp(this.firebaseConfig);
  }

  onAuthStateChanged = callback => {
    firebase.auth().onAuthStateChanged(user => callback(user));
  };

  signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  }

  getIdToken() {
    return firebase.auth().currentUser.getIdToken();
  }
}

const auth = new Auth();
export default Object.freeze(auth);