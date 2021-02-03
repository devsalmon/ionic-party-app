import React, { useState, useEffect } from 'react';
import {
  IonIcon,
  IonItem,
  IonButton,
  IonPage,
  IonContent, 
  IonToolbar, 
  IonSearchbar,
  IonRow,
  IonCol,
  IonText,
  IonAvatar,
  IonImg,
} from '@ionic/react';
import { 
  closeCircleSharp
} from 'ionicons/icons';
import '../App.css'
import firebase from '../firestore'
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Theme variables */
import '../variables.css';
import algoliasearch from 'algoliasearch/lite';

const Users: React.FC = () => {

  const searchClient = algoliasearch('N5BVZA4FRH', '10173d946e2ba5aa9ba4f9ae445cef48');
  const index = searchClient.initIndex('Users');
  const [hits, setHits] = useState([]);
  const [query, setQuery] = useState('');

  async function search(query) {
    const result = await index.search(query);
    setHits(result.hits);
    console.log(hits)
    setQuery(query)    
  }
// when current user searches for friend, create doc in friend requests with sender's id (current user's id),
// and add the reciever's id to the current user's request to array. Once this is done successfully, create doc with
// reciever's id and add current user's id (the sender's id) to the request from array. Next see do refresh.

    // return nothing if query is empty, just white spaces, or not letters
    return(
      <IonPage>
        <IonToolbar>
          <IonSearchbar class="searchbar" onIonChange={e => search(e.detail.value!)}></IonSearchbar>
        </IonToolbar>
        <IonContent>    
            {hits && query.trim() !== "" && (/[a-zA-z]//*all letters */).test(query) && hits.map(hit => 
              hit.objectID === firebase.auth().currentUser.uid ? null :
              <UserItem hit={hit} username={hit.username} id={hit.objectID}/>
            )}
        </IonContent>
      </IonPage>    
    )
  } 

