import * as admin from 'firebase-admin';

class AuthService {

  static async verifyToken(token: string) {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log(decodedToken);
  }

}

export { AuthService };