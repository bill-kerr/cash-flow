import { initExpressApp } from "./express";
import { initTypeOrm } from "./typeorm";
import { initFirebase } from "./firebase";

async function initializeApp() {
  initFirebase();
  await initTypeOrm();
  return initExpressApp();
}

export { initializeApp };
