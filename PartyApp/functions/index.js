const functions = require('firebase-functions');
const fetch = require("node-fetch");

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
    const afterdata = snap.after.data()
    const beforedata = snap.before.data()    
    var newrequests = afterdata.request_from ? afterdata.request_from : []
    var oldrequests = beforedata.request_from ? beforedata.request_from : []

    if (newrequests.length > oldrequests.length) { // check a new request was added to request_from
      var lastitem = newrequests.length - 1
      const requestId = newrequests[lastitem].id; // get newest request id     
      const requestName = newrequests[lastitem].name; // get newest request name

      admin.firestore().collection("users").doc(snap.after.id).get().then(doc => {
        // get user's device token      
        const token = doc.data().deviceToken;
        fetch('https://fcm.googleapis.com/fcm/send', {
          method: "POST", 
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization':'key=AAAAd7z8SLY:APA91bGDcq_D1ik3ppwxuQgp3d66IBusm8TICa04QC5nKDujDFWiLxAU0toYYgsMr9Kmz33femjOkTnl-EU6YZu_q55LQ8Vc0VA5wZNplCainzzdpyaFfSU0pLArv0HDlmvZ4-ydnO-C'
          },
          body: JSON.stringify({
            "priority": "high",
            "to": token,             
            "notification": {"title":"New Friend Request!","body": `${requestName} has sent a friend request`}
          })          
        }).then(res => {
          console.log("Request complete!");
          console.log("Token: ", token)
          return
        }).catch(err => {
          console.log(err.message)
          return
        });
        return
      }).catch(err => {
        console.log(err.message)
      });
    }
})

exports.subscribeToPartyTopic = functions.firestore
.document("users/{userId}")
  .onUpdate(async (snap, context) => {
    const afterdata = snap.after.data()
    const beforedata = snap.before.data()    
    var newInvites = afterdata.myInvites ? afterdata.myInvites : []
    var oldInvites = beforedata.myInvites ? beforedata.myInvites : []
    var newDeclinedInvites = afterdata.declinedInvites ? afterdata.declinedInvites : []
    var oldDeclinedInvites = beforedata.declinedInvites ? beforedata.declinedInvites : []
    const topic1 = newInvites.length > 0 && newInvites[newInvites.length-1].partyid // get last item
    const inviterId = newInvites.length > 0 && newInvites[newInvites.length-1].hostid // get last item
    const topic2 = newDeclinedInvites.length > 0 && newDeclinedInvites[newDeclinedInvites.length-1].partyid // get last item
  
    if (newInvites.length > oldInvites.length) { // check new invites have been received
      admin.messaging().subscribeToTopic(afterdata.deviceToken, topic1)
        .then(function(response) {
          admin.firestore().collection("users").doc(inviterId)
            .collection("myParties").doc(topic1).update({
              topicCreated: true
            })
          console.log('Successfully subscribed to topic');
          return
        })
        .catch(function(error) {
          console.log('Error subscribing to topic:', error.message);
          return
        }); 
    } else if (newDecliendInvites.length > oldDeclinedInvites.length) { // user has declined an invite
      admin.messaging().unsubscribeToTopic(afterdata.deviceToken, topic2)
        .then(function(response) {
          console.log('Successfully unsubscribed from topic');
          return
        })
        .catch(function(error) {
          console.log('Error subscribing to topic:', error.message);
          return
        }); 
    }
  })


