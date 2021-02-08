const functions = require('firebase-functions');

const algoliasearch = require('algoliasearch');
const admin = require('firebase-admin');

const ALGOLIA_APP_ID = "N5BVZA4FRH";
const ALGOLIA_ADMIN_KEY = "97e6599bb78a2011ba204d995be641f8";
const ALGOLIA_INDEX_NAME = "Users";

admin.initializeApp(functions.config().firebase)

// tbd - remember to redeploy at the end
exports.addUser = functions.firestore
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

exports.updateUser = functions.firestore
.document("users/{userId}")
.onUpdate(async (snap, context) => {
  const afterUpdate = snap.after.data();
  afterUpdate.objectID = snap.after.id;

  var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

  var index = client.initIndex(ALGOLIA_INDEX_NAME);
  index.saveObject(afterUpdate);
});

exports.deleteUser = functions.firestore
.document("users/{userId}")
.onDelete(async (snap, context) => {
  const oldID = snap.id;
  
  var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

  var index = client.initIndex(ALGOLIA_INDEX_NAME);
  index.deleteObject(oldID);
});