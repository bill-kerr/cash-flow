import * as admin from "firebase-admin";

class AuthService {
  getUserFromToken(token: string) {
    return admin.auth().verifyIdToken(token);
  }
}

const authService = new AuthService();
Object.freeze(authService);
export { authService };
