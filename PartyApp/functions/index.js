const functions = require('firebase-functions');

const algoliasearch = require('algoliasearch');
const admin = require('firebase-admin');

const ALGOLIA_APP_ID = "N5BVZA4FRH";
const ALGOLIA_ADMIN_KEY = "97e6599bb78a2011ba204d995be641f8";
const ALGOLIA_INDEX_NAME = "Users";

admin.initializeApp(functions.config().firebase)

exports.createUser = functions.firestore 
.document("users/{userId}")
.onCreate(async (snap, context) => {
  const newValue = snap.data();
  newValue.objectID = snap.id;

  var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

  var index = client.initIndex(ALGOLIA_INDEX_NAME);
  index.saveObject({
    name: newValue.name,
    objectId: newValue.objectId,
    photo: newValue.photoUrl
  });
});

exports.updateUser = functions.firestore
.document("users/{userID}")
.onUpdate(async (snap, context) => {
  const afterUpdate = snap.after.data();
  afterUpdate.objectID = snap.after.id;

  var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

  var index = client.initIndex(ALGOLIA_INDEX_NAME);
  index.saveObject(afterUpdate);
});

exports.deleteUser = functions.firestore
.document("users/{userID}")
.onDelete(async (snap, context) => {
  const oldID = snap.id;

  var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

  var index = client.initIndex(ALGOLIA_INDEX_NAME);
  index.deleteObject(oldID);
});

