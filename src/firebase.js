import firebase from 'firebase'  
  const config = {
    apiKey: "AIzaSyAPNiKJhf7aqNTUNsdxIz-BvmmB8XsLuzI",
    authDomain: "beerbot-91a90.firebaseapp.com",
    databaseURL: "https://beerbot-91a90.firebaseio.com",
    projectId: "beerbot-91a90",
    storageBucket: "",
    messagingSenderId: "995330126089"
  };
  firebase.initializeApp(config);
export default firebase;
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();