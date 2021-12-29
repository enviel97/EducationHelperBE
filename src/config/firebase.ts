import { firebaseConfig, storageBucket } from "../helper/dotenv";
import RFA, { firestore } from "firebase-admin";

let admin: RFA.app.App;

const config = async (): Promise<void> => {
  try {
    admin = RFA.initializeApp({
      credential: RFA.credential.cert(firebaseConfig as any),
    });
    console.log(`[Firebase connect]: ${admin.messaging().app.name}`);
  } catch (error) {
    console.log(`[Firebase error]:\n${error}`);
  }
};

const firebase = {
  getStorage: () => admin.storage().bucket(storageBucket),
  config: () => {
    delete (firebase as any)["config"];
    return config();
  },
};

export default firebase;
