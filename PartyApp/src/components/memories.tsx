import React, { useState, useEffect} from 'react';
import {
  IonText,
  IonItem,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonButtons,
  IonButton
} from '@ionic/react';
import firebase from '../firestore';
import moment from 'moment';

import Gallery from './gallery';
import Memory from './memory';

import { 
  chevronBackSharp
} from 'ionicons/icons';
import '../App.css'
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

const MemoryList = ({memoriesPage}) => {

  const [parties, setParties] = useState([]);  
  const [id, setID] = useState<string>('');
  const [inGallery, setInGallery] = useState(false);

  useEffect(() => {  
    // useeffect hook only runs after first render so it only runs once
    displayParties();
    // this means display parties only runs once
  },
  []);  

  // if memory card clicked, go to gallery
  const enter = (id) => {
    setInGallery(true)
    setID(id)
  }  

  const today = new Date();
  const yourparties = [];
  const partiesAttended = [];


  const displayParties = () => {
    // get current user 
    var current_user = firebase.auth().currentUser.uid;
    // get the document of the current user from firestore users collection
    firebase.firestore().collection("users").doc(current_user).get().then(function(doc) {      
      var i; // define counter for the for loop   
      // loop through all parties in the user's document as long as there are parties there
      if (doc.data().myParties.length > 0) {
        for (i = 0; i < doc.data().myParties.length; i++) {     
          // get party of the curr_id from the user's document
          let current_id = doc.data().myParties[i]
          firebase.firestore().collection("parties").doc(current_id).get().then(function(doc) {
            // setState to contian all the party documents from the user's document
            setParties(parties => [
              ...parties,
              {
                id: current_id,
                doc: doc,
              }
            ]);
          })
        }
      }
    })        
  }

  parties && parties.map(party_id => {
    let data = party_id.doc.data();
    // if the party has happened display on memories - if host is current user, diaply in hosted parties 
    if (moment(data.endTime).isBefore(today) && data.host === firebase.auth().currentUser.displayName) {           
      yourparties.push(party_id.doc)       
    } else if (moment(data.endTime).isBefore(today)) {
      partiesAttended.push(party_id.doc)
    }    
  });

  if (inGallery) {
    return(
        <>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="warning" fill="clear" onClick={() => setInGallery(false)}>
              <IonIcon icon={chevronBackSharp} />
            </IonButton>
          </IonButtons>
          <IonTitle>Memories</IonTitle>
          <IonButtons slot="end">
            <IonButton disabled></IonButton>
          </IonButtons>
        </IonToolbar>
        <Gallery id={id} key={id}/>
        </>
      )
  } else {
    return(
      <>
        { // if in memory page, show the toolbar with memories, otherwise don't
          memoriesPage ?
          <IonToolbar>
            <IonTitle>Memories</IonTitle>
          </IonToolbar> :
          null
        }
        <IonContent fullscreen={true}>
        <IonText class="ion-padding-start">Your parties</IonText>
        {
          yourparties.length === 0 ?
          <IonText class="ion-padding-start"> <br/> <br/> No hosted parties yet..</IonText> :
          yourparties.map(doc => {
            return(<Memory doc={doc} key={doc.id} click={() => enter(doc.id)}/>)          
          })
        }
        {
          memoriesPage ?
          <IonText class="ion-padding-start"><br/>Parties attended</IonText> :
          null
        }
        {
          partiesAttended.length === 0 && memoriesPage ?
          <IonText class="white-text"><br/>No attended parties yet..</IonText> :          
          null
        }  
        {
          partiesAttended.length > 0 && memoriesPage ? 
          partiesAttended.map(doc => {
            return(<Memory doc={doc} key={doc.id} click={() => enter(doc.id)}/>)          
          }) :
          null
        }              
        </IonContent>
      </>
    )
  }
}

export default MemoryList;