const UserItem = ({hit, username, id}) => {

  const [addDisabled, setAddDisabled] = useState(false);
  const [cancelDisabled, setCancelDisabled] = useState(true);
  const [alreadyFriends, setAlreadyFriends] = useState(false);
  const [requestAlreadySent, setRequestAlreadySent] = useState(false);
  const friendRequestsRef = firebase.firestore().collection("friend_requests");
  const friendsRef = firebase.firestore().collection("friends");


  useEffect(() => {
    var receiver_user_id = id;
    var sender_user_id = firebase.auth().currentUser.uid;    
    friendRequestsRef.doc(sender_user_id).get() // check the current user hasn't already send a request
      .then((docSnapshot) => {
        if (docSnapshot.exists && docSnapshot.data().request_to) {
          if (docSnapshot.data().request_to.includes(receiver_user_id)) {
            // if user has already sent request to the user, disable add button 
            setRequestAlreadySent(true);
            setAddDisabled(true);
            setCancelDisabled(false);
          } else {
            setRequestAlreadySent(false);
            // check if the users are already friends, and if so, disable add button
            friendsRef.doc(sender_user_id).get()
              .then(docSnapshot => {
                if (docSnapshot.exists && docSnapshot.data().friends) {
                  if (docSnapshot.data().friends.includes(receiver_user_id)) {
                    setAlreadyFriends(true);
                    setAddDisabled(true); 
                    setCancelDisabled(false);            
                  } else {
                    setAddDisabled(false); 
                    setCancelDisabled(true); 
                    setAlreadyFriends(false);           
                  }
                }
              })
          }
        }
      })

  })

  const requestFriend = (username, objectID) => {
    var receiver_user_id = objectID
    var sender_user_id = firebase.auth().currentUser.uid
    //create doc with sender's id if it doesn't already exist and adds receiver's id to field.
    friendRequestsRef.doc(sender_user_id).get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          friendRequestsRef.doc(sender_user_id).update({
            request_to: firebase.firestore.FieldValue.arrayUnion(receiver_user_id)
          })                       
        } else {
          friendRequestsRef.doc(sender_user_id).set({id: sender_user_id, request_to: [receiver_user_id]}) // create the document
        }
    })
        //if successful, create doc w receiver's id and add sender's id to collection      
      .then(function(docRef) {
      friendRequestsRef.doc(receiver_user_id).get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            friendRequestsRef.doc(receiver_user_id).update({
              request_from: firebase.firestore.FieldValue.arrayUnion(sender_user_id)
            })    
          } else {
            friendRequestsRef.doc(receiver_user_id).set({id: receiver_user_id, request_from: [sender_user_id]}) // create the document
          }
      })        
          .then(function(docRef) {
            //currentState = "request_received"
            setAddDisabled(true); //disables add friend button
            setCancelDisabled(false); //enalbes cancel request button
          })
          .catch(function(error) {
            console.error("Error adding document: ", error);
        }); 
      })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }

  const removeRequest = (username, objectID) => {
    var receiver_user_id = objectID
    var sender_user_id = firebase.auth().currentUser.uid
    //create doc with sender's id if it doesn't already exist and adds receiver's id to field.
    friendRequestsRef.doc(sender_user_id).get()
      .then((docSnapshot) => {
        friendRequestsRef.doc(sender_user_id).update({
          request_to: firebase.firestore.FieldValue.arrayRemove(receiver_user_id)
        })       
    })
        //if successful, create doc w receiver's id and add sender's id to collection      
      .then(function(docRef) {
      friendRequestsRef.doc(receiver_user_id).get()
        .then((docSnapshot) => {
          friendRequestsRef.doc(receiver_user_id).update({
            request_from: firebase.firestore.FieldValue.arrayRemove(sender_user_id)
          })    
      })        
          .then(function(docRef) {
            //currentState = "request_received"
            setAddDisabled(false); //disables add friend button
            setCancelDisabled(true); //enalbes cancel request button
          })
          .catch(function(error) {
            console.error("Error adding document: ", error);
        }); 
      })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }

  const removeFriend = (username, objectID) => {
    var receiver_user_id = objectID
    var sender_user_id = firebase.auth().currentUser.uid
    //create doc with sender's id if it doesn't already exist and adds receiver's id to field.
    friendsRef.doc(sender_user_id).get()
      .then((docSnapshot) => {
        friendsRef.doc(sender_user_id).update({
          friends: firebase.firestore.FieldValue.arrayRemove(receiver_user_id)
        })       
    })
        //if successful, create doc w receiver's id and add sender's id to collection      
      .then(function(docRef) {
      friendsRef.doc(receiver_user_id).get()
        .then((docSnapshot) => {
          friendsRef.doc(receiver_user_id).update({
            friends: firebase.firestore.FieldValue.arrayRemove(sender_user_id)
          })    
      })        
          .then(function(docRef) {
            //currentState = "request_received"
            setAddDisabled(false); //disables add friend button
            setCancelDisabled(true); //enalbes cancel request button
          })
          .catch(function(error) {
            console.error("Error adding document: ", error);
        }); 
      })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }

  return(
    <IonRow>
      <IonCol size="9">
      <IonItem button key={id}>    
        <IonCol size="4">
          <IonAvatar>
            <img src={hit.photoURL ? hit.photoURL : "https://img.favpng.com/18/24/16/user-silhouette-png-favpng-4mEnHSRfJZD8p9eEBiRpA9GeS.jpg"} />
          </IonAvatar>  
        </IonCol>
        <IonCol offset="1" size="7">
          <IonText>{username}</IonText>   
        </IonCol>
      </IonItem>
      </IonCol>
      <IonCol>
        <IonButton 
        class="profile-button" 
        disabled={addDisabled} 
        onClick={() => requestFriend(username, id)}>
          <IonIcon slot="icon-only" src="assets/icon/Create.svg" />
        </IonButton>
        <IonButton 
        class="profile-button" 
        disabled={cancelDisabled} 
        onClick={alreadyFriends ? () => removeFriend(username, id) : () => removeRequest(username, id)}>
          <IonIcon icon={closeCircleSharp} />
        </IonButton> 
      </IonCol>
    </IonRow>
  )
}

export default Users;