import React, { useState, useEffect} from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import { Route, Redirect } from 'react-router-dom';
import {useDocument, useCollection} from 'react-firebase-hooks/firestore';
import {
  IonIcon,
  IonItem,
  IonGrid,
  IonButton,
  IonPage,
  IonHeader, 
  IonContent, 
  IonToolbar, 
  IonButtons, 
  IonTitle,
  IonSearchbar,
  IonRow,
  IonCol,
  IonInput,
  IonText,
  IonToast,
  IonFooter,
  IonAvatar,
  IonLoading,
  IonAlert,
  IonImg,
} from '@ionic/react';
import { 
  closeCircleSharp
} from 'ionicons/icons';
import '../App.css'
import firebase from '../firestore'
import moment from 'moment'
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

  const collectionRef = firebase.firestore().collection("friend_requests");
  const searchClient = algoliasearch('N5BVZA4FRH', '10173d946e2ba5aa9ba4f9ae445cef48');
  const index = searchClient.initIndex('Users');
  const [hits, setHits] = useState([]);
  const [query, setQuery] = useState('');
  const [addDisabled, setAddDisabled] = useState(false)
  const [cancelDisabled, setCancelDisabled] = useState(true)

  async function search(query) {
    const result = await index.search(query);
    setHits(result.hits);
    console.log(hits)
    setQuery(query)    
  }
//  basically if in friend_requests, if under ur id, u have another persons id 
//  (in a collection) w a doc with request_status equal to 'received' then that
//  person's id (the collection) should be used to get the persons profile and
//  display it in inbox w "accept request". To check that u have a new friend
//  request, I think we need to use an onSnapshot function which would be always
//  listening for a new entry in friend requests under ur id i think. If you get
//  that working u can attach the accept request function to the accept button.

// when current user searches for friend, create doc in friend requests with sender's id (current user's id),
// and add the reciever's id to the current user's request to array. Once this is done successfully, create doc with
// reciever's id and add current user's id (the sender's id) to the request from array. Next see do refresh.
  const addFriend = (name, objectID) => {
    
    //var currentState = "not_friends"
    //var disabledState = false
    var receiver_user_id = objectID
    var sender_user_id = firebase.auth().currentUser.uid
    //console.log(receiver_user_id)

    //create doc with sender's id if it doesn't already exist and adds receiver's id to field.
    collectionRef.doc(sender_user_id).get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          collectionRef.doc(sender_user_id).onSnapshot((doc) => {
            collectionRef.doc(sender_user_id).update({
              request_to: firebase.firestore.FieldValue.arrayUnion(receiver_user_id)
            })      
          });
        } else {
          collectionRef.doc(sender_user_id).set({id: sender_user_id, request_to: [receiver_user_id]}) // create the document
        }
    })
        //console.log("Document written with ID: ", docRef.id);
        //if successful, create doc w receiver's id and add sender's id to collection      
      .then(function(docRef) {
      collectionRef.doc(receiver_user_id).get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            collectionRef.doc(receiver_user_id).onSnapshot((doc) => {
              collectionRef.doc(receiver_user_id).update({
                request_from: firebase.firestore.FieldValue.arrayUnion(sender_user_id)
              })      
            });
          } else {
            collectionRef.doc(receiver_user_id).set({id: receiver_user_id, request_from: [sender_user_id]}) // create the document
          }
      })        
          //if successful
          .then(function(docRef) {
            //currentState = "request_received"
            setAddDisabled(true); //disables add friend button
            setCancelDisabled(false); //enalbes cancel request button
          })

          //if unsuccessful
          .catch(function(error) {
            console.error("Error adding document: ", error);
        }); 
      })

    //if unsuccessful
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

  }

  const resetButtons = () => {
    setAddDisabled(false); //disables add friend button
    setCancelDisabled(true); //enalbes cancel request button
  }

    // return nothing if query is empty, just white spaces, or not letters
    return(
      <IonPage>
        <IonToolbar>
          <IonSearchbar class="searchbar" onIonChange={e => search(e.detail.value!)}></IonSearchbar>
        </IonToolbar>
        <IonContent>    
            {hits && query.trim() !== "" && (/[a-zA-z]//*all letters */).test(query) && hits.map(hit => 
            <>
            <IonRow>
            <IonCol size="9">
            <IonItem button key={hit.objectID}>    
              <IonCol size="4">
                <IonAvatar>
                  <img src={hit.photoUrl} />
                </IonAvatar>  
              </IonCol>
              <IonCol offset="1" size="7">
                <IonText>{hit.name}</IonText>   
              </IonCol>
            </IonItem>
            </IonCol>
            <IonCol>
              <IonButton class="profile-button" disabled={addDisabled} onClick={() => addFriend(hit.name, hit.objectID)}>
                <IonIcon slot="icon-only" src="assets/icon/Create.svg" />
              </IonButton>
              <IonButton class="profile-button" disabled={cancelDisabled} onClick={resetButtons}>
                <IonIcon icon={closeCircleSharp} />
              </IonButton> 
            </IonCol>
            </IonRow>
            </>)}
        </IonContent>
      </IonPage>    
    )
  } 

export default Users;