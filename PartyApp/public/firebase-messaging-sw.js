// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.2.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.5/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  projectId: "party-up-dd240",
  appId: "1:514271758518:web:8cd56ee0a6768cf195be17",
  databaseURL: "https://party-up-dd240.firebaseio.com",
  storageBucket: "party-up-dd240.appspot.com",
  locationId: "europe-west",
  apiKey: "AIzaSyAVvp3VEXlFr-G--hwhIWFPxj_taJdnUx8",
  authDomain: "party-up-dd240.firebaseapp.com",
  messagingSenderId: "514271758518",
  measurementId: "G-0B2KD82CVF"
}); 

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
// const messaging = firebase.messaging();

// messaging.onMessage((payload) => {
//     console.log("notification received", payload)
//   var obj = JSON.parse(payload.data.notification);
//   var notification = new Notification(obj.title, {
//     icon: obj.icon,
//     body: obj.body
//   });
// });

// messaging.onBackgroundMessage((payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   var obj = JSON.parse(payload.data.notification);
//   const notificationTitle = obj.title;
//   const notificationOptions = {
//     body: obj.body,
//     icon: obj.icon
//   };

//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });
