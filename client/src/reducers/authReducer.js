import {
  SIGN_IN
} from '../actions/types';

const INITIAL_STATE = {
  user: {
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
    displayName: 'annonymous',
    isSignedIn: false
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};