class FirebaseError extends Error {
  constructor(message: string) {
    super(message);
    this.errorInfo.message = message;
  }

  errorInfo = {
    message: ''
  };
}

const fakeUser = {
  iss: 'https://securetoken.google.com/cash-flow-calculator',
  aud: 'cash-flow-calculator',
  auth_time: 1590180916,
  user_id: 'aaaaa',
  sub: 'bbbbb',
  iat: 1590180916,
  exp: 1590184516,
  email: 'test@test.com',
  email_verified: false,
  firebase: { identities: { email: ['test@test.com'] }, sign_in_provider: 'password' },
  uid: 'ccccc'
}

export function auth() {
  return { verifyIdToken }
}

const verifyIdToken = (token: string) => {
  if (token === 'reject-me') {
    throw new FirebaseError('Invalid auth token.');
  }
  return fakeUser;
};