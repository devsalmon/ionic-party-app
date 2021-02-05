import firebase from 'firebase'
// For the default version

// Your web app's Firebase configuration
var fbConfig = {
  apiKey: "AIzaSyAVvp3VEXlFr-G--hwhIWFPxj_taJdnUx8",
  authDomain: "party-up-dd240.firebaseapp.com",
  databaseURL: "https://party-up-dd240.firebaseio.com",
  projectId: "party-up-dd240",
  storageBucket: "party-up-dd240.appspot.com",
  messagingSenderId: "514271758518",
  appId: "1:514271758518:web:8cd56ee0a6768cf195be17",
  measurementId: "G-0B2KD82CVF"
};
// Initialize Firebase
firebase.initializeApp(fbConfig);

const messaging = firebase.messaging();

// Add the public key generated from the console here.
messaging.getToken();

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
messaging.getToken().then((currentToken) => {
 if (currentToken) {
    //Send the token to your server and update the UI if necessary
    //...
   console.log("current FCM token", currentToken)
 } else {
   //Show permission request UI
   console.log('No registration token available. Request permission to generate one.');
    //...
 }
}).catch((err) => {
 console.log('An error occurred while retrieving token. ', err);
  //...
});

export default firebase;