var admin = require("firebase-admin");

const serviceAccount = process.env.FIREBASE

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount))
});
  
export default admin;

//https://firebase.google.com/docs/firestore/security/get-started#auth-required