exports.sendPartyNotification = functions.firestore
.document("users/{userId}/myParties/{partyId}")
  .onUpdate(async (snap, context) => {
    if (snap.before.data().topicCreated === false && snap.after.data().topicCreated === true) {
      fetch('https://fcm.googleapis.com/fcm/send', {
        method: "POST", 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization':'key=AAAAd7z8SLY:APA91bGDcq_D1ik3ppwxuQgp3d66IBusm8TICa04QC5nKDujDFWiLxAU0toYYgsMr9Kmz33femjOkTnl-EU6YZu_q55LQ8Vc0VA5wZNplCainzzdpyaFfSU0pLArv0HDlmvZ4-ydnO-C'
        },
        body: JSON.stringify({
          "priority": "high",
          "to": `/topics/${snap.after.id}`,
          "notification": {"title":"New Party Invite!","body": `${snap.after.data().hostname} has invited you to a party`}
        })          
      }).then(res => {
        console.log("Request complete! ", res.registration_ids);
        return
      }).catch(err => {
        console.log(err.message)
        return
      });
    } else if (snap.after.data().topicCreated === true) {
      fetch('https://fcm.googleapis.com/fcm/send', {
        method: "POST", 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization':'key=AAAAd7z8SLY:APA91bGDcq_D1ik3ppwxuQgp3d66IBusm8TICa04QC5nKDujDFWiLxAU0toYYgsMr9Kmz33femjOkTnl-EU6YZu_q55LQ8Vc0VA5wZNplCainzzdpyaFfSU0pLArv0HDlmvZ4-ydnO-C'
        },
        body: JSON.stringify({
          "priority": "high",
          "to": `/topics/${snap.after.id}`,
          "notification": {"title":"Party Details Updated!","body": `${snap.after.data().hostname} has updated their party`}
        })          
      }).then(res => {
        console.log("Request complete! ", res.registration_ids);
        return
      }).catch(err => {
        console.log(err.message)
        return
      });
    }    
})

exports.sendLikeNotification = functions.firestore 
.document("users/{userId}/myParties/{partyId}/pictures/{pictureId}")
  .onUpdate(async (snap, context) => {
    let newLikeCounter = snap.after.data().likeCounter ? snap.after.data().likeCounter : 0;
    let oldLikeCounter = snap.before.data().likeCounter ? snap.before.data().likeCounter : 0;
    let newLikes = snap.after.data().likes ? snap.after.data().likes : [];
    let userId = snap.after.data().takenByID; // user who took the picture 

    if (newLikeCounter > oldLikeCounter) { // new like
      let likerId = newLikes[newLikeCounter-1];
      admin.firestore().collection("users").doc(userId).get().then(doc1 => {
        let token = doc1.data().deviceToken;
        admin.firestore().collection("users").doc(likerId).get().then(doc2 => {
          let likerName = doc2.data().username
          fetch('https://fcm.googleapis.com/fcm/send', {
            method: "POST", 
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization':'key=AAAAd7z8SLY:APA91bGDcq_D1ik3ppwxuQgp3d66IBusm8TICa04QC5nKDujDFWiLxAU0toYYgsMr9Kmz33femjOkTnl-EU6YZu_q55LQ8Vc0VA5wZNplCainzzdpyaFfSU0pLArv0HDlmvZ4-ydnO-C'
            },
            body: JSON.stringify({
              "priority": "high",
              "to": token,
              "notification": {"title":`${likerName} liked your picture`}
            })                   
          }).then(res => {
            console.log("Request complete! ", token);
            return
          }).catch(err => {
            console.log(err.message)
            return
          });    
          return    
        }).catch(err => {
          return console.log(err.message)
        })
        return
      }).catch(err => {
        return console.log(err.message)
      })
    }
  })

exports.sendCommentNotification = functions.firestore 
.document("users/{userId}/myParties/{partyId}/pictures/{pictureId}/Comments/{commentId}")
  .onCreate(async (snap, context) => {
    let comment = snap.data().comment
    let commenter = snap.data().username // person who commented
    let currentuser = snap.data().pictureOwner

    admin.firestore().collection("users").doc(currentuser).get().then(doc1 => {
      let token = doc1.data().deviceToken;
      fetch('https://fcm.googleapis.com/fcm/send', {
        method: "POST", 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization':'key=AAAAd7z8SLY:APA91bGDcq_D1ik3ppwxuQgp3d66IBusm8TICa04QC5nKDujDFWiLxAU0toYYgsMr9Kmz33femjOkTnl-EU6YZu_q55LQ8Vc0VA5wZNplCainzzdpyaFfSU0pLArv0HDlmvZ4-ydnO-C'
        },
        body: JSON.stringify({
          "priority": "high",
          "to": token,
          "notification": {"title":`${commenter} commented on your picture:`, "body": `${comment}`}
        })                   
      }).then(res => {
        console.log("Request complete! ", token);
        return
      }).catch(err => {
        console.log(err.message)
        return
      });    
      return
    }).catch(err => {
      return console.log(err.message)
    })
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

  if (snap.data().phoneVerified === true) {
    admin.auth()
      .updateUser(snap.id, {
        emailVerified: true
      })    
  }

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