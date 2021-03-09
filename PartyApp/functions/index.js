const functions = require('firebase-functions');

const algoliasearch = require('algoliasearch');
const admin = require('firebase-admin');

const ALGOLIA_APP_ID = "N5BVZA4FRH";
const ALGOLIA_ADMIN_KEY = "97e6599bb78a2011ba204d995be641f8";
const ALGOLIA_INDEX_NAME = "Users";

admin.initializeApp(functions.config().firebase)

// tbd - remember to redeploy at the end

exports.sendFriendRequestNotification = functions.firestore
.document("friend_requests/{userId}")
  .onUpdate(async (snap, context) => {
    var requests = snap.after.data().request_from

    // const getRequesterIdPromise = async() => {
    //   if (requests) {        
    //     admin.firestore().collection("users").doc(snap.after.id).get().then(doc => {
    //       // get user's device tokens
    //       let new_requester;
    //       for (var i=0; i < requests.length; i++) {
    //         if (doc.data().friend_notifications.includes(requests[i].id)) {
    //           // do nothing              
    //         } else { // add the id to the friend_notifications list if not already in there
    //           admin.firestore().collection("users").doc(snap.after.id).update({
    //             friend_notifications: firebase.firestore.FieldValue.arrayUnion(requests[i].id)          
    //           })      
    //           new_requester = requests[i].id; // return the value that wasn't in notifications already
    //         }
    //       }
    //       return new_requester;
    //     }).catch(errr => {
    //       console.log(err.message)
    //     });  
    //   } else {
    //     console.log("No request_from")
    //   }
    // }

    //const requestId = await getRequesterIdPromise;    
    console.log('JjHCeTY8k7btlTIsyMb4i8PVkUA3', ' has requested user: ', snap.after.id);

    const getDeviceTokensPromise = async() => {
      // Get the device notification token.
      await admin.firestore().collection("users").doc(snap.after.id).get().then(doc => {
        // get user's device tokens
        return doc.data().deviceTokens;
      }).catch(err => {
        console.log(err.message)
      });
    }

    // Get the requester's profile.
    const getRequesterProfilePromise = admin.auth().getUser('JjHCeTY8k7btlTIsyMb4i8PVkUA3');

    // The snapshot to the user's tokens.
    let tokensSnapshot;

    // The array containing all the user's tokens.
    let tokens;

    const results = await Promise.all([getDeviceTokensPromise, getRequesterProfilePromise]);
    tokensSnapshot = ['dF_4fAxkRXGnCTu8X1Bfh3:APA91bFGIvOg745Av4wHAJ3uFCHLfnEq5cNVZr7jAvCvtANXx0s-5cdLEt-PJw0GdX72X5qCPSsxb2nJLr_RrovvcYUABL7SICylMbNixLuKxEwBuZccHL4wpZILyrGHLzq5YTgRxqcW'];
    const requester = results[1];

    // Check if there are any device tokens.
    if (tokensSnapshot.length === 0) {
      return console.log('There are no notification tokens to send to.');
    }
    console.log('There are', tokensSnapshot.length, 'tokens to send notifications to.');
    console.log('Fetched requester profile', requester);

    // Notification details.
    const payload = {
      notification: {
        title: `You have a new friend request from ${requester.displayName}!`,
        body: 'Click to accept/reject their request',
        icon: requester.photoURL
      }
    };

    // Listing all tokens as an array.
    // tokens = Object.keys(tokensSnapshot.val());
    // Send notifications to all tokens.
    const response = await admin.messaging().sendToDevice(tokenSnapshot[0], payload);
    // For each message check if there was an error.
    const tokensToRemove = [];
    response.results.forEach((result, index) => {
      const error = result.error;
      if (error) {
        console.error('Failure sending notification to', tokens[index], error);
        // Cleanup the tokens who are not registered anymore.
        if (error.code === 'messaging/invalid-registration-token' ||
            error.code === 'messaging/registration-token-not-registered') {
          tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
        }
      }
    });
    return Promise.all(tokensToRemove);
})

exports.addAlgoliaUser = functions.firestore
.document("users/{userId}")
.onCreate(async (snap, context) => {
  admin.auth()
    .updateUser(snap.id, {
      displayName: snap.data().username,
      email: snap.data().email,
      phoneNumber: snap.data().phone_number,      
    })

  // adding index to algolia 
  const newValue = snap.data();
  newValue.objectID = snap.id;

  var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

  var index = client.initIndex(ALGOLIA_INDEX_NAME);
  index.saveObject({
    objectID: newValue.objectID,
    email: newValue.email,
    fullname: newValue.fullname,    
    id: newValue.id,    
    username: newValue.username,
  });
});

exports.updateAlgoliaUser = functions.firestore
.document("users/{userId}")
.onUpdate(async (snap, context) => {
  const afterUpdate = snap.after.data();
  afterUpdate.objectID = snap.after.id;
   // Notification details.
    const payload = {
      notification: {
        title: 'You have a new friend request from name !',
        body: 'Click to accept/reject their request',
      }
    };

    // Listing all tokens as an array.
    // tokens = Object.keys(tokensSnapshot.val());
    // Send notifications to all tokens.
    admin.messaging().sendToDevice("dF_4fAxkRXGnCTu8X1Bfh3:APA91bFGIvOg745Av4wHAJ3uFCHLfnEq5cNVZr7jAvCvtANXx0s-5cdLEt-PJw0GdX72X5qCPSsxb2nJLr_RrovvcYUABL7SICylMbNixLuKxEwBuZccHL4wpZILyrGHLzq5YTgRxqcW"
      ,payload);   

  var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

  var index = client.initIndex(ALGOLIA_INDEX_NAME);
  index.saveObject(afterUpdate);
});

exports.deleteAlgoliaUser = functions.firestore
.document("users/{userId}")
.onDelete(async (snap, context) => {
  const oldID = snap.id;
  
  var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

  var index = client.initIndex(ALGOLIA_INDEX_NAME);
  index.deleteObject(oldID);